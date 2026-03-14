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
    // Determine description (everything after the title line)
    const description = content.split('\n\n').slice(1).join('\n\n') || content;

    // Create the rule
    await prisma.rule.create({
      data: {
        title: extractedTitle,
        description: description,
        status: "ACTIVE",
      }
    });

    // Mark question as answered
    await prisma.question.update({
      where: { id: questionId },
      data: { answer: "Predlog je prihvaćen i zvanično prosleđen na glasanje." }
    });
  } else {
    // Prompts admin for a rejection reason (which was passed as 'titleStr' if we overload it, but we can just use a generic message)
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
