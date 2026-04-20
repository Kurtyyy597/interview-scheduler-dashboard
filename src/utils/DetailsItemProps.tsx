type DetailItemProps = {
  label: string;
  value: React.ReactNode;
  full?: boolean;
};

export function DetailItem({ label, value, full = false }: DetailItemProps) {
  return (
    <div className={`detail-item ${full ? "detail-item-full" : ""}`}>
      <p className="detail-label">{label}</p>
      <div className="detail-value">{value}</div>
    </div>
  );
}