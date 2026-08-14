# Signal Room BI dashboard case study

## Project summary

Signal Room is an interactive business-intelligence dashboard built around the UCI Online Retail dataset. The project combines a React frontend with a reproducible data-cleaning workflow and documented BI modelling decisions.

The objective is to understand revenue performance, order behavior, repeat customers, and regional concentration across the source period from December 2010 through December 2011.

## Business questions

The analysis is designed to answer four questions. How much revenue was generated? How many distinct orders and customers were represented? What proportion of known customers placed more than one order? Which regions contributed the largest share of transaction activity?

The project deliberately does not answer acquisition-channel or campaign-efficiency questions because those fields are not present in the UCI source.

## Data and preparation

The source is the [UCI Online Retail dataset](https://archive.ics.uci.edu/dataset/352/online+retail). The raw workbook is exported locally to CSV and cleaned by `scripts/cleanUciRetail.mjs`.

The cleaning process removes cancellation invoices, rows without customer IDs, non-positive quantities, non-positive unit prices, and invalid dates. It calculates line revenue as `Quantity * UnitPrice`, derives a documented region from country, and writes a local quality report. Raw and processed data files are excluded from GitHub through `.gitignore`.

## Current diagnostic result

The cleaned dataset currently contains 397,884 rows, 18,532 distinct orders, 4,338 known customers, approximately £8.91 million in revenue, an average order value of approximately £480.87, and a repeat rate of approximately 65.58%. These values are diagnostic outputs from the local cleaned file and should be regenerated if the source export changes.

## Data model

The proposed BI model uses a transaction-line-grain `FACT_SALES` table connected to `DIM_DATE`, `DIM_CUSTOMER`, `DIM_PRODUCT`, and `DIM_GEOGRAPHY`. The model and relationships are documented in `star_schema_model.md`, while the corresponding DAX reference is in `dax_measures.md`.

## Technology

The project uses React, TypeScript, Vite, and plain CSS for the interactive dashboard. Node.js scripts handle CSV cleaning and diagnostics. The code is versioned in GitHub with focused commits that show the progression from prototype to real-data workflow.

## Limitations

The UCI source does not contain acquisition channel, campaign cost, profit, or customer segment fields. Channel analysis is therefore labelled unavailable rather than fabricated. Region is derived from country using a project mapping. The current dashboard is a React implementation; a native Power BI `.pbix` file remains optional and requires access to Power BI Desktop through Windows or a remote Windows environment.

## Internship talking point

A concise project explanation is:

> I built a real-data BI dashboard from the UCI Online Retail dataset. I created a reproducible cleaning workflow, removed invalid and cancelled transactions, separated line-level revenue from invoice-level order metrics, calculated customer repeat rate, documented a star schema and DAX measures, and connected the results to an interactive React dashboard. I also documented what the source could not support rather than inventing acquisition-channel insights.

## Reproduction commands

```bash
pnpm install
node scripts/cleanUciRetail.mjs
node scripts/inspectCleanedRetail.mjs
pnpm run check
pnpm run build
```

The raw and processed datasets remain local and are intentionally excluded from the public repository. The repository contains the cleaning logic, documentation, mapping, and application source needed to reproduce the workflow with the documented source file.
