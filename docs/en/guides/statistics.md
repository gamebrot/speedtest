# Statistics & Charts

MySpeed provides detailed statistics and charts to help you analyze your internet connection over time. This page explains how the statistics feature works and how data is processed for optimal visualization.

## Overview

The statistics page displays your speedtest results in various charts, including download/upload speeds, ping, and jitter over time. To ensure smooth performance even with large datasets, MySpeed uses intelligent data processing.

## Date Range Selection

You can select a custom date range using the date picker at the top of the statistics page. By default, the last 7 days are shown, but you can extend this to view longer periods.

## Smart Downsampling

When you have many speedtests (for example, running tests every minute), displaying all data points would slow down the charts significantly. MySpeed automatically handles this with smart downsampling.

### How It Works

1. **Threshold Check**: If your selected date range contains **300 or fewer** data points, all raw data is displayed without any processing.

2. **Bucket-Based Averaging**: When there are more than 300 data points, the time range is divided into 300 equal time buckets. Each bucket contains the average of all tests that occurred during that time period.

3. **Failed Test Tracking**: Failed tests are tracked separately. If a time bucket only contains failed tests, a failure marker is shown. If a bucket has both successful and failed tests, the successful tests are averaged and the failed count is noted.

### Example Scenarios

| Test Frequency | Tests per Week | Behavior |
|---------------|----------------|----------|
| Every hour | ~168 | All raw data shown |
| Every 30 min | ~336 | Slight downsampling (300 points) |
| Every 10 min | ~1,008 | Each point represents ~3.4 tests |
| Every minute | ~10,080 | Each point represents ~34 tests |

## Failed Tests in Charts

Failed speedtests are displayed with special red **✕** markers at the bottom of the chart. This makes it easy to identify when your connection had issues.

::: info Aggregated Failed Tests
When data is downsampled, the tooltip will show how many tests failed during that time period (e.g., "3 failed in period").
:::

## Chart Types

### Speed Charts
Shows download and upload speeds over time with a gradient fill. A dashed line indicates the average speed for the selected period.

### Ping Chart
Displays ping latency and jitter (if available) over time. Lower values indicate a more responsive connection.

### Hourly Averages
Shows average speeds grouped by hour of the day, helping you identify patterns like slower speeds during peak hours.

### Consistency Chart
Visualizes how stable your connection is based on the standard deviation of your test results.

## Performance Considerations

The 300-point target was chosen to balance detail with performance:

- **Enough detail** to see trends and anomalies
- **Fast rendering** even on mobile devices
- **Smooth interactions** when hovering over data points

::: tip Large Date Ranges
For very long date ranges (months or years), the downsampling will average more tests per data point. Consider selecting shorter date ranges if you need to see individual test details.
:::
