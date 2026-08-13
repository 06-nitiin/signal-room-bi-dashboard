type RevenueChartProps = {
    values: number[];
    labels: string[];
};

export default function RevenueChart({ values, labels }: RevenueChartProps) {
  const maximum = Math.max(...values);

  return (
    <div className="bar-chart" aria-label="Monthly revenue chart">
      <div className="chart-y-axis"><span>$180k</span><span>$135k</span><span>$90k</span><span>$45k</span><span>$0</span></div>
      <div className="bars-area">
        <div className="chart-grid-lines"><i /><i /><i /><i /><i /></div>
        <div className="bars">
          {values.map((value, index) => (
            <div className="bar-column" key={labels[index]}>
              <div className="bar-value">${value}k</div>
              <div className="bar" style={{ height: `${(value / maximum) * 100}%` }} />
              <span>{labels[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}