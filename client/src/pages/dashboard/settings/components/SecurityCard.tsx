import { useState } from 'react';
import { Button } from '@/components/ui/navigation/button';
import { Input } from '@/components/ui/form/input';
import { Label } from '@/components/ui/form/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';
import { supabase } from '@/lib/supabase';

export default function SecurityCard() {
  const [currentPw, setCurrentPw] = useState(''),
    [newPw, setNewPw] = useState(''),
    [confirmPw, setConfirmPw] = useState('');

  const handlePasswordChange = async () => {
    if (newPw !== confirmPw) return alert('Passwords do not match!');
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) alert(error.message);
    else alert('Password updated ✅');
  };

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader>
        <CardTitle>Security</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Current Password</Label>
          <Input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
        </div>
        <div>
          <Label>New Password</Label>
          <Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
        </div>
        <div>
          <Label>Confirm New Password</Label>
          <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
        </div>
        <Button onClick={handlePasswordChange}>Update Password</Button>
      </CardContent>
    </Card>
  );
}
