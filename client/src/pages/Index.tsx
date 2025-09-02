import { Suspense, lazy } from "react";

const Home = lazy(() => import("@/pages/demo/Home"));

const Index = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <Home />
    </Suspense>
  );
};

export default Index;
