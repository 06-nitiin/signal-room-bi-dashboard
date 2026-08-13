import { useState } from "react";

import ChannelMix from "../components/ChannelMix";
import KpiCard from "../components/KpiCard";
import RegionTable from "../components/RegionTable";
import RevenueChart from "../components/RevenueChart";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import { dashboardByRegion, months, regions } from "../data/dashboardData";

function DataModelView() {
  return (
    <section className="detail-view">
      <p className="eyebrow">Readout 02 / Data architecture</p>

      <h1>
        From raw rows
        <br />
        <em>to a reliable model.</em>
      </h1>

      <p className="detail-intro">
        The first model draft keeps the business grain explicit and gives every
        measure a clear home.
      </p>

      <div className="model-grid">
        <article className="panel model-card">
          <p className="eyebrow">Proposed star schema</p>

          <h2>Customer growth model</h2>

          <div className="schema">
            <div className="schema-table">
              <strong>DIM_CUSTOMER</strong>
              <span>customer_key</span>
              <span>segment</span>
              <span>channel</span>
            </div>

            <div className="schema-line" />

            <div className="schema-table fact-table">
              <strong>FACT_ORDERS</strong>
              <span>order_key</span>
              <span>customer_key</span>
              <span>net_revenue</span>
            </div>

            <div className="schema-line" />

            <div className="schema-table">
              <strong>DIM_DATE</strong>
              <span>date_key</span>
              <span>month</span>
              <span>fiscal_year</span>
            </div>
          </div>
        </article>

        <article className="panel notes-card">
          <p className="eyebrow">Model notes</p>

          <h2>Keep the grain honest.</h2>

          <p>
            <strong>Fact grain</strong> One row per completed customer order.
          </p>

          <p>
            <strong>Relationships</strong> One-to-many from dimensions into the
            fact table.
          </p>

          <p>
            <strong>Next step</strong> Connect a sourced dataset and validate
            the relationships in Power BI.
          </p>
        </article>
      </div>
    </section>
  );
}

function InsightsView() {
  return (
    <section className="detail-view">
      <p className="eyebrow">Readout 03 / Decision notes</p>

      <h1>
        Turn the chart
        <br />
        <em>into a next move.</em>
      </h1>

      <p className="detail-intro">
        A credible portfolio project explains what the team should do next,
        not only what happened.
      </p>

      <div className="insights">
        <article className="insight">
          <span>01</span>

          <div>
            <p className="eyebrow">Growth quality</p>

            <h2>Revenue growth is becoming more durable.</h2>

            <p>
              Revenue and repeat rate rise together across the period, which is
              stronger evidence than acquisition volume alone.
            </p>
          </div>
        </article>

        <article className="insight">
          <span>02</span>

          <div>
            <p className="eyebrow">Channel efficiency</p>

            <h2>Organic is the most efficient growth engine.</h2>

            <p>
              Organic contributes the largest share of the mix and is a useful
              playbook for future lifecycle experiments.
            </p>
          </div>
        </article>

        <article className="insight">
          <span>03</span>

          <div>
            <p className="eyebrow">Regional playbook</p>

            <h2>North provides the benchmark for retention.</h2>

            <p>
              Compare the North customer journey against the watch regions
              before scaling paid acquisition.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

function Overview({
  selectedRegion,
  onRegionChange,
}: {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}) {
  const snapshot = dashboardByRegion[selectedRegion];

  const visibleRegions =
    selectedRegion === "All regions"
      ? regions
      : regions.filter((region) => region.name === selectedRegion);

  return (
    <div className="content">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Readout 01 / H1 2024</p>

          <h1>
            Growth is healthy.
            <br />
            <em>Retention is the signal.</em>
          </h1>

          <p>
            A decision-ready view of revenue performance, repeat behavior, and
            channel efficiency across the first half of the year.
          </p>
        </div>

        <div className="hero-pattern" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Executive view</p>
          <h2>What changed</h2>
        </div>

        <select
          value={selectedRegion}
          onChange={(event) => onRegionChange(event.target.value)}
          aria-label="Filter by region"
        >
          <option>All regions</option>

          {regions.map((region) => (
            <option key={region.name}>{region.name}</option>
          ))}
        </select>
      </div>

      <section className="kpi-grid">
        <KpiCard
          label="Net revenue"
          value={snapshot.revenue}
          change={snapshot.revenueChange}
          lead
        />

        <KpiCard
          label="Repeat rate"
          value={snapshot.repeatRate}
          change={snapshot.repeatChange}
        />

        <KpiCard
          label="Avg. order value"
          value={snapshot.averageOrder}
          change={snapshot.averageOrderChange}
        />

        <KpiCard
          label="Active accounts"
          value={snapshot.activeAccounts}
          change={snapshot.accountsChange}
        />
      </section>

      <section className="analysis-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Trend / monthly</p>
              <h2>Revenue is outpacing plan</h2>
            </div>

            <span className="chart-legend">
              <i />
              Revenue
            </span>
          </div>

          <RevenueChart
            values={snapshot.monthlyRevenue}
            labels={months}
          />

          <div className="annotation">
            <strong>Readout:</strong> June revenue is trending highest for{" "}
            {selectedRegion.toLowerCase()} while repeat behavior keeps
            climbing.
          </div>
        </article>

        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Acquisition / mix</p>
              <h2>Organic is doing the heavy lift</h2>
            </div>
          </div>

          <ChannelMix values={snapshot.channelMix} />
        </article>
      </section>

      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Performance / region</p>
            <h2>Where the signal is strongest</h2>
          </div>
        </div>

        <RegionTable regions={visibleRegions} />
      </section>

      <section className="recommendation">
        <p className="eyebrow">
          Recommendation 01 / Decision point
        </p>

        <h2>
          Protect the repeat loop before scaling paid acquisition.
        </h2>

        <p>
          Use North as the benchmark for onboarding and lifecycle experiments,
          then redeploy paid spend toward segments that show the same behavior.
        </p>
      </section>
    </div>
  );
}

export default function Home() {
  const [activePage, setActivePage] = useState("Overview");
  const [selectedRegion, setSelectedRegion] = useState("All regions");

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
      />

      <main className="main-content">
        <Topbar />

        {activePage === "Overview" && (
          <Overview
            selectedRegion={selectedRegion}
            onRegionChange={setSelectedRegion}
          />
        )}

        {activePage === "Data model" && (
          <div className="content">
            <DataModelView />
          </div>
        )}

        {activePage === "Insights" && (
          <div className="content">
            <InsightsView />
          </div>
        )}
      </main>
    </div>
  );
}