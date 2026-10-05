// src/domains/log/components/LogDetailItem.tsx
type LogDetailItemProps = {
  label: string;
  children: React.ReactNode;
};

export function LogDetailItem({ label, children }: LogDetailItemProps) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </p>
      <p className="text-[11px] text-foreground wrap-break-word">{children}</p>
    </div>
  );
}