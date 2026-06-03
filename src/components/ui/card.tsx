function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`w-full bg-white border border-sidebar-foreground p-0 shadow-sm ${className || ""}`}
    >
      {children}
    </div>
  );
}

function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-b border-sidebar-foreground px-4 py-2 ${className || ""}`}
    >
      <h2 className="text-[14px] font-semibold text-sidebar">{children}</h2>
    </div>
  );
}

function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-6 ${className || ""}`}>{children}</div>;
}

export { Card, CardHeader, CardContent };
