import { Navbar } from "@/components/layout/Navbar";
import prisma from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { ChannelMessages } from "@/components/channel/ChannelMessages";

export const dynamic = "force-dynamic";

export default async function ChannelDetailPage({ params }: { params: { channelId: string } }) {
  const { userId, sessionClaims } = auth();
  if (!userId) redirect("/sign-in");

  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const isAdmin = role === "ADMIN";

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, name: true, email: true, imageUrl: true },
  });
  if (!dbUser) redirect("/sign-in");

  // Sync image if changed
  const user = await currentUser();
  if (user && dbUser && user.imageUrl !== dbUser.imageUrl) {
     await prisma.user.update({
       where: { id: dbUser.id },
       data: { imageUrl: user.imageUrl },
     });
  }

  const channel = await prisma.channel.findUnique({
    where: { id: params.channelId },
    include: {
      memberships: {
        include: {
          user: {
            select: { id: true, name: true, email: true, clerkId: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
      messages: {
        include: {
          user: { select: { name: true, email: true, imageUrl: true } },
          likes: { select: { userId: true } },
          comments: {
            include: {
              user: { select: { name: true, email: true, imageUrl: true } },
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!channel) notFound();

  const isMember = channel.memberships.some((membership) => membership.user.clerkId === userId);
  if (!isAdmin && !isMember) {
    redirect("/kanali");
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          <header className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Kanal</p>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{channel.name}</h1>
              {channel.description && (
                <p className="text-slate-600 dark:text-slate-400 mt-2">{channel.description}</p>
              )}
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {channel.memberships.length} članova
            </span>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 transition-colors space-y-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Poruke kanala</h2>
              <ChannelMessages
                channelId={channel.id}
                initialMessages={channel.messages.map((m) => ({
                  id: m.id,
                  content: m.content,
                  createdAt: m.createdAt.toISOString(),
                  likeCount: m.likes.length,
                  likedByMe: m.likes.some((l) => l.userId === dbUser.id),
                  comments: m.comments.map((c) => ({
                    id: c.id,
                    content: c.content,
                    createdAt: c.createdAt.toISOString(),
                    user: { name: c.user.name, email: c.user.email, imageUrl: c.user.imageUrl },
                  })),
                  user: {
                    name: m.user.name,
                    email: m.user.email,
                    imageUrl: m.user.imageUrl,
                  },
                }))}
              />
            </section>

            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 transition-colors">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Članovi</h2>
              {channel.memberships.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-400">Nema članova.</p>
              ) : (
                <div className="space-y-3">
                  {channel.memberships.map((membership) => (
                    <div
                      key={membership.id}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 transition-colors"
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {membership.user.name || "Bez imena"}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{membership.user.email}</div>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Član</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
