"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createChannelMessage(channelId: string, content: string) {
  const { userId: clerkId, sessionClaims } = auth();
  if (!clerkId) {
    throw new Error("Unauthorized");
  }

  const role = (sessionClaims?.metadata as { role?: string })?.role;

  const dbUser = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });
  if (!dbUser) throw new Error("User not found");

  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    select: {
      id: true,
      memberships: { select: { user: { select: { clerkId: true } } } },
    },
  });

  if (!channel) {
    throw new Error("Kanal ne postoji.");
  }

  const isMember = channel.memberships.some((m) => m.user.clerkId === clerkId);
  if (!isMember && role !== "ADMIN") {
    throw new Error("Nemate pristup ovom kanalu.");
  }

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

  revalidatePath(`/kanali/${channelId}`);

  return {
    id: message.id,
    content: message.content,
    createdAt: message.createdAt,
    user: message.user,
  };
}
