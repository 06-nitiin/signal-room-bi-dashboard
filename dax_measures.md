# Signal Room DAX measure reference

These measures are designed for the documented star schema with `FACT_SALES` at transaction-line grain and dimensions for date, customer, product, and geography.

## Core revenue and order measures

```DAX
Net Revenue =
SUM ( FACT_SALES[Revenue] )
```

```DAX
Distinct Orders =
DISTINCTCOUNT ( FACT_SALES[OrderID] )
```

```DAX
Average Order Value =
DIVIDE ( [Net Revenue], [Distinct Orders] )
```

## Customer measures

```DAX
Active Accounts =
DISTINCTCOUNT ( FACT_SALES[CustomerKey] )
```

```DAX
Repeat Customers =
COUNTROWS (
    FILTER (
        VALUES ( DIM_CUSTOMER[CustomerKey] ),
        CALCULATE ( DISTINCTCOUNT ( FACT_SALES[OrderID] ) ) > 1
    )
)
```

```DAX
Repeat Rate =
DIVIDE ( [Repeat Customers], [Active Accounts] )
```

## Time measures

```DAX
Revenue Previous Period =
CALCULATE (
    [Net Revenue],
    DATEADD ( DIM_DATE[Date], -1, MONTH )
)
```

```DAX
Revenue Change % =
DIVIDE (
    [Net Revenue] - [Revenue Previous Period],
    [Revenue Previous Period]
)
```

## Validation measures

```DAX
Transaction Lines =
COUNTROWS ( FACT_SALES )
```

```DAX
Revenue per Transaction Line =
DIVIDE ( [Net Revenue], [Transaction Lines] )
```

## Modelling notes

Use `DIM_DATE[Date]` as the marked date table column and keep relationships single-direction from dimensions to `FACT_SALES`. Format `Net Revenue`, `Average Order Value`, and revenue-per-line measures as GBP currency. Format `Repeat Rate` and `Revenue Change %` as percentages.

The UCI source does not contain acquisition-channel data. Do not create measures for organic, paid, partner, or campaign performance unless a legitimate second source is added and documented.
