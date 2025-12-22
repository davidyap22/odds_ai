/**
 * Format a number with comma separators and optional decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with commas
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * Format currency with RM symbol and comma separators
 * @param value - The amount to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  return `RM ${formatNumber(value, decimals)}`
}

/**
 * Format currency with + or - sign for profit/loss
 * @param value - The profit/loss amount
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with sign
 */
export function formatProfitLoss(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${formatCurrency(value, decimals)}`
}

/**
 * Format percentage
 * @param value - The percentage value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(decimals)}%`
}
