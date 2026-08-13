import { useState } from "react";

const monthlyRevenue = [118, 132, 146, 141, 159, 174];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const regions = [
  { name: "North", revenue: "$418k", growth: "+19.4%", repeat: "48.2%", signal: "Strong" },
  { name: "Central", revenue: "$356k", growth: "+12.1%", repeat: "41.7%", signal: "Stable" },
  { name: "West", revenue: "$291k", growth: "+8.8%", repeat: "39.4%", signal: "Watch" },
  { name: "South", revenue: "$224k", growth: "+5.6%", repeat: "34.9%", signal: "Watch" },
];

const navItems = ["Overview", "Data model", "Insights"];

function KpiCard({ label, value, change, lead = false }: { label: string; value: string; change: string; lead?: boolean }) {
  return (
    <article className={`kpi-card ${lead ? "kpi-card-lead" : ""}`}>
      <p className="kpi-label">{label}<span className="signal-dot" /></p>
      <p className="kpi-value">{value}</p>
      <p className="kpi-change">{change} <span>vs. prior period</span></p>
    </article>
  );
}

function SimpleBarChart() {
  const maximum = Math.max(...monthlyRevenue);

  return (
    <div className="bar-chart" aria-label="Monthly revenue from January to June">
      <div className="chart-y-axis"><span>$180k</span><span>$135k</span><span>$90k</span><span>$45k</span><span>$0</span></div>
      <div className="bars-area">
        <div className="chart-grid-lines"><i /><i /><i /><i /><i /></div>
        <div className="bars">
          {monthlyRevenue.map((value, index) => (
            <div className="bar-column" key={months[index]}>
              <div className="bar-value">${value}k</div>
              <div className="bar" style={{ height: `${(value / maximum) * 100}%` }} />
              <span>{months[index]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MixChart() {
  return (
    <div className="mix-chart" aria-label="Acquisition channel mix">
      <div className="donut"><div className="donut-hole"><strong>42%</strong><span>organic</span></div></div>
      <div className="mix-list">
        <div><span><i className="mix-organic" />Organic</span><strong>42%</strong></div>
        <div><span><i className="mix-paid" />Paid</span><strong>28%</strong></div>
        <div><span><i className="mix-partner" />Partner</span><strong>18%</strong></div>
        <div><span><i className="mix-other" />Other</span><strong>12%</strong></div>
      </div>
    </div>
  );
}

function DataModelView() {
  return (
    <section className="detail-view">
      <p className="eyebrow">Readout 02 / Data architecture</p>
      <h1>From raw rows<br /><em>to a reliable model.</em></h1>
      <p className="detail-intro">The first model draft keeps the business grain explicit and gives every measure a clear home.</p>
      <div className="model-grid">
        <article className="panel model-card"><p className="eyebrow">Proposed star schema</p><h2>Customer growth model</h2><div className="schema"><div className="schema-table"><strong>DIM_CUSTOMER</strong><span>customer_key</span><span>segment</span><span>channel</span></div><div className="schema-line" /><div className="schema-table fact-table"><strong>FACT_ORDERS</strong><span>order_key</span><span>customer_key</span><span>net_revenue</span></div><div className="schema-line" /><div className="schema-table"><strong>DIM_DATE</strong><span>date_key</span><span>month</span><span>fiscal_year</span></div></div></article>
        <article className="panel notes-card"><p className="eyebrow">Model notes</p><h2>Keep the grain honest.</h2><p><strong>Fact grain</strong> One row per completed customer order.</p><p><strong>Relationships</strong> One-to-many from dimensions into the fact table.</p><p><strong>Next step</strong> Connect a sourced dataset and validate the relationships in Power BI.</p></article>
      </div>
    </section>
  );
}

function InsightsView() {
  return (
    <section className="detail-view">
      <p className="eyebrow">Readout 03 / Decision notes</p>
      <h1>Turn the chart<br /><em>into a next move.</em></h1>
      <p className="detail-intro">A credible portfolio project explains what the team should do next, not only what happened.</p>
      <div className="insights">
        <article className="insight"><span>01</span><div><p className="eyebrow">Growth quality</p><h2>Revenue growth is becoming more durable.</h2><p>Revenue and repeat rate rise together across the period, which is stronger evidence than acquisition volume alone.</p></div></article>
        <article className="insight"><span>02</span><div><p className="eyebrow">Channel efficiency</p><h2>Organic is the most efficient growth engine.</h2><p>Organic contributes the largest share of the mix and is a useful playbook for future lifecycle experiments.</p></div></article>
        <article className="insight"><span>03</span><div><p className="eyebrow">Regional playbook</p><h2>North provides the benchmark for retention.</h2><p>Compare the North customer journey against the watch regions before scaling paid acquisition.</p></div></article>
      </div>
    </section>
  );
}

export default function Home() {
  const [activePage, setActivePage] = useState("Overview");
  const [selectedRegion, setSelectedRegion] = useState("All regions");
  const visibleRegions = selectedRegion === "All regions" ? regions : regions.filter((region) => region.name === selectedRegion);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">↗</div><div><strong>Signal Room</strong><span>BI portfolio / 01</span></div></div>
        <p className="sidebar-label">Workspace</p>
        <nav>{navItems.map((item) => <button className={activePage === item ? "nav-item active" : "nav-item"} key={item} onClick={() => setActivePage(item)}><span className="nav-icon">{item === "Overview" ? "◒" : item === "Data model" ? "◇" : "✦"}</span>{item}</button>)}</nav>
        <div className="sidebar-status"><p className="sidebar-label">Project status</p><div className="status-box"><span className="status-dot" /> <strong>Prototype ready</strong><small>Source data pending<br />Model documented</small></div></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><span>Portfolio project&nbsp; / &nbsp;<strong>Customer growth readout</strong></span><div><button className="top-button">Search</button><button className="top-button">Download</button><span className="top-mark">↗</span></div></header>
        {activePage === "Overview" && <div className="content">
          <section className="hero"><div className="hero-copy"><p className="eyebrow">Readout 01 / H1 2024</p><h1>Growth is healthy.<br /><em>Retention is the signal.</em></h1><p>A decision-ready view of revenue performance, repeat behavior, and channel efficiency across the first half of the year.</p></div><div className="hero-pattern" aria-hidden="true"><span /><span /><span /><span /></div></section>
          <div className="section-heading"><div><p className="eyebrow">Executive view</p><h2>What changed</h2></div><select value={selectedRegion} onChange={(event) => setSelectedRegion(event.target.value)} aria-label="Filter by region"><option>All regions</option>{regions.map((region) => <option key={region.name}>{region.name}</option>)}</select></div>
          <section className="kpi-grid"><KpiCard label="Net revenue" value="$1.29m" change="+14.8%" lead /><KpiCard label="Repeat rate" value="42.6%" change="+6.4 pts" /><KpiCard label="Avg. order value" value="$86.40" change="+3.2%" /><KpiCard label="Active accounts" value="14,820" change="+11.9%" /></section>
          <section className="analysis-grid"><article className="panel chart-panel"><div className="panel-heading"><div><p className="eyebrow">Trend / monthly</p><h2>Revenue is outpacing plan</h2></div><span className="chart-legend"><i /> Revenue</span></div><SimpleBarChart /><div className="annotation"><strong>Readout:</strong> June revenue is 10.1% above plan while repeat behavior keeps climbing.</div></article><article className="panel chart-panel"><div className="panel-heading"><div><p className="eyebrow">Acquisition / mix</p><h2>Organic is doing the heavy lift</h2></div></div><MixChart /></article></section>
          <section className="panel table-panel"><div className="panel-heading"><div><p className="eyebrow">Performance / region</p><h2>Where the signal is strongest</h2></div></div><div className="table-wrap"><table><thead><tr><th>Region</th><th>Net revenue</th><th>Growth</th><th>Repeat rate</th><th>Signal</th></tr></thead><tbody>{visibleRegions.map((region) => <tr key={region.name}><td><span className="region-square" />{region.name}</td><td>{region.revenue}</td><td className="positive">{region.growth}</td><td>{region.repeat}</td><td><span className={`signal ${region.signal.toLowerCase()}`}>{region.signal}</span></td></tr>)}</tbody></table></div></section>
          <section className="recommendation"><p className="eyebrow">Recommendation 01 / Decision point</p><h2>Protect the repeat loop before scaling paid acquisition.</h2><p>Use North as the benchmark for onboarding and lifecycle experiments, then redeploy paid spend toward segments that show the same behavior.</p></section>
        </div>}
        {activePage === "Data model" && <div className="content"><DataModelView /></div>}
        {activePage === "Insights" && <div className="content"><InsightsView /></div>}
      </main>
    </div>
  );
}