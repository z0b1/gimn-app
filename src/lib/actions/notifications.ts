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
    const recipientEmail = notification.user.email;

    console.log(`[Notification] Attempting email send to: ${recipientEmail}`);

    if (GMAIL_USER && GMAIL_APP_PASSWORD && recipientEmail) {
      try {
        console.log(`[Email] Creating transporter for ${GMAIL_USER}`);
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD,
          },
        });

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://gimn-app.vercel.app";
        const emailHtml = `
          <div style="font-family: sans-serif; padding: 20px; color: #334155; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #4f46e5; margin-top: 0;">Zdravo, ${notification.user.name || "Korisniče"}! 🔔</h2>
            <p style="font-size: 16px; line-height: 1.5;">Imate novo obaveštenje na platformi <strong>GimnApp</strong>:</p>
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px dashed #cbd5e1;">
              <p style="margin: 0; font-weight: bold; font-size: 18px; color: #1e293b;">${title}</p>
              <p style="margin: 10px 0 0 0; color: #475569; line-height: 1.4;">${message}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${appUrl}${link}" style="display: inline-block; background: #4f46e5; color: white; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
                Pogledaj detalje
              </a>
            </div>
            <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 30px 0;">
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">
              Ovo je automatsko obaveštenje Učeničkog parlamenta Šabačke gimnazije.<br> 
              Možete isključiti email obaveštenja u podešavanjima profila (uskoro).
            </p>
          </div>
        `;

        await transporter.sendMail({
          from: `"GimnApp Notifications" <${GMAIL_USER}>`,
          to: recipientEmail,
          subject: `${title} | GimnApp 🔔`,
          html: emailHtml,
        });
        console.log(`[Email] SUCCESS: Sent to ${recipientEmail}`);
      } catch (mailError) {
        console.error("[Email] ERROR sending to", recipientEmail, ":", mailError);
      }
    } else {
      console.warn("[Email] SKIPPED. Reason:", {
        user: !!GMAIL_USER,
        pass: !!GMAIL_APP_PASSWORD,
        recipient: !!recipientEmail
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
