import { db } from "@/lib/db";
import { markMessageReadAction, deleteMessageAction } from "@/lib/actions";
import { Mail, Check, Trash2, MailCheck } from "lucide-react";

export default async function AdminMessagesPage() {
  const messages = await db.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inquiries Inbox</h1>
          <p className="text-mute text-sm mt-0.5">Contact submissions received from visitors</p>
        </div>
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="bg-panel border border-line rounded-2xl p-12 text-center text-mute">
            No inquiries received yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-panel border rounded-2xl p-6 transition-all space-y-3 ${
                msg.read ? "border-line" : "border-accent shadow-sm ring-1 ring-accent/20"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                      msg.read ? "bg-line" : "bg-accent animate-pulse"
                    }`}
                  />
                  <h3 className="font-bold text-base text-ink">{msg.name}</h3>
                  <a
                    href={`mailto:${msg.email}`}
                    className="text-xs text-accent font-medium hover:underline"
                  >
                    {msg.email}
                  </a>
                </div>
                <div className="text-xs text-mute flex items-center gap-2">
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  {msg.ip && <span className="font-mono text-line">({msg.ip})</span>}
                </div>
              </div>

              <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap bg-bg p-4 rounded-xl border border-line">
                {msg.body}
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <form
                  action={async () => {
                    "use server";
                    await markMessageReadAction(msg.id, !msg.read);
                  }}
                >
                  <button
                    type="submit"
                    className="btn text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    {msg.read ? (
                      <>
                        <Mail size={14} /> Mark as Unread
                      </>
                    ) : (
                      <>
                        <MailCheck size={14} /> Mark as Read
                      </>
                    )}
                  </button>
                </form>

                <a
                  href={`mailto:${msg.email}?subject=${encodeURIComponent("Re: Portfolio Inquiry")}`}
                  className="btn p text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <span>Reply by Email</span>
                </a>

                <form
                  action={async () => {
                    "use server";
                    await deleteMessageAction(msg.id);
                  }}
                >
                  <button
                    type="submit"
                    className="p-2 rounded-xl border border-line text-red-500 hover:bg-red-500/10"
                    title="Delete message"
                  >
                    <Trash2 size={15} />
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
