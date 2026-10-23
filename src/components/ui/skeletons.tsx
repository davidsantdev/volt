export function ProductSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14">
      <div className="skeleton aspect-[4/5] rounded-[1.5rem]" />
      <div className="space-y-5">
        <div className="skeleton h-4 w-24 rounded-full" />
        <div className="skeleton h-12 w-4/5 rounded-2xl" />
        <div className="skeleton h-9 w-40 rounded-xl" />
        <div className="skeleton h-12 w-full rounded-full" />
        <div className="skeleton h-14 w-full rounded-full" />
      </div>
    </div>
  );
}

export function GridSkeleton({ items = 8 }: { items?: number }) {
  return (
    <div aria-hidden="true" className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="skeleton aspect-[4/5] rounded-card" />
      ))}
    </div>
  );
}
