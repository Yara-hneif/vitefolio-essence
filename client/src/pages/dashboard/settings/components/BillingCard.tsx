import { Button } from '@/components/ui/navigation/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/data-display/card';

export default function BillingCard() {
  return (
    <Card className="rounded-2xl border shadow-sm mb-8">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Billing & Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-gray-700 dark:text-gray-300">
          Current Plan: <span className="font-medium">Free</span>
        </p>
        <div className="flex flex-wrap gap-4">
          <Button className="px-6 py-2">Upgrade to Pro</Button>
          <Button variant="outline" className="px-6 py-2">
            Cancel Subscription
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
