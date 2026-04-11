"use client";

import { useState } from "react";
import { 
  updateMessageStatus, 
  deleteMessage 
} from "@/lib/actions/messages";
import { toast } from "react-hot-toast";
import GlassCard from "@/components/GlassCard";
import { Mail, Trash2, CheckCircle, Clock, Archive } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  _id: string;
  name: string;
  email: string;
  company?: string;
  meetingType?: string;
  duration?: string;
  date?: string;
  time?: string;
  subject?: string;
  message?: string;
  status: "UNREAD" | "READ" | "ARCHIVED";
  createdAt: string;
}

export default function MessageList({ initialMessages }: { initialMessages: any[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [filter, setFilter] = useState<string>("ALL");

  const filteredMessages = messages.filter(m => {
    if (filter === "ALL") return true;
    return m.status === filter;
  });

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateMessageStatus(id, newStatus);
      setMessages(messages.map(m => m._id === id ? { ...m, status: newStatus as any } : m));
      toast.success(`Message marked as ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await deleteMessage(id);
      setMessages(messages.filter(m => m._id !== id));
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const statusIcons = {
    UNREAD: <Clock className="text-secondary" size={16} />,
    READ: <CheckCircle className="text-primary" size={16} />,
    ARCHIVED: <Archive className="text-foreground/40" size={16} />,
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        {["ALL", "UNREAD", "READ", "ARCHIVED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-full font-display text-[10px] font-bold uppercase tracking-[0.2em] transition-all border",
              filter === f 
                ? "bg-primary text-surface-lowest border-primary shadow-[0_0_15px_-5px_var(--primary)]" 
                : "border-outline/20 text-foreground/40 hover:text-foreground hover:border-outline/40"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-6">
        {filteredMessages.length === 0 ? (
          <div className="py-20 text-center font-display text-foreground/20 uppercase tracking-widest">
            No messages found in this category
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <GlassCard key={msg._id} className="group overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-surface-high rounded-full text-primary">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-lg">{msg.name}</h4>
                      <p className="text-xs text-foreground/40 font-body">{msg.email} · {new Date(msg.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="pl-14 space-y-3">
                    <div className="flex gap-2 items-center flex-wrap">
                      <p className="text-sm font-display font-bold text-primary uppercase tracking-wider">
                        {msg.meetingType || msg.subject || "Contact Inquiry"}
                      </p>
                      {(msg.date && msg.time) && (
                        <span className="px-2 py-1 bg-surface-lowest border border-outline/10 rounded-md text-[9px] font-display text-secondary font-bold uppercase tracking-widest">
                          {msg.date} at {msg.time} ({msg.duration})
                        </span>
                      )}
                      {msg.company && (
                        <span className="px-2 py-1 bg-surface-lowest border border-outline/10 rounded-md text-[9px] font-display text-foreground/50 font-bold uppercase tracking-widest">
                          {msg.company}
                        </span>
                      )}
                    </div>
                    {msg.message ? (
                      <p className="text-foreground/70 font-body leading-relaxed max-w-3xl">{msg.message}</p>
                    ) : (
                      <p className="text-foreground/30 font-body italic text-sm">No additional message provided.</p>
                    )}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-outline/10 pt-4 md:pt-0 md:pl-6">
                  <div className="flex items-center gap-2 mb-2 px-3 py-1 bg-surface-lowest/50 rounded-full w-fit">
                    {statusIcons[msg.status]}
                    <span className="text-[10px] font-display font-black tracking-widest text-foreground/50">{msg.status}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {msg.status !== "READ" && (
                      <button
                        onClick={() => handleStatusUpdate(msg._id, "READ")}
                        className="p-2 rounded-lg hover:bg-surface-high text-primary transition-all"
                        title="Mark as Read"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                    {msg.status !== "ARCHIVED" && (
                      <button
                        onClick={() => handleStatusUpdate(msg._id, "ARCHIVED")}
                        className="p-2 rounded-lg hover:bg-surface-high text-foreground/40 transition-all"
                        title="Archive"
                      >
                        <Archive size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
