type KpiCardProps = {
    label: string;
    value: string;
    change: string;
    lead?: boolean;
};

export default function KpiCard({ label, value, change, lead = false }: KpiCardProps) {
  return (
    <article className={`kpi-card ${lead ? "kpi-card-lead" : ""}`}>
      <p className="kpi-label">{label}<span className="signal-dot" /></p>
      <p className="kpi-value">{value}</p>
      <p className="kpi-change">{change} <span>vs. prior period</span></p>
    </article>
  );
}