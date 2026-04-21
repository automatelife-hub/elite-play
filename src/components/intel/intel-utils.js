/**
 * Returns the appropriate Tailwind CSS color class based on the trend string.
 * @param {string|null|undefined} trend - The trend string (e.g., '+12%', '-5%').
 * @returns {string} - Tailwind CSS class for the color.
 */
export function getTrendColor(trend) {
  if (trend && trend.startsWith('+')) {
    return 'text-mission-secure-green';
  }
  if (trend && trend.startsWith('-')) {
    return 'text-mission-alert-red';
  }
  return 'text-intel-cyan';
}
