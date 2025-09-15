import { Button } from '@/components/ui/navigation/button';

export default function FinalCTA({
  onPrimary,
  onSecondary,
}: {
  onPrimary: () => void;
  onSecondary: () => void;
}) {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-3xl text-center px-4">
        <h2 className="text-[clamp(1.75rem,4.5vw,2.5rem)] font-bold leading-[1.1]">
          Ready to publish a clean portfolio?
        </h2>
        <p className="mt-2 text-muted-foreground">
          Use a starter, customize sections, and go live—fast.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="px-8" onClick={onPrimary}>
            View Demo
          </Button>

          <Button size="lg" variant="outline" className="px-8" onClick={onSecondary}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    </section>
  );
}
