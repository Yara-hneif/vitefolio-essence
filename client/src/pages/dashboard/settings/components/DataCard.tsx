import { Button } from '@/components/ui/navigation/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';

export default function DataCard() {
  return (
    <Card className="rounded-2xl border shadow-sm mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Data Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button variant="outline" className="px-6 py-2">
          Export My Data
        </Button>
        <Button variant="outline" className="px-6 py-2">
          Clear Activity History
        </Button>
      </CardContent>
    </Card>
  );
}
