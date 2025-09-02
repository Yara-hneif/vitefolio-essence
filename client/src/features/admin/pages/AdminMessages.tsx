import { useEffect, useState } from "react";
import { getAllContacts, deleteContactMessage } from "@/lib/api";
import { Contact } from "@/utils/types/Contact";
import MessageCard from "@/features/admin/components/inbox/components/messageCard";
import { toast } from "sonner";

const AdminMessages = () => {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await getAllContacts();
        setMessages(res || []);
      } catch (error) {
        toast.error("Failed to load contact messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteContactMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading messages...</p>;

  return (
    <section className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📩 Contact Messages</h1>

      {messages.length === 0 ? (
        <p className="text-muted-foreground">No messages found.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <MessageCard key={msg.id} message={msg} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminMessages;
