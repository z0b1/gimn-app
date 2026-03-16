"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";
import { NotificationType } from "@prisma/client";

function assertAuthenticated() {
  const { userId: clerkId, sessionClaims } = auth();
  if (!clerkId) {
    throw new Error("Unauthorized");
  }
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  return { clerkId, role };
}

async function getDbUser(clerkId: string) {
  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, name: true, email: true },
  });
  if (!dbUser) throw new Error("User not found");
  return dbUser;
}

async function ensureChannelAccess(channelId: string, clerkId: string, role?: string) {
  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    select: {
      id: true,
      name: true,
      memberships: { select: { user: { select: { clerkId: true, id: true } } } },
    },
  });

  if (!channel) {
    throw new Error("Kanal ne postoji.");
  }

  const isMember = channel.memberships.some((m) => m.user.clerkId === clerkId);
  if (!isMember && role !== "ADMIN") {
    throw new Error("Nemate pristup ovom kanalu.");
  }

  return channel;
}

export async function createChannelMessage(channelId: string, content: string) {
  const { clerkId, role } = assertAuthenticated();
  const dbUser = await getDbUser(clerkId);
  const channel = await ensureChannelAccess(channelId, clerkId, role);

  const trimmedContent = content.trim();
  if (!trimmedContent) {
    throw new Error("Poruka ne može biti prazna.");
  }

  const message = await prisma.feedMessage.create({
    data: {
      content: trimmedContent,
      userId: dbUser.id,
      channelId: channelId,
    },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  // Notify other channel members (best-effort)
  const recipientIds = channel.memberships
    .map((m) => m.user.id)
    .filter((id) => id !== dbUser.id);

  await Promise.all(
    recipientIds.map((recipientId) =>
      createNotification({
        userId: recipientId,
        issuerId: dbUser.id,
        type: NotificationType.COMMENT,
        title: `Nova poruka u kanalu ${channel.name}`,
        message: trimmedContent.slice(0, 140),
        link: `/kanali/${channelId}`,
      })
    )
  );

  revalidatePath(`/kanali/${channelId}`);

  return {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt,
    user: message.user,
  };
}

export async function toggleChannelMessageLike(messageId: string) {
  const { clerkId, role } = assertAuthenticated();
  const dbUser = await getDbUser(clerkId);

  const message = await prisma.feedMessage.findUnique({
    where: { id: messageId },
    select: {
      id: true,
      content: true,
      channelId: true,
      userId: true,
      channel: {
        select: {
          id: true,
          name: true,
          memberships: { select: { user: { select: { clerkId: true } } } },
        },
      },
    },
  });

  if (!message || !message.channelId || !message.channel) {
    throw new Error("Poruka nije pronađena.");
  }

  const isMember = message.channel.memberships.some((m) => m.user.clerkId === clerkId);
  if (!isMember && role !== "ADMIN") {
    throw new Error("Nemate pristup ovom kanalu.");
  }

  const existing = await prisma.channelMessageLike.findUnique({
    where: { messageId_userId: { messageId, userId: dbUser.id } },
  });

  if (existing) {
    await prisma.channelMessageLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.channelMessageLike.create({
      data: { messageId, userId: dbUser.id },
    });

    await createNotification({
      userId: message.userId,
      issuerId: dbUser.id,
      type: NotificationType.LIKE,
      title: `Reakcija na poruku u ${message.channel.name}`,
      message: message.content.slice(0, 140),
      link: `/kanali/${message.channelId}`,
    });
  }

  const likeCount = await prisma.channelMessageLike.count({ where: { messageId } });

  revalidatePath(`/kanali/${message.channelId}`);

  return { liked: !existing, likeCount };
}

export async function addChannelMessageComment(messageId: string, content: string) {
  const { clerkId, role } = assertAuthenticated();
  const dbUser = await getDbUser(clerkId);

  const message = await prisma.feedMessage.findUnique({
    where: { id: messageId },
    select: {
      id: true,
      content: true,
      channelId: true,
      userId: true,
      channel: {
        select: {
          id: true,
          name: true,
          memberships: { select: { user: { select: { clerkId: true } } } },
        },
      },
    },
  });

  if (!message || !message.channelId || !message.channel) {
    throw new Error("Poruka nije pronađena.");
  }

  const isMember = message.channel.memberships.some((m) => m.user.clerkId === clerkId);
  if (!isMember && role !== "ADMIN") {
    throw new Error("Nemate pristup ovom kanalu.");
  }

  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error("Komentar ne može biti prazan.");
  }

  const comment = await prisma.channelMessageComment.create({
    data: {
      content: trimmed,
      messageId,
      userId: dbUser.id,
    },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  if (message.userId !== dbUser.id) {
    await createNotification({
      userId: message.userId,
      issuerId: dbUser.id,
      type: NotificationType.COMMENT,
      title: `Novi komentar u ${message.channel.name}`,
      message: trimmed.slice(0, 140),
      link: `/kanali/${message.channelId}`,
    });
  }

  revalidatePath(`/kanali/${message.channelId}`);

  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    user: comment.user,
  };
}
