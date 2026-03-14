"use server";

import prisma from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

export async function updateUserName(userId: string, clerkId: string, newName: string) {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can edit users.");
  }

  if (!newName || newName.trim() === "") {
    throw new Error("Name cannot be empty.");
  }

  // 1. Update in Database
  await prisma.user.update({
    where: { id: userId },
    data: { name: newName },
  });

  // 2. Update in Clerk 
  try {
    const clerk = clerkClient();
    const [firstName, ...lastNames] = newName.split(" ");
    const lastName = lastNames.join(" ");

    await clerk.users.updateUser(clerkId, {
      firstName,
      lastName,
    });
  } catch (error) {
    console.error("Failed to sync name with Clerk:", error);
    // Not failing the whole request as DB update succeeded, but logging is vital.
  }

  revalidatePath("/admin/korisnici");
}

export async function updateUserRole(userId: string, clerkId: string, newRole: Role) {
  const { sessionClaims, userId: currentUserId } = auth();
  const adminRole = (sessionClaims?.metadata as { role?: string })?.role;

  if (adminRole !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can edit roles.");
  }

  // Prevent users from demoting themselves to avoid accidental lockout
  if (currentUserId === clerkId) {
    throw new Error("You cannot change your own role.");
  }

  // 1. Update in Database
  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  // 2. Update in Clerk Public Metadata
  try {
    const clerk = clerkClient();
    await clerk.users.updateUserMetadata(clerkId, {
      publicMetadata: {
        role: newRole, // Matches what our JWT pulls out
      },
    });
  } catch (error) {
    console.error("Failed to sync role with Clerk:", error);
  }

  revalidatePath("/admin/korisnici");
}
