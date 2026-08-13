export type ChannelMixValue = {
  name: string;
  value: number;
  className: string;
};

type ChannelMixProps = {
  values: ChannelMixValue[];
};

export default function ChannelMix({ values }: ChannelMixProps) {
  const organic = values[0]?.value ?? 0;
  let start = 0;
  const gradient = values
    .map((item) => {
      const end = start + item.value;
      const segment = `${item.className === "mix-organic" ? "#255CFF" : item.className === "mix-paid" ? "#B8C2A4" : item.className === "mix-partner" ? "#C2765B" : "#D9C6A5"} ${start}% ${end}%`;
      start = end;
      return segment;
    })
    .join(", ");

  return (
    <div className="mix-chart" aria-label="Acquisition channel mix">
      <div className="donut" style={{ background: `conic-gradient(${gradient})` }}>
        <div className="donut-hole"><strong>{organic}%</strong><span>organic</span></div>
      </div>
      <div className="mix-list">
        {values.map((item) => (
          <div key={item.name}>
            <span><i className={item.className} />{item.name}</span>
            <strong>{item.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
