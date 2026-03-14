"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Extracts role robustly
function getRole() {
  const { sessionClaims } = auth();
  const metadata = sessionClaims?.metadata as { role?: string } | undefined;
  const publicMetadata = sessionClaims?.publicMetadata as { role?: string } | undefined;
  const directRole = (sessionClaims as unknown as { role?: string })?.role;
  return metadata?.role || publicMetadata?.role || directRole;
}

async function getDbUser() {
  const { userId } = auth();
  if (!userId) return null;
  return await prisma.user.findUnique({ where: { clerkId: userId } });
}

// ─── Submit a new question (any logged-in user) ──────────────────────────────
export async function submitQuestion(content: string) {
  const dbUser = await getDbUser();
  if (!dbUser) throw new Error("Moraš biti prijavljen.");

  if (!content.trim()) throw new Error("Pitanje ne može biti prazno.");

  await prisma.question.create({
    data: { content, userId: dbUser.id },
  });

  revalidatePath("/pitanja");
}

// ─── Add a reply (any logged-in user) ────────────────────────────────────────
export async function addReply(questionId: string, content: string) {
  const dbUser = await getDbUser();
  if (!dbUser) throw new Error("Moraš biti prijavljen.");

  if (!content.trim()) throw new Error("Odgovor ne može biti prazan.");

  await prisma.questionReply.create({
    data: { content, userId: dbUser.id, questionId },
  });

  revalidatePath("/pitanja");
}

// ─── Resolve a question (admin only) ─────────────────────────────────────────
export async function resolveQuestion(questionId: string) {
  const { userId } = auth();
  const role = getRole();
  if (!userId || role !== "ADMIN") throw new Error("Unauthorized");

  await prisma.question.update({
    where: { id: questionId },
    data: { isResolved: true },
  });

  revalidatePath("/pitanja");
}

// ─── Answer question (admin only, kept for compatibility) ─────────────────────
export async function answerQuestion(questionId: string, answer: string) {
  const { userId } = auth();
  const role = getRole();

  if (!userId || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  if (!answer.trim()) {
    throw new Error("Answer cannot be empty");
  }

  await prisma.question.update({
    where: { id: questionId },
    data: { answer },
  });

  revalidatePath("/pitanja");
}

export async function handleProposal(questionId: string, isAccepted: boolean, content: string, titleStr?: string) {
  const { userId } = auth();
  const role = getRole();

  if (!userId || role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Find the exact title from the content string [PREDLOG: <Title>]
  const match = content.match(/\[PREDLOG:\s*(.*?)\]/);
  const extractedTitle = match ? match[1] : (titleStr || "Nepoznati Predlog");

  if (isAccepted) {
    const description = content.split('\n\n').slice(1).join('\n\n') || content;

    await prisma.rule.create({
      data: {
        title: extractedTitle,
        description: description,
        status: "ACTIVE",
      }
    });

    await prisma.question.update({
      where: { id: questionId },
      data: { answer: "Predlog je prihvaćen i zvanično prosleđen na glasanje." }
    });
  } else {
    const answer = titleStr ? `Predlog je odbijen: ${titleStr}` : "Predlog je odbijen od strane parlamenta.";

    await prisma.question.update({
      where: { id: questionId },
      data: { answer }
    });
  }

  revalidatePath("/pitanja");
  revalidatePath("/glasanje");
  revalidatePath("/");
}
