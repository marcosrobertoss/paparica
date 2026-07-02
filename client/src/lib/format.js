export function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
}

export function getChartTheme(theme) {
  const isDark = theme === 'dark';
  return {
    isDark,
    textColor: isDark ? '#a39b95' : '#656565',
    gridColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(65, 65, 65, 0.08)',
  };
}

export const CHART_COLORS = [
  '#E62B4C', '#FFCD01', '#94AA35', '#0088cb', '#a39b95', '#e05c75', '#e6b800',
];
