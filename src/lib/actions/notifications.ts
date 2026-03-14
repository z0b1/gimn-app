"use server";

import prisma from "@/lib/db";
import nodemailer from "nodemailer";
import { NotificationType } from "@prisma/client";

interface CreateNotificationParams {
  userId: string;       // Recipient
  issuerId: string;     // Person who triggered it
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

export async function createNotification(params: CreateNotificationParams) {
  const { userId, issuerId, type, title, message, link } = params;

  try {
    // 1. Save to Database
    const notification = await prisma.notification.create({
      data: {
        userId,
        issuerId,
        type,
        title,
        message,
        link,
      },
      include: {
        user: { select: { email: true, name: true } },
        issuer: { select: { name: true } },
      }
    });

    // 2. Send Email Notification
    const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;
    if (GMAIL_USER && GMAIL_APP_PASSWORD && notification.user.email) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_APP_PASSWORD,
        },
      });

      const emailHtml = `
        <div style="font-family: sans-serif; padding: 20px; color: #334155;">
          <h2 style="color: #4f46e5;">Zdravo, ${notification.user.name || "Korisniče"}!</h2>
          <p style="font-size: 16px;">Imate novo obaveštenje na GimnApp-u:</p>
          <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; font-size: 18px; color: #1e293b;">${title}</p>
            <p style="margin: 10px 0 0 0; color: #475569;">${message}</p>
          </div>
          ${link ? `<a href="${process.env.NEXT_PUBLIC_APP_URL || ''}${link}" style="display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Pogledaj detalje</a>` : ''}
          <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">
            Ovo je automatsko obaveštenje. Možete isključiti email obaveštenja u podešavanjima profila (uskoro).
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: `"GimnApp" <${GMAIL_USER}>`,
        to: notification.user.email,
        subject: `Novo obaveštenje: ${title}`,
        html: emailHtml,
      });
    }

    return { success: true, notification };
  } catch (error) {
    console.error("Failed to create/send notification:", error);
    return { success: false, error };
  }
}

export async function getNotifications() {
  const { userId: clerkId } = (await import("@clerk/nextjs/server")).auth();
  if (!clerkId) return [];

  const dbUser = await prisma.user.findUnique({ where: { clerkId } });
  if (!dbUser) return [];

  return await prisma.notification.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    include: { issuer: { select: { name: true } } },
    take: 20,
  });
}

export async function markAsRead(notificationId: string) {
  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export async function markAllAsRead() {
  const { userId: clerkId } = (await import("@clerk/nextjs/server")).auth();
  if (!clerkId) return;

  const dbUser = await prisma.user.findUnique({ where: { clerkId } });
  if (!dbUser) return;

  await prisma.notification.updateMany({
    where: { userId: dbUser.id, isRead: false },
    data: { isRead: true },
  });
}
