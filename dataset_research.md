# Dataset research findings

## Selected dataset

We selected the **UCI Online Retail** dataset from the UCI Machine Learning Repository because it is an authoritative, order-level transactional dataset with customer, date, product, price, quantity, and country fields. It contains 541,909 transaction rows covering 1 December 2010 through 9 December 2011 for a UK-based non-store online retailer.

Official source: https://archive.ics.uci.edu/dataset/352/online+retail

Citation supplied by UCI: Chen, D. (2015). Online Retail [Dataset]. UCI Machine Learning Repository. https://doi.org/10.24432/C5BW33.

License: Creative Commons Attribution 4.0 International (CC BY 4.0), subject to attribution.

## Available columns

| UCI column | Description | Planned project field |
|---|---|---|
| InvoiceNo | Transaction identifier; values beginning with C indicate cancellation | orderId and status |
| StockCode | Product identifier | productId, later modelling |
| Description | Product name | productName, later modelling |
| Quantity | Quantity of items in the transaction line | quantity |
| InvoiceDate | Transaction date and time | date |
| UnitPrice | Unit price in pounds sterling | unitPrice |
| CustomerID | Customer identifier | customerId |
| Country | Customer country | region proxy |

## Important limitations

The dataset does not contain a marketing channel field, so channel mix cannot be measured directly. For the first real-data version, the dashboard should either remove the channel-mix claim, label channel as unavailable, or define a transparent derived segmentation that is not presented as an observed acquisition channel. It also contains country rather than a ready-made business region, so region must be derived from country using a documented mapping table.

Revenue can be derived as `Quantity * UnitPrice` after cleaning cancellations, non-positive quantities, and non-positive prices according to documented rules. Repeat rate can be calculated from customer-level invoice counts after the cleaning policy is applied.

## Comparison considered

UCI Online Retail II was also reviewed. It contains approximately 1,067,371 rows over two years and is licensed CC BY 4.0, but its UCI page reports missing values and a less complete variable table. We selected the original Online Retail dataset first because its schema documentation is clearer and it is smaller and easier to learn from.
