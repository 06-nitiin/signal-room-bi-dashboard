export type Region = {
    name: string;
    revenue: string;
    growth: string;
    repeat: string;
    signal: string;
};

type RegionTableProps = {
    regions: Region[];
};

export default function RegionTable({ regions }: RegionTableProps) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Region</th><th>Net revenue</th><th>Growth</th><th>Repeat rate</th><th>Signal</th></tr></thead>
        <tbody>
          {regions.map((region) => (
            <tr key={region.name}>
              <td><span className="region-square" />{region.name}</td>
              <td>{region.revenue}</td>
              <td className="positive">{region.growth}</td>
              <td>{region.repeat}</td>
              <td><span className={`signal ${region.signal.toLowerCase()}`}>{region.signal}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
