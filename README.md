# Signal Room BI Dashboard

Signal Room is an interactive business-intelligence dashboard built with React, TypeScript, Vite, and plain CSS. It combines a polished analyst workspace with a reproducible data-cleaning workflow based on the UCI Online Retail dataset.

The project is designed to demonstrate the complete path from raw transaction data to an explainable dashboard: source selection, cleaning, validation, business-grain metrics, regional analysis, data modelling, and portfolio presentation.

## Project objective

The dashboard analyses revenue performance, order behaviour, customer activity, repeat purchasing, and regional concentration across the UCI source period from **December 2010 through December 2011**.



## Key results from the cleaned dataset

The local diagnostic workflow currently reports:

| Metric | Result |
|---|---:|
| Cleaned transaction rows | 397,884 |
| Distinct orders | 18,532 |
| Distinct known customers | 4,338 |
| Total revenue | Approximately £8.91 million |
| Average order value | Approximately £480.87 |
| Repeat customers | 2,845 |
| Repeat rate | Approximately 65.58% |
| Source period | December 2010–December 2011 |

These values are calculated from the local cleaned dataset and can be regenerated with the diagnostic script. The raw and processed datasets are intentionally excluded from GitHub.

## Data source and preparation

The project uses the [UCI Online Retail dataset](https://archive.ics.uci.edu/dataset/352/online+retail), an order-level retail transaction dataset. The official workbook is exported locally to CSV and processed by `scripts/cleanUciRetail.mjs`.

The cleaning workflow removes cancellation invoices, rows without customer identifiers, non-positive quantities, non-positive unit prices, and invalid dates. It calculates line revenue as `Quantity * UnitPrice`, normalises the source date format, derives a documented region from country, and writes a quality report.

The project preserves a clear distinction between the transaction-line grain and the business metrics calculated from it. Revenue is summed from transaction lines, while orders are counted as distinct invoices and repeat behaviour is calculated from distinct customers and their invoice sets.

## Architecture

```text
UCI Online Retail workbook
          ↓
CSV export in data/raw/
          ↓
scripts/cleanUciRetail.mjs
          ↓
data/processed/ cleaned CSV + quality report
          ↓
CSV parser and UCI mapping
          ↓
transformOrders()
          ↓
React dashboard
```

The proposed BI model is documented in `star_schema_model.md` and `star_schema_model.mmd`. It uses a transaction-line-grain `FACT_SALES` table with `DIM_DATE`, `DIM_CUSTOMER`, `DIM_PRODUCT`, and `DIM_GEOGRAPHY` dimensions. The DAX reference is in `dax_measures.md`, and the field definitions are in `data_dictionary.md`.

## Repository structure

| Path | Purpose |
|---|---|
| `client/src/pages/Home.tsx` | Dashboard page, data loading, filters, KPI display, charts, and narrative. |
| `client/src/components/` | Reusable dashboard components such as KPI cards, charts, table, sidebar, and topbar. |
| `client/src/data/` | CSV parsing, UCI mapping, data transformation, loading, and typed data contracts. |
| `scripts/cleanUciRetail.mjs` | Reproducible raw-data cleaning script. |
| `scripts/inspectCleanedRetail.mjs` | Diagnostic report for row counts, orders, customers, revenue, regions, and months. |
| `data_dictionary.md` | Source, cleaned, derived, and metric definitions. |
| `star_schema_model.md` | Fact table, dimensions, relationships, and modelling notes. |
| `star_schema_model.mmd` | Mermaid star-schema relationship diagram. |
| `dax_measures.md` | Power BI-ready DAX measure reference. |
| `CASE_STUDY.md` | Internship-oriented project narrative and interview explanation. |

## Run the React dashboard locally

Install dependencies and start the development server:

```bash
pnpm install
pnpm run dev
```

Run the validation commands:

```bash
pnpm run check
pnpm run build
```

The dashboard can use the cleaned CSV when it exists locally at:

```text
client/public/data/online-retail-cleaned.csv
```

That file is ignored by Git because the dataset is large and should not be committed to the public repository.

## Run the data workflow locally

After downloading the official UCI workbook and exporting the worksheet as `online-retail.csv`, place it at:

```text
data/raw/online-retail.csv
```

Then run:

```bash
mkdir -p data/raw data/processed
node scripts/cleanUciRetail.mjs
node scripts/inspectCleanedRetail.mjs
```

The cleaning script creates:

```text
data/processed/online-retail-cleaned.csv
data/processed/online-retail-cleaned-quality-report.json
```

The raw and processed directories are protected by `.gitignore`.


## References

[1]: https://archive.ics.uci.edu/dataset/352/online+retail "UCI Online Retail dataset"
