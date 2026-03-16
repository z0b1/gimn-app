"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

export async function addUserToChannel(channelId: string, userId: string) {
  assertAdmin();

  const [channel, user] = await Promise.all([
    prisma.channel.findUnique({ where: { id: channelId }, select: { id: true } }),
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
