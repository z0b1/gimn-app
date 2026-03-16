import { Navbar } from "@/components/layout/Navbar";
import { UserCog, ArrowLeft } from "lucide-react";
import Link from "next/link";
import prisma from "@/lib/db";
import { isAdmin } from "@/lib/roles";
import { redirect } from "next/navigation";
import { UserManagementTable } from "@/components/admin/UserManagementTable";
import { auth } from "@clerk/nextjs/server";
import { ChannelManager } from "@/components/admin/ChannelManager";

export const dynamic = "force-dynamic";

export default async function KorisniciPage() {
  if (!isAdmin()) {
    redirect("/");
  }

  const { userId } = auth();
  if (!userId) redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      clerkId: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }
  });

  const channels = await prisma.channel.findMany({
    orderBy: { name: "asc" },
    include: {
      memberships: {
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      },
    },
  });

  // Convert Date to string for client component serialization
  const serializedUsers = users.map(u => ({
    ...u,
    createdAt: u.createdAt.toISOString()
  }));

  const serializedChannels = channels.map((channel) => ({
    id: channel.id,
    name: channel.name,
    description: channel.description,
    memberships: channel.memberships.map((membership) => ({
      id: membership.id,
      user: {
        id: membership.user.id,
        name: membership.user.name,
        email: membership.user.email,
      },
    })),
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/admin/settings" 
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            Nazad na podešavanja
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-100 dark:shadow-none transition-colors">
                  <UserCog size={24} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Upravljanje Korisnicima</h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 transition-colors">
                Pregled svih korisnika. Dodeli administratorska prava ili promeni imena korisnicima u sistemu.
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm transition-colors">
              <div className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">Ukupno:</div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 transition-colors">{users.length}</div>
            </div>
          </div>

          <UserManagementTable initialUsers={serializedUsers} currentUserId={userId} />

          <section id="kanali" className="mt-12 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">
                Kanali i članovi
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
                Kreiraj kanale i dodeli korisnike (samo admin).
              </p>
            </div>
            <ChannelManager initialChannels={serializedChannels} users={serializedUsers} />
          </section>
        </div>
      </main>
    </div>
  );
}
