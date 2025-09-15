import { Button } from '@/components/ui/navigation/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';

export default function DangerCard() {
  return (
    <Card className="border border-red-400 bg-red-50 dark:bg-red-900/20 rounded-2xl shadow-sm mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-red-600">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-red-500">
          Proceed with caution! These actions are irreversible.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="destructive" className="px-6 py-2">
            Delete Account
          </Button>
          <Button variant="outline" className="text-red-500 border-red-500 px-6 py-2">
            Deactivate Account
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
