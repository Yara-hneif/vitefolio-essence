import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoader() {
  return (
    <div className="p-8 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>

      <Skeleton className="h-6 w-[250px]" />
      <Skeleton className="h-6 w-[300px]" />

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Skeleton className="h-40 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    </div>
  );
}
