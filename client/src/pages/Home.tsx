import { useEffect, useState } from "react";

import ChannelMix from "../components/ChannelMix";
import KpiCard from "../components/KpiCard";
import RegionTable, { type Region } from "../components/RegionTable";
import RevenueChart from "../components/RevenueChart";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

import {
  dashboardByRegion,
  months,
  regions as fallbackRegions,
} from "../data/dashboardData";

import { loadCleanedRetailData } from "../data/loadCleanedRetailData";

import {
  transformOrders,
  type AnalyticsSummary,
  type OrderRow,
} from "../data/dataTransform";


type ViewSnapshot = {
  revenue: string;
  revenueChange: string;
  repeatRate: string;
  repeatChange: string;
  averageOrder: string;
  averageOrderChange: string;
  activeAccounts: string;
  accountsChange: string;
  monthlyLabels: string[];
  monthlyRevenue: number[];
  channelMix: {
    name: string;
    value: number;
    className: string;
  }[];
};


const channelClasses: Record<string, string> = {
  Organic: "mix-organic",
  Paid: "mix-paid",
  Partner: "mix-partner",
  Other: "mix-other",
  Unknown: "mix-other",
};


function formatMoney(value: number) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}m`;
  }

  return `$${Math.round(value / 1_000)}k`;
}


function realSummaryToSnapshot(
  summary: AnalyticsSummary
): ViewSnapshot {
  return {
    revenue: formatMoney(summary.revenue),
    revenueChange: "Calculated",

    repeatRate: `${summary.repeatRate.toFixed(1)}%`,
    repeatChange: "Calculated",

    averageOrder: `$${summary.averageOrderValue.toFixed(2)}`,
    averageOrderChange: "Calculated",

    activeAccounts: summary.activeAccounts.toLocaleString(),
    accountsChange: "Calculated",

    monthlyLabels: summary.monthlyLabels,

    monthlyRevenue: summary.monthlyRevenue.map(
      (value) => Math.round(value / 1_000)
    ),

    channelMix: Object.entries(summary.channelMix).map(
      ([name, value]) => ({
        name,
        value,
        className: channelClasses[name] ?? "mix-other",
      })
    ),
  };
}


function realRegionRows(rows: OrderRow[]): Region[] {
  const regionNames = Array.from(
    new Set(rows.map((row) => row.region))
  ).sort();

  return regionNames.map((name) => {
    const summary = transformOrders(rows, name);

    return {
      name,
      revenue: formatMoney(summary.revenue),
      growth: "Calculated",
      repeat: `${summary.repeatRate.toFixed(1)}%`,
      signal:
        summary.repeatRate >= 40
          ? "Strong"
          : "Watch",
    };
  });
}


function DataModelView() {
  return (
    <section className="detail-view">
      <p className="eyebrow">
        Readout 02 / Data architecture
      </p>

      <h1>
        From raw rows
        <br />
        <em>to a reliable model.</em>
      </h1>

      <p className="detail-intro">
        The first model draft keeps the business grain explicit and gives
        every measure a clear home.
      </p>

      <div className="model-grid">
        <article className="panel model-card">
          <p className="eyebrow">
            Proposed star schema
          </p>

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
          <p className="eyebrow">
            Model notes
          </p>

          <h2>Keep the grain honest.</h2>

          <p>
            <strong>Fact grain</strong>{" "}
            One row per completed customer order line.
          </p>

          <p>
            <strong>Relationships</strong>{" "}
            One-to-many from dimensions into the fact table.
          </p>

          <p>
            <strong>Next step</strong>{" "}
            Validate the cleaned UCI data in the dashboard and Power BI model.
          </p>
        </article>
      </div>
    </section>
  );
}


function InsightsView() {
  return (
    <section className="detail-view">
      <p className="eyebrow">
        Readout 03 / Decision notes
      </p>

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
            <p className="eyebrow">
              Growth quality
            </p>

            <h2>
              Revenue growth is becoming more durable.
            </h2>

            <p>
              Revenue and repeat rate rise together across the period,
              which is stronger evidence than acquisition volume alone.
            </p>
          </div>
        </article>

        <article className="insight">
          <span>02</span>

          <div>
            <p className="eyebrow">
              Channel efficiency
            </p>

            <h2>
              Channel data needs a source before it becomes a decision.
            </h2>

            <p>
              The UCI dataset does not include observed acquisition channels,
              so the real-data view labels channel as Unknown rather than
              inventing a channel story.
            </p>
          </div>
        </article>

        <article className="insight">
          <span>03</span>

          <div>
            <p className="eyebrow">
              Regional playbook
            </p>

            <h2>
              Compare regional retention before scaling spend.
            </h2>

            <p>
              Use the strongest repeat-rate region as a benchmark for
              customer lifecycle experiments.
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
  rows,
  dataStatus,
}: {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  rows: OrderRow[] | null;
  dataStatus: "loading" | "real" | "fallback";
}) {
  const isRealData =
    dataStatus === "real" && rows !== null;

  const snapshot = isRealData
    ? realSummaryToSnapshot(
        transformOrders(rows, selectedRegion)
      )
    : dashboardByRegion[selectedRegion];

  const availableRegions = isRealData
    ? Array.from(
        new Set(rows.map((row) => row.region))
      ).sort()
    : fallbackRegions.map(
        (region) => region.name
      );

  const visibleRegions = isRealData
    ? realRegionRows(
        selectedRegion === "All regions"
          ? rows
          : rows.filter(
              (row) => row.region === selectedRegion
            )
      )
    : selectedRegion === "All regions"
      ? fallbackRegions
      : fallbackRegions.filter(
          (region) => region.name === selectedRegion
        );

  const chartLabels: string[] = isRealData
    ? (snapshot as ViewSnapshot).monthlyLabels
    : months;

  const channelUnavailable =
    snapshot.channelMix.length === 1 &&
    snapshot.channelMix[0].name === "Unknown";


  return (
    <div className="content">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            Readout 01 / H1 2024
          </p>

          <h1>
            Growth is healthy.
            <br />
            <em>Retention is the signal.</em>
          </h1>

          <p>
            A decision-ready view of revenue performance,
            repeat behavior, and regional efficiency across
            the first half of the year.
          </p>
        </div>

        <div
          className="hero-pattern"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>


      <div className="section-heading">
        <div>
          <p className="eyebrow">
            Executive view
          </p>

          <h2>What changed</h2>

          <p className="data-status">
            {dataStatus === "loading"
              ? "Loading cleaned UCI data..."
              : isRealData
                ? "Source: cleaned UCI Online Retail rows"
                : "Using illustrative fallback data — add the cleaned CSV to enable real data"}
          </p>
        </div>

        <select
          value={selectedRegion}
          onChange={(event) =>
            onRegionChange(event.target.value)
          }
          aria-label="Filter by region"
        >
          <option>
            All regions
          </option>

          {availableRegions.map((region) => (
            <option key={region}>
              {region}
            </option>
          ))}
        </select>
      </div>


      <section className="kpi-grid">
        <KpiCard
          label="Net revenue"
          value={snapshot.revenue}
          change={snapshot.revenueChange}
          context={
            isRealData
              ? "from cleaned rows"
              : undefined
          }
          lead
        />

        <KpiCard
          label="Repeat rate"
          value={snapshot.repeatRate}
          change={snapshot.repeatChange}
          context={
            isRealData
              ? "from cleaned rows"
              : undefined
          }
        />

        <KpiCard
          label="Avg. order value"
          value={snapshot.averageOrder}
          change={snapshot.averageOrderChange}
          context={
            isRealData
              ? "from cleaned rows"
              : undefined
          }
        />

        <KpiCard
          label="Active accounts"
          value={snapshot.activeAccounts}
          change={snapshot.accountsChange}
          context={
            isRealData
              ? "from cleaned rows"
              : undefined
          }
        />
      </section>


      <section className="analysis-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">
                Trend / monthly
              </p>

              <h2>
                Revenue by month
              </h2>
            </div>

            <span className="chart-legend">
              <i /> Revenue
            </span>
          </div>

          <RevenueChart
            values={snapshot.monthlyRevenue}
            labels={chartLabels}
          />

          <div className="annotation">
            <strong>Readout:</strong>{" "}
            {isRealData
              ? `The cleaned UCI rows show ${formatMoney(
                  snapshot.monthlyRevenue.reduce(
                    (total, value) =>
                      total + value * 1_000,
                    0
                  )
                )} across the displayed months for ${selectedRegion.toLowerCase()}.`
              : `June revenue is trending highest for ${selectedRegion.toLowerCase()} while repeat behavior keeps climbing.`}
          </div>
        </article>


        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">
                Acquisition / mix
              </p>

              <h2>
                {channelUnavailable
                  ? "Channel field unavailable"
                  : "Organic is doing the heavy lift"}
              </h2>
            </div>
          </div>

          <ChannelMix
            values={snapshot.channelMix}
          />
        </article>
      </section>


      <section className="panel table-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">
              Performance / region
            </p>

            <h2>
              Where the signal is strongest
            </h2>
          </div>
        </div>

        <RegionTable
          regions={visibleRegions}
        />
      </section>


      <section className="recommendation">
        <p className="eyebrow">
          Recommendation 01 / Decision point
        </p>

        <h2>
          {isRealData
            ? "Use repeat rate as the first regional benchmark."
            : "Protect the repeat loop before scaling paid acquisition."}
        </h2>

        <p>
          {isRealData
            ? "The current source supports customer and regional analysis, but not observed marketing-channel attribution. Validate the strongest repeat-rate region before making channel investment claims."
            : "Use North as the benchmark for onboarding and lifecycle experiments, then redeploy paid spend toward segments that show the same behavior."}
        </p>
      </section>
    </div>
  );
}


export default function Home() {
  const [activePage, setActivePage] =
    useState("Overview");

  const [selectedRegion, setSelectedRegion] =
    useState("All regions");

  const [rows, setRows] =
    useState<OrderRow[] | null>(null);

  const [dataStatus, setDataStatus] =
    useState<
      "loading" | "real" | "fallback"
    >("loading");


  useEffect(() => {
    loadCleanedRetailData()
      .then((cleanedRows) => {
        setRows(cleanedRows);
        setDataStatus("real");
      })
      .catch(() => {
        setDataStatus("fallback");
      });
  }, []);


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
            rows={rows}
            dataStatus={dataStatus}
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