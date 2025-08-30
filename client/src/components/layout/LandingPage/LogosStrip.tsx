export default function LogosStrip() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <p className="text-center text-xs uppercase tracking-wider text-muted-foreground">
        Trusted by makers & developers
      </p>
      <div className="mt-4 grid grid-cols-2 items-center gap-6 opacity-70 sm:grid-cols-3 md:grid-cols-6">
        {["Acme","Globex","Umbrella","Soylent","Initech","Stark"].map((name) => (
          <div key={name} className="flex items-center justify-center rounded-lg border bg-white py-3 text-sm font-semibold">
            {name}
          </div>
        ))}
      </div>
    </div>
  );
}
