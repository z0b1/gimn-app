"use server";

import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

function getRole() {
  const { sessionClaims } = auth();
  const metadata = sessionClaims?.metadata as { role?: string } | undefined;
  const publicMetadata = sessionClaims?.publicMetadata as { role?: string } | undefined;
  const directRole = (sessionClaims as unknown as { role?: string })?.role;
  return metadata?.role || publicMetadata?.role || directRole;
}

// ─── Purge content older than 1.5 years (admin only) ─────────────────────────
export async function purgeOldData(): Promise<{ deleted: number }> {
  const { userId } = auth();
  const role = getRole();
  if (!userId || role !== "ADMIN") throw new Error("Unauthorized");

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - 18); // 1.5 years ago

  const [feedComments, feedLikes, feedPosts, questionReplies, questions] =
    await Promise.all([
      prisma.gimnazijaFeedComment.deleteMany({ where: { createdAt: { lt: cutoff } } }),
      prisma.gimnazijaFeedLike.deleteMany({ where: { createdAt: { lt: cutoff } } }),
      prisma.gimnazijaFeedPost.deleteMany({ where: { createdAt: { lt: cutoff } } }),
      prisma.questionReply.deleteMany({ where: { createdAt: { lt: cutoff } } }),
      prisma.question.deleteMany({ where: { createdAt: { lt: cutoff } } }),
    ]);

  const total =
    feedComments.count +
    feedLikes.count +
    feedPosts.count +
    questionReplies.count +
    questions.count;

  revalidatePath("/");
  return { deleted: total };
}

// ─── Collect all user-generated content for export ────────────────────────────
export async function collectExportData() {
  const { userId } = auth();
  const role = getRole();
  if (!userId || role !== "ADMIN") throw new Error("Unauthorized");

  const [feedPosts, questions] = await Promise.all([
    prisma.gimnazijaFeedPost.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        likes: { select: { userId: true } },
        comments: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.question.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        replies: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    feedPosts: feedPosts.map((p) => ({
      id: p.id,
      content: p.content,
      author: p.user.name,
      authorEmail: p.user.email,
      mediaUrl: p.mediaUrl,
      mediaType: p.mediaType,
      likeCount: p.likes.length,
      createdAt: p.createdAt.toISOString(),
      comments: p.comments.map((c) => ({
        id: c.id,
        author: c.user.name,
        content: c.content,
        createdAt: c.createdAt.toISOString(),
      })),
    })),
    questions: questions.map((q) => ({
      id: q.id,
      content: q.content,
      author: q.user.name,
      authorEmail: q.user.email,
      answer: q.answer,
      isResolved: q.isResolved,
      createdAt: q.createdAt.toISOString(),
      replies: q.replies.map((r) => ({
        id: r.id,
        author: r.user.name,
        content: r.content,
        createdAt: r.createdAt.toISOString(),
      })),
    })),
  };
}
