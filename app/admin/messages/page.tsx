import { Suspense } from "react";
import { getMessages } from "@/lib/actions/messages";
import MessageList from "@/components/admin/MessageList";
import { MessageSkeleton } from "@/components/admin/AdminSkeleton";

async function MessageContent() {
  const messages = await getMessages();
  return <MessageList initialMessages={JSON.parse(JSON.stringify(messages))} />;
}

export default async function AdminMessagesPage() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-display text-4xl font-black tracking-tighter mb-2">Contact Messages</h1>
        <p className="text-foreground/50 font-body">Manage inquiries and communication from your portfolio visitors.</p>
      </header>

      <Suspense fallback={<div className="space-y-4"><MessageSkeleton /><MessageSkeleton /><MessageSkeleton /></div>}>
        <MessageContent />
      </Suspense>
    </div>
  );
}
