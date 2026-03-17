"use client";

import { type FormEvent, useMemo, useState } from "react";
import { addUserToChannel, createChannel, deleteChannel, removeUserFromChannel } from "@/lib/actions/channels";
import { Loader2, Plus, Users, Trash2 } from "lucide-react";

type ChannelMembership = {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

type Channel = {
  id: string;
  name: string;
  description: string | null;
  memberships: ChannelMembership[];
};

type UserOption = {
  id: string;
  name: string | null;
  email: string;
};

export function ChannelManager({
  initialChannels,
  users,
}: {
  initialChannels: Channel[];
  users: UserOption[];
}) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [pending, setPending] = useState<string | null>(null);

  const sortedChannels = useMemo(
    () => [...channels].sort((a, b) => a.name.localeCompare(b.name)),
    [channels]
  );

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email)),
    [users]
  );

  const handleCreateChannel = async (e: FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) return;
    setPending("create");
    try {
      const channel = await createChannel(channelName, channelDescription);
      setChannels((prev) => [...prev, { ...channel, memberships: [] }]);
      setChannelName("");
      setChannelDescription("");
    } catch (error) {
      console.error(error);
      alert("Greška pri kreiranju kanala.");
    } finally {
      setPending(null);
    }
  };

  const handleAssignUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedChannelId || !selectedUserId) return;
    setPending("assign");
    try {
      const membership = await addUserToChannel(selectedChannelId, selectedUserId);
      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === selectedChannelId
            ? {
                ...channel,
                memberships: channel.memberships.some((m) => m.user.id === selectedUserId)
                  ? channel.memberships
                  : [...channel.memberships, { id: membership.id, user: membership.user }],
              }
            : channel
        )
      );
    } catch (error) {
      console.error(error);
      alert("Greška pri dodeli korisnika kanalu.");
    } finally {
      setPending(null);
    }
  };

  const handleRemoveUser = async (channelId: string, userId: string) => {
    setPending(`remove-${channelId}-${userId}`);
    try {
      await removeUserFromChannel(channelId, userId);
      setChannels((prev) =>
        prev.map((channel) =>
          channel.id === channelId
            ? { ...channel, memberships: channel.memberships.filter((m) => m.user.id !== userId) }
            : channel
        )
      );
    } catch (error) {
      console.error(error);
      alert("Greška pri uklanjanju korisnika iz kanala.");
    } finally {
      setPending(null);
    }
  };

  const handleDeleteChannel = async (channelId: string) => {
    if (!confirm("Da li ste sigurni da želite da obrišete kanal?")) {
      return;
    }
    setPending(`delete-${channelId}`);
    try {
      await deleteChannel(channelId);
      setChannels((prev) => prev.filter((channel) => channel.id !== channelId));
      if (selectedChannelId === channelId) {
        setSelectedChannelId("");
      }
    } catch (error) {
      console.error(error);
      alert("Greška pri brisanju kanala.");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 transition-colors">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 transition-colors">
          <Plus size={18} className="text-indigo-600 dark:text-indigo-400" />
          Kreiraj kanal
        </h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleCreateChannel}>
          <input
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Naziv kanala"
            className="col-span-1 md:col-span-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
            required
          />
          <input
            type="text"
            value={channelDescription}
            onChange={(e) => setChannelDescription(e.target.value)}
            placeholder="Opis (opciono)"
            className="col-span-1 md:col-span-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={pending === "create"}
            className="col-span-1 bg-indigo-600 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {pending === "create" && <Loader2 size={16} className="animate-spin" />}
            Dodaj kanal
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 transition-colors">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4 transition-colors">
          <Users size={18} className="text-indigo-600 dark:text-indigo-400" />
          Dodela korisnika kanalima
        </h3>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleAssignUser}>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
          >
            <option value="">Izaberi korisnika</option>
            {sortedUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {(user.name || "Bez imena") + " — " + user.email}
              </option>
            ))}
          </select>
          <select
            value={selectedChannelId}
            onChange={(e) => setSelectedChannelId(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
          >
            <option value="">Izaberi kanal</option>
            {sortedChannels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={pending === "assign"}
            className="bg-indigo-600 text-white px-4 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {pending === "assign" && <Loader2 size={16} className="animate-spin" />}
            Dodaj korisnika u kanal
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sortedChannels.map((channel) => (
          <div
            key={channel.id}
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm p-6 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white transition-colors">
                  {channel.name}
                </h4>
                {channel.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
                    {channel.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full transition-colors">
                  {channel.memberships.length} članova
                </span>
                <button
                  onClick={() => handleDeleteChannel(channel.id)}
                  disabled={pending === `delete-${channel.id}`}
                  className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors disabled:opacity-50"
                  aria-label="Obriši kanal"
                >
                  {pending === `delete-${channel.id}` ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {channel.memberships.length === 0 && (
                <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">
                  Nema dodeljenih korisnika.
                </p>
              )}
              {channel.memberships.map((membership) => (
                <div
                  key={membership.user.id}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">
                      {membership.user.name || "Bez imena"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
                      {membership.user.email}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(channel.id, membership.user.id)}
                    disabled={pending === `remove-${channel.id}-${membership.user.id}`}
                    className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors disabled:opacity-50"
                    aria-label="Ukloni korisnika iz kanala"
                  >
                    {pending === `remove-${channel.id}-${membership.user.id}` ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
