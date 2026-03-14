"use client";

import { useState } from "react";
import { updateUserName, updateUserRole } from "@/lib/actions/users";
import { Role } from "@prisma/client";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";

interface UserData {
  id: string;
  clerkId: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: string;
}

export function UserManagementTable({ initialUsers, currentUserId }: { initialUsers: UserData[], currentUserId: string }) {
  const [users, setUsers] = useState(initialUsers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleEditStart = (user: UserData) => {
    setEditingId(user.id);
    setEditName(user.name || "");
  };

  const handleNameSave = async (user: UserData) => {
    if (editName.trim() === "" || editName === user.name) {
      setEditingId(null);
      return;
    }

    setPendingId(user.id);
    try {
      await updateUserName(user.id, user.clerkId, editName);
      setUsers(users.map(u => u.id === user.id ? { ...u, name: editName } : u));
    } catch (error) {
      console.error(error);
      alert("Greška pri čuvanju imena.");
    } finally {
      setPendingId(null);
      setEditingId(null);
    }
  };

  const handleRoleToggle = async (user: UserData) => {
    if (user.clerkId === currentUserId) {
      alert("Ne možete promeniti sopstvenu ulogu.");
      return;
    }

    const newRole = user.role === "ADMIN" ? "STUDENT" : "ADMIN";
    
    // Confirm demotion to prevent accidents
    if (newRole === "STUDENT") {
      if (!confirm(`Da li ste sigurni da želite da uklonite admin prava korisniku ${user.name}?`)) {
        return;
      }
    }

    setPendingId(user.id);
    try {
      await updateUserRole(user.id, user.clerkId, newRole);
      setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error(error);
      alert("Greška pri promeni uloge.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 transition-colors">
              <th className="p-4 font-semibold text-sm">Ime i Prezime</th>
              <th className="p-4 font-semibold text-sm">Email</th>
              <th className="p-4 font-semibold text-sm">Uloga</th>
              <th className="p-4 font-semibold text-sm">Pridružio/la se</th>
              <th className="p-4 font-semibold text-sm text-right">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                <td className="p-4">
                  {editingId === user.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 w-full max-w-[200px] outline-none transition-colors"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleNameSave(user);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        disabled={pendingId === user.id}
                      />
                      {pendingId === user.id ? (
                         <Loader2 size={16} className="animate-spin text-indigo-500" />
                      ) : (
                        <div className="flex gap-1">
                          <button onClick={() => handleNameSave(user)} className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 p-1 rounded transition-colors text-xs font-bold">Sačuvaj</button>
                          <button onClick={() => setEditingId(null)} className="text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 p-1 rounded transition-colors text-xs font-bold">Otkaži</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
                      {user.name || "Bez imena"}
                      {pendingId === user.id && <Loader2 size={14} className="animate-spin text-indigo-500" />}
                    </div>
                  )}
                </td>
                <td className="p-4 text-slate-500 dark:text-slate-400 text-sm transition-colors">{user.email}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    user.role === "ADMIN" 
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  } transition-colors`}>
                    {user.role === "ADMIN" ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-slate-500 dark:text-slate-400 text-sm transition-colors">
                  {new Date(user.createdAt).toLocaleDateString("sr-RS")}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    {editingId !== user.id && (
                      <button 
                        onClick={() => handleEditStart(user)}
                        disabled={pendingId === user.id}
                        className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 disabled:opacity-50 transition-colors"
                      >
                        Izmeni Ime
                      </button>
                    )}
                    
                    {user.clerkId !== currentUserId && (
                      <button 
                        onClick={() => handleRoleToggle(user)}
                        disabled={pendingId === user.id}
                        className={`text-sm font-semibold disabled:opacity-50 transition-colors ${
                          user.role === "ADMIN" 
                            ? "text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300"
                            : "text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
                        }`}
                      >
                        {user.role === "ADMIN" ? "Skini Admina" : "Daj Admina"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 dark:text-slate-400 transition-colors">
                  Trenutno nema korisnika u sistemu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
