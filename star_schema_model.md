# Signal Room star-schema model

## Model purpose

The model supports revenue, order, customer, monthly, regional, and product analysis from the cleaned UCI Online Retail data. The design follows a star schema: one central fact table stores transaction-line measures, while descriptive dimensions surround it.

## Fact table

### `FACT_SALES`

The grain is **one completed transaction line**. This preserves the source detail and allows revenue to be recalculated as `Quantity * UnitPrice`.

| Column | Type | Description |
|---|---|---|
| `OrderID` | Text | Invoice identifier. Multiple lines can share the same order. |
| `DateKey` | Integer | Foreign key to `DIM_DATE`. |
| `CustomerKey` | Text | Foreign key to `DIM_CUSTOMER`. |
| `ProductKey` | Text | Foreign key to `DIM_PRODUCT`. |
| `GeographyKey` | Text | Foreign key to `DIM_GEOGRAPHY`. |
| `Quantity` | Whole number | Units on the transaction line. |
| `UnitPrice` | Decimal | Price per unit. |
| `Revenue` | Decimal | `Quantity * UnitPrice`. |
| `Status` | Text | Completed or cancelled; the cleaned model retains completed rows. |

## Dimensions

### `DIM_DATE`

This is the required date dimension. It should contain one row per calendar date in the source period and fields such as `DateKey`, `Date`, `Year`, `MonthNumber`, `MonthName`, `YearMonth`, and `Quarter`.

### `DIM_CUSTOMER`

This dimension contains one row per known customer. Its key is `CustomerKey`, derived from `CustomerID`. The current UCI source does not provide reliable customer segment, lifecycle, or demographic attributes, so those fields should not be invented.

### `DIM_PRODUCT`

This dimension contains one row per `StockCode` with the available `Description`. Product-level analysis can use this dimension to rank products by revenue and units.

### `DIM_GEOGRAPHY`

This dimension contains one row per source `Country` and the project-derived `Region`. The region classification should remain documented as a project transformation rather than an original UCI field.

## Relationships

All relationships should be single-direction, one-to-many relationships from a dimension into `FACT_SALES`:

| From | To | Cardinality |
|---|---|---|
| `DIM_DATE[DateKey]` | `FACT_SALES[DateKey]` | One to many |
| `DIM_CUSTOMER[CustomerKey]` | `FACT_SALES[CustomerKey]` | One to many |
| `DIM_PRODUCT[ProductKey]` | `FACT_SALES[ProductKey]` | One to many |
| `DIM_GEOGRAPHY[GeographyKey]` | `FACT_SALES[GeographyKey]` | One to many |

Avoid bidirectional filtering unless a specific requirement justifies it. Single-direction filtering keeps the model easier to reason about and reduces ambiguous filter paths.

## Core measures

```DAX
Net Revenue = SUM(FACT_SALES[Revenue])

Distinct Orders = DISTINCTCOUNT(FACT_SALES[OrderID])

Average Order Value = DIVIDE([Net Revenue], [Distinct Orders])

Active Accounts = DISTINCTCOUNT(FACT_SALES[CustomerKey])

Repeat Customers =
COUNTROWS(
    FILTER(
        VALUES(FACT_SALES[CustomerKey]),
        CALCULATE(DISTINCTCOUNT(FACT_SALES[OrderID])) > 1
    )
)

Repeat Rate = DIVIDE([Repeat Customers], [Active Accounts])
```

## Power BI implementation sequence

Import the cleaned transaction file, create the four dimensions, establish the relationships, mark `DIM_DATE` as the date table, and then add the measures above. Validate the model by checking that total revenue agrees with the cleaning report, distinct orders agrees with the diagnostic report, and region filters change all relevant measures consistently.

## Current limitations

The UCI source does not include acquisition channel, campaign cost, profit, or customer segment fields. The model should not include fabricated versions of those fields. The current React dashboard represents channel as `Unknown`, and a native Power BI report should do the same unless a second legitimate source is added.
