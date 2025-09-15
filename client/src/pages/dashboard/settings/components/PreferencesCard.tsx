import { Button } from '@/components/ui/navigation/button';
import { Label } from '@/components/ui/form/label';
import { Switch } from '@/components/ui/effects/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';

export default function PreferencesCard() {
  return (
    <Card className="rounded-2xl border shadow-sm mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between py-2">
          <Label>Dark Mode</Label>
          <Switch />
        </div>
        <div className="flex items-center justify-between py-2">
          <Label>Email Notifications</Label>
          <Switch />
        </div>
        <div className="flex justify-end">
          <Button className="px-6 py-2">Save Preferences</Button>
        </div>
      </CardContent>
    </Card>
  );
}
