"use server";

import prisma from "@/lib/db";
import { getOrCreateUser } from "./posts";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";


export async function toggleLike(postId: string) {
  const dbUser = await getOrCreateUser();
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
    const like = await prisma.gimnazijaFeedLike.create({
      data: {
        userId: dbUser.id,
        postId
      },
      include: { post: { select: { userId: true, content: true } } }
    });

    // Notify Post Author (always enable for testing per user request)
    await createNotification({
      userId: like.post.userId,
      issuerId: dbUser.id,
      type: "LIKE",
      title: "Novi lajk",
      message: `${dbUser.name} je lajkovao vašu objavu: "${like.post.content.substring(0, 30)}..."`,
      link: "/gimnazija-feed",
    });
  }

  // We don't strictly revalidate the whole path here because we'll do optimistic UI updates,
  // but it's good practice to ensure the backend aligns on hard reloads.
  revalidatePath("/gimnazija-feed");
}

export async function addComment(postId: string, content: string) {
  const dbUser = await getOrCreateUser();
  if (!dbUser) throw new Error("Moraš biti prijavljen.");

  if (!content.trim()) throw new Error("Komentar ne može biti prazan.");

  const comment = await prisma.gimnazijaFeedComment.create({
    data: {
      content,
      userId: dbUser.id,
      postId
    },
    include: { post: { select: { userId: true, content: true } } }
  });

  // Notify Post Author
  await createNotification({
    userId: comment.post.userId,
    issuerId: dbUser.id,
    type: "COMMENT",
    title: "Novi komentar",
    message: `${dbUser.name} je prokomentarisao vašu objavu: "${content.substring(0, 50)}..."`,
    link: "/gimnazija-feed",
  });

  revalidatePath("/gimnazija-feed");
}
