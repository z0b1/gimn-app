"use server";

import prisma from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { Role } from "@prisma/client";

export async function getOrCreateUser() {
  const { userId } = auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Korisnik";
  const email = user.emailAddresses[0]?.emailAddress || `${userId}@clerk.com`;

  const metadata = user.publicMetadata as { role?: string } | undefined;
  const role = metadata?.role === "ADMIN" ? "ADMIN" : metadata?.role === "REDAKCIJA" ? "REDAKCIJA" : "STUDENT";

  return await prisma.user.upsert({
    where: { email: email },
    update: { 
      clerkId: userId, 
      name,
      role: role as Role,
    },
    create: {
      clerkId: userId,
      name,
      email,
      role: role as Role,
    },
  });
}

export async function createFeedPost(formData: FormData) {
  const dbUser = await getOrCreateUser();
  if (!dbUser) {
    throw new Error("You must be logged in to post.");
  }

  const content = formData.get("content")?.toString();
  const mediaUrl = formData.get("mediaUrl")?.toString() || null;
  const mediaType = formData.get("mediaType")?.toString() || null;

  if (!content) {
    throw new Error("Sadržaj je obavezan.");
  }

  await prisma.gimnazijaFeedPost.create({
    data: {
      content,
      mediaUrl,
      mediaType,
      userId: dbUser.id,
    },
  });

  revalidatePath("/");
  revalidatePath("/gimnazija-feed");
}

export async function createNews(formData: FormData) {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || (role !== "ADMIN" && role !== "REDAKCIJA")) {
    throw new Error("Unauthorized");
  }

  const dbUser = await getOrCreateUser();
  if (!dbUser) {
    throw new Error("User not found");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const mediaUrl = formData.get("mediaUrl") as string | null;
  const mediaType = formData.get("mediaType") as string | null;
  const body = formData.get("body") as string | null;

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  await prisma.news.create({
    data: {
      title,
      content,
      body: body || null,
      mediaUrl,
      mediaType,
      lastEditedById: dbUser.id,
      lastEditedAt: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/vesti");
}

export async function updateNewsBody(id: string, body: string) {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || (role !== "ADMIN" && role !== "REDAKCIJA")) {
    throw new Error("Unauthorized");
  }

  const dbUser = await getOrCreateUser();
  if (!dbUser) {
    throw new Error("User not found");
  }

  const trimmedBody = body.trim();
  if (!trimmedBody) {
    throw new Error("Sadržaj članka ne može biti prazan.");
  }

  await prisma.news.update({
    where: { id },
    data: {
      body: trimmedBody,
      lastEditedById: dbUser.id,
      lastEditedAt: new Date(),
    },
  });

  revalidatePath("/vesti");
  revalidatePath(`/vesti/${id}`);
}

export async function createRule(formData: FormData) {
  const { userId, sessionClaims } = auth();
  const metadata = sessionClaims?.metadata as { role?: string } | undefined;
  const publicMetadata = sessionClaims?.publicMetadata as { role?: string } | undefined;
  const directRole = (sessionClaims as unknown as { role?: string })?.role;
  const role = metadata?.role || publicMetadata?.role || directRole;

  if (!userId || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const mediaUrl = formData.get("mediaUrl") as string | null;
  const mediaType = formData.get("mediaType") as string | null;

  if (!title || !description) {
    throw new Error("Title and description are required.");
  }

  await prisma.rule.create({
    data: {
      title,
      description,
      mediaUrl,
      mediaType,
      status: "ACTIVE",
    },
  });

  revalidatePath("/");
  revalidatePath("/glasanje");
  revalidatePath("/admin");
}

export async function castVote(ruleId: string, value: boolean) {
  const dbUser = await getOrCreateUser();
  if (!dbUser) throw new Error("Moraš biti prijavljen da bi glasao.");

  // Check if rule exists and is still active
  const rule = await prisma.rule.findUnique({
    where: { id: ruleId }
  });
  if (!rule) throw new Error("Proposal not found");

  const expiryDate = new Date(rule.createdAt);
  expiryDate.setDate(expiryDate.getDate() + 7);
  if (new Date() > expiryDate) {
    throw new Error("Glasanje je završeno.");
  }

  await prisma.vote.upsert({
    where: {
      userId_ruleId: {
        userId: dbUser.id,
        ruleId,
      }
    },
    update: { value },
    create: {
      userId: dbUser.id,
      ruleId,
      value,
    }
  });

  revalidatePath("/glasanje");
  revalidatePath("/");
}

export async function deleteNews(id: string) {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || (role !== "ADMIN" && role !== "REDAKCIJA")) {
    throw new Error("Unauthorized");
  }

  await prisma.news.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/vesti");
}

export async function deleteRule(id: string) {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Delete associated votes first to satisfy foreign key constraints
  await prisma.vote.deleteMany({
    where: { ruleId: id },
  });

  await prisma.rule.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/glasanje");
  revalidatePath("/admin");
}

export async function deleteFeedPost(id: string) {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (!userId || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.gimnazijaFeedPost.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/gimnazija-feed");
}
