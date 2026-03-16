import { Navbar } from "@/components/layout/Navbar";
import prisma from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ChannelsPage() {
  const { userId, sessionClaims } = auth();
  if (!userId) redirect("/sign-in");

  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const isAdmin = role === "ADMIN";

  const channels = await prisma.channel.findMany({
    where: isAdmin
      ? {}
      : {
          memberships: {
            some: {
              user: { clerkId: userId },
            },
          },
        },
    include: {
      memberships: {
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto space-y-6">
          <header className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Kanali</p>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Vaši kanali</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Pristup je dozvoljen samo članovima kanala {isAdmin ? "(ADMIN vidi sve)" : ""}.
              </p>
            </div>
            {isAdmin && (
              <Link
                href="/admin/korisnici#kanali"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold hover:opacity-90 transition-colors"
              >
                Upravljaj kanalima
              </Link>
            )}
          </header>

          {channels.length === 0 ? (
            <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center">
              <p className="text-slate-600 dark:text-slate-400">
                Još uvek niste član nijednog kanala.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {channels.map((channel) => (
                <Link
                  key={channel.id}
                  href={`/kanali/${channel.id}`}
                  className="group block p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {channel.name}
                      </h2>
                      {channel.description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          {channel.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {channel.memberships.length} članova
                    </span>
                  </div>
                  <p className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                    Otvori kanal →
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
