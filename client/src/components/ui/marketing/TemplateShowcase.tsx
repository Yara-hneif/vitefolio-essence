import React, { lazy, Suspense } from "react";

const TemplatePreview = lazy(() => import("@/components/LandingPage/TemplatePreview"));

export default function TemplateShowcase() {
  return (
    <div className="rounded-2xl border bg-card">
      <Suspense fallback={<div className="h-[360px] rounded-2xl" role="status" aria-label="Loading preview" />}>
        <TemplatePreview />
      </Suspense>
    </div>
  );
}
