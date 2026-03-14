"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Menu, X, Landmark, Bell, Vote, MessageSquare, Plus } from "lucide-react";

const navLinks = [
  { href: "/vesti", label: "Vesti", icon: Bell },
  { href: "/glasanje", label: "Glasanje", icon: Vote },
  { href: "/gimnazija-feed", label: "Gimnazija Feed", icon: MessageSquare },
  { href: "/pitanja", label: "Pitanja", icon: Landmark },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const isAdmin = (user?.publicMetadata as { role?: string })?.role === "ADMIN";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
              <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                <Landmark size={20} />
              </div>
              <span>GimnApp</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <SignedIn>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-sm"
                >
                  <Plus size={16} />
                  Objavi
                </Link>
              )}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 border-2 border-indigo-100",
                  }
                }}
              />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                  Prijavi se
                </button>
              </SignInButton>
            </SignedOut>

            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white animate-in slide-in-from-top duration-300">
          <div className="space-y-1 p-4 pb-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-3 text-base font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <link.icon size={20} className="text-indigo-600" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
