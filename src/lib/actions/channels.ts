"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";

function assertAdmin() {
  const { sessionClaims, userId } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can manage channels.");
  }

  if (!userId) {
    throw new Error("Unauthorized: Missing authenticated user.");
  }

  return userId;
}

async function resolveDbUserId(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function createChannel(name: string, description?: string) {
  const clerkId = assertAdmin();
  const trimmedName = name.trim();
  const trimmedDescription = description?.trim() || null;

  if (!trimmedName) {
    throw new Error("Naziv kanala je obavezan.");
  }

  const createdById = await resolveDbUserId(clerkId);

  const channel = await prisma.channel.create({
    data: {
      name: trimmedName,
      description: trimmedDescription,
      createdById: createdById ?? undefined,
    },
  });

  revalidatePath("/admin/korisnici");

  return {
    id: channel.id,
    name: channel.name,
    description: channel.description ?? null,
  };
}

export async function deleteChannel(channelId: string) {
  assertAdmin();

  const existing = await prisma.channel.findUnique({
    where: { id: channelId },
    select: { id: true },
  });

  if (!existing) {
    throw new Error("Kanal ne postoji.");
  }

  await prisma.channel.delete({
    where: { id: channelId },
  });

  revalidatePath("/admin/korisnici");
  revalidatePath("/kanali");
}

export async function addUserToChannel(channelId: string, userId: string) {
  assertAdmin();

  const [channel, user] = await Promise.all([
    prisma.channel.findUnique({ where: { id: channelId }, select: { id: true, name: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true } }),
  ]);

  if (!channel) {
    throw new Error("Kanal ne postoji.");
  }

  if (!user) {
    throw new Error("Korisnik ne postoji.");
  }

  const membership = await prisma.channelMembership.upsert({
    where: { userId_channelId: { userId, channelId } },
    update: {},
    create: { userId, channelId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  });

  // Send email notification (best-effort)
  const { GMAIL_USER, GMAIL_APP_PASSWORD, NEXT_PUBLIC_APP_URL } = process.env;
  if (GMAIL_USER && GMAIL_APP_PASSWORD && membership.user.email) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD,
        },
      });

      const appUrl = NEXT_PUBLIC_APP_URL || "https://gimn-app-smoky.vercel.app";
      await transporter.sendMail({
        from: `"GimnApp" <${GMAIL_USER}>`,
        to: membership.user.email,
        subject: `Dodat si u kanal "${channel.name}"`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #334155;">
            <h2 style="margin: 0 0 12px 0; color: #4f46e5;">Pozdrav ${membership.user.name || "članu"},</h2>
            <p style="margin: 0 0 12px 0;">Administrator te je dodao u kanal <strong>${channel.name}</strong>.</p>
            <p style="margin: 0 0 16px 0;">Otvorite kanal kako biste videli detalje i članove.</p>
            <a href="${appUrl}/kanali/${channelId}" style="display: inline-block; padding: 12px 18px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 10px; font-weight: 700;">Otvori kanal</a>
            <p style="margin: 16px 0 0 0; font-size: 12px; color: #94a3b8;">Ako niste očekivali ovu poruku, obratite se administratoru.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("[Channel email] Failed to send invite:", error);
    }
  } else {
    console.warn("[Channel email] Skipped send", {
      hasUser: !!GMAIL_USER,
      hasPass: !!GMAIL_APP_PASSWORD,
      hasRecipient: !!membership.user.email,
    });
  }

  revalidatePath("/admin/korisnici");

  return {
    id: membership.id,
    channelId,
    user: membership.user,
  };
}

export async function removeUserFromChannel(channelId: string, userId: string) {
  assertAdmin();

  await prisma.channelMembership.delete({
    where: { userId_channelId: { userId, channelId } },
  });

  revalidatePath("/admin/korisnici");
}
