"use server";

import prisma from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createFeedPost(formData: FormData) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("You must be logged in to post.");
  }

  const user = await currentUser();
  if (!user) throw new Error("User not found");

  const content = formData.get("content") as string;
  const mediaUrl = formData.get("mediaUrl") as string | null;
  const mediaType = formData.get("mediaType") as string | null;

  if (!content) {
    throw new Error("Content is required.");
  }

  // Ensure user exists in our DB
  const dbUser = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
    },
    create: {
      clerkId: userId,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  await prisma.gimnazijaFeedPost.create({
    data: {
      content,
      mediaUrl,
      mediaType,
      userId: dbUser.id,
    },
  });

  revalidatePath("/gimnazija-feed");
}

export async function createNews(formData: FormData) {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const mediaUrl = formData.get("mediaUrl") as string | null;
  const mediaType = formData.get("mediaType") as string | null;

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  await prisma.news.create({
    data: {
      title,
      content,
      mediaUrl,
      mediaType,
    },
  });

  revalidatePath("/vesti");
}
