"use client";

import { useState, useEffect } from "react";
import { Bell, Check, MailOpen } from "lucide-react";
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead 
} from "@/lib/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import { sr } from "date-fns/locale";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
  issuer?: { name: string | null };
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    const data = await getNotifications() as unknown as Notification[];
    setNotifications(data);
    setUnreadCount(data.filter((n) => !n.isRead).length);
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    fetchNotifications();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-brand-primary hover:bg-brand-primary/5 rounded-full transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] sm:w-80 md:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-indigo-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 z-50 overflow-hidden transform origin-top-right transition-all">
            <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Obaveštenja</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-brand-primary hover:text-brand-accent flex items-center gap-1"
                >
                  <Check size={14} />
                  Označi sve kao pročitano
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <MailOpen size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium">Nema novih obaveštenja</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group relative",
                      !notification.isRead && "bg-brand-primary/5"
                    )}
                  >
                    <Link
                      href={notification.link || "#"}
                      onClick={() => {
                        handleMarkAsRead(notification.id);
                        setIsOpen(false);
                      }}
                      className="block"
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2 shrink-0",
                          notification.isRead ? "bg-transparent" : "bg-brand-primary"
                        )} />
                        <div>
                          <p className="text-sm font-bold text-slate-900 mb-1 leading-tight">
                            {notification.title}
                          </p>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                            {notification.message}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: sr,
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 bg-slate-50/50 text-center border-top border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  GimnApp Obaveštenja
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
