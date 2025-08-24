import { Contact } from "@/types/Contact";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  message: Contact;
  onDelete: (id: string) => void;
};

const MessageCard = ({ message, onDelete }: Props) => {
  const { id, name, email, subject, message: content, created_at } = message;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg">{subject}</CardTitle>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(id)}
          className="ml-4"
        >
          Delete
        </Button>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <p><strong>From:</strong> {name} ({email})</p>
        <p><strong>Date:</strong> {new Date(created_at).toLocaleString()}</p>
        <p><strong>Message:</strong> {content}</p>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
