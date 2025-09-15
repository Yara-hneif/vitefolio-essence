import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/navigation/button';
import { Input } from '@/components/ui/form/input';
import { Label } from '@/components/ui/form/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MessageDialogProps {
  receiverId: string;
  onClose: () => void;
}

export default function MessageDialog({ receiverId, onClose }: MessageDialogProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!user) {
      toast.error('You must be logged in to send a message.');
      return;
    }
    if (!message.trim()) {
      toast.error('Message cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('messages').insert([
        {
          sender_id: user.id,
          receiver_id: receiverId,
          content: message.trim(),
        },
      ]);

      if (error) throw error;

      toast.success('Message sent successfully!');
      setMessage('');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <Card className="w-full max-w-md shadow-xl border bg-background">
        <CardHeader>
          <CardTitle>Send a Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="message">Your Message</Label>
            <Input
              id="message"
              type="text"
              placeholder="Write your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-12"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
