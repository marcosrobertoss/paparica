// Fallback unit list for the Editor form's dropdown; the real source of truth
// is whatever units already exist in data_rows (see useUnitsList in metrics.js).
export const UNITS_LIST_FALLBACK = [
  'Campinas',
  'Belo Horizonte',
  'Goiânia',
  'Guarulhos',
  'Bauru',
  'Campo Grande',
  'São Paulo',
];

export const MONTHS_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export const VIEW_LABELS = {
  overview: 'Visão Geral',
  units: 'Unidades',
  editor: 'Editor de Dados',
  importer: 'Importar Planilha',
};
