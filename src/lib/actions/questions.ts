"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";

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

  const reply = await prisma.questionReply.create({
    data: { content, userId: dbUser.id, questionId },
    include: { question: { select: { userId: true } } }
  });

  // Notify Question Author (always enable for testing per user request)
  await createNotification({
    userId: reply.question.userId,
    issuerId: dbUser.id,
    type: "REPLY",
    title: "Nova poruka na vaše pitanje",
    message: `${dbUser.name} je odgovorio na vaše pitanje: "${content.substring(0, 50)}..."`,
    link: "/pitanja",
  });

  revalidatePath("/pitanja");
}

// ─── Resolve a question (admin only) ─────────────────────────────────────────
export async function resolveQuestion(questionId: string) {
  const dbUser = await getDbUser();
  if (!dbUser) throw new Error("Unauthorized");

  const question = await prisma.question.update({
    where: { id: questionId },
    data: { isResolved: true },
    include: { user: { select: { id: true } } }
  });

  // Notify author
  await createNotification({
    userId: question.userId,
    issuerId: dbUser.id,
    type: "RESOLVED",
    title: "Pitanje je rešeno",
    message: `Vaše pitanje "${question.content.substring(0, 30)}..." je označeno kao rešeno.`,
    link: "/pitanja",
  });

  revalidatePath("/pitanja");
}

// ─── Answer question (admin only, kept for compatibility) ─────────────────────
export async function answerQuestion(questionId: string, answer: string) {
  const dbUser = await getDbUser();
  if (!dbUser) throw new Error("Unauthorized");

  const question = await prisma.question.update({
    where: { id: questionId },
    data: { answer },
    include: { user: { select: { id: true } } }
  });

  // Notify author
  await createNotification({
    userId: question.userId,
    issuerId: dbUser.id,
    type: "ADMIN_ANSWER",
    title: "Novi odgovor administratora",
    message: `Administrator je odgovorio na vaše pitanje: "${answer.substring(0, 50)}..."`,
    link: "/pitanja",
  });

  revalidatePath("/pitanja");
}

export async function handleProposal(questionId: string, isAccepted: boolean, content: string, titleStr?: string) {
  const dbUser = await getDbUser();
  if (!dbUser) throw new Error("Unauthorized");

  // Find the exact title from the content string [PREDLOG: <Title>]
  const match = content.match(/\[PREDLOG:\s*(.*?)\]/);
  const extractedTitle = match ? match[1] : (titleStr || "Nepoznati Predlog");

  let finalAnswer = "";
  if (isAccepted) {
    const description = content.split('\n\n').slice(1).join('\n\n') || content;

    await prisma.rule.create({
      data: {
        title: extractedTitle,
        description: description,
        status: "ACTIVE",
      }
    });
    finalAnswer = "Predlog je prihvaćen i zvanično prosleđen na glasanje.";
  } else {
    finalAnswer = titleStr ? `Predlog je odbijen: ${titleStr}` : "Predlog je odbijen od strane parlamenta.";
  }

  const question = await prisma.question.update({
    where: { id: questionId },
    data: { answer: finalAnswer },
    include: { user: { select: { id: true } } }
  });

  // Notify author
  await createNotification({
    userId: question.userId,
    issuerId: dbUser.id,
    type: "ADMIN_ANSWER",
    title: isAccepted ? "Predlog prihvaćen!" : "Predlog odbijen",
    message: isAccepted 
      ? `Vaš predlog "${extractedTitle}" je prihvaćen i postavljen na glasanje.`
      : `Vaš predlog "${extractedTitle}" nažalost nije prihvaćen.`,
    link: "/pitanja",
  });

  revalidatePath("/pitanja");
  revalidatePath("/glasanje");
  revalidatePath("/");
}

// ─── Update a question (author only) ──────────────────────────────────────────
export async function updateQuestion(id: string, content: string) {
  const dbUser = await getDbUser();
  if (!dbUser) throw new Error("Moraš biti prijavljen.");

  const question = await prisma.question.findUnique({
    where: { id },
    select: { userId: true, isResolved: true },
  });

  if (!question) throw new Error("Pitanje nije pronađeno.");
  
  // Only allow editing if not resolved and is author
  if (question.isResolved) throw new Error("Ne možete menjati rešeno pitanje.");
  if (question.userId !== dbUser.id) throw new Error("Nemate dozvolu.");

  if (!content.trim()) throw new Error("Sadržaj ne može biti prazan.");

  await prisma.question.update({
    where: { id },
    data: { content },
  });

  revalidatePath("/pitanja");
}

// ─── Delete a question (author or admin) ──────────────────────────────────────
export async function deleteQuestion(id: string) {
  const dbUser = await getDbUser();
  if (!dbUser) throw new Error("Moraš biti prijavljen.");

  const role = getRole();
  const question = await prisma.question.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!question) throw new Error("Pitanje nije pronađeno.");

  if (question.userId !== dbUser.id && role !== "ADMIN") {
    throw new Error("Nemate dozvolu.");
  }

  await prisma.question.delete({
    where: { id },
  });

  revalidatePath("/pitanja");
}
