"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

async function getDbUser() {
  const { userId } = auth();
  if (!userId) return null;
  return await prisma.user.findUnique({
    where: { clerkId: userId }
  });
}

export async function toggleLike(postId: string) {
  const dbUser = await getDbUser();
  if (!dbUser) throw new Error("Moraš biti prijavljen.");

  const existingLike = await prisma.gimnazijaFeedLike.findUnique({
    where: {
      userId_postId: {
        userId: dbUser.id,
        postId
      }
    }
  });

  if (existingLike) {
    // Unlike
    await prisma.gimnazijaFeedLike.delete({
      where: { id: existingLike.id }
    });
  } else {
    // Like
    await prisma.gimnazijaFeedLike.create({
      data: {
        userId: dbUser.id,
        postId
      }
    });
  }

  // We don't strictly revalidate the whole path here because we'll do optimistic UI updates,
  // but it's good practice to ensure the backend aligns on hard reloads.
  revalidatePath("/gimnazija-feed");
}

export async function addComment(postId: string, content: string) {
  const dbUser = await getDbUser();
  if (!dbUser) throw new Error("Moraš biti prijavljen.");

  if (!content.trim()) throw new Error("Komentar ne može biti prazan.");

  await prisma.gimnazijaFeedComment.create({
    data: {
      content,
      userId: dbUser.id,
      postId
    }
  });

  revalidatePath("/gimnazija-feed");
}
