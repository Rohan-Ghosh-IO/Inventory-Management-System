export interface CsvColumn<T = any> {
  header: string;
  accessor: (item: T) => string | number | boolean | null | undefined;
}

export const generateCsv = <T = any>(columns: CsvColumn<T>[], data: T[]): string => {
  // 1. Header row
  const headerRow = columns.map((col) => escapeCsvValue(col.header)).join(',');

  // 2. Data rows
  const dataRows = data.map((item) => {
    return columns
      .map((col) => {
        const val = col.accessor(item);
        return escapeCsvValue(val);
      })
      .join(',');
  });

  return [headerRow, ...dataRows].join('\r\n');
};

const escapeCsvValue = (val: any): string => {
  if (val === null || val === undefined) {
    return '';
  }

  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
};
