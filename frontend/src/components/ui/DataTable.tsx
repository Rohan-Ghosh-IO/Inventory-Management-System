import React from 'react';

interface DataTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  render: (item: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  loading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  footer?: React.ReactNode;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  loadingComponent,
  emptyComponent,
  footer,
  onRowClick,
}: DataTableProps<T>) {
  if (loading && loadingComponent) {
    return <div className="rounded-2xl border border-border dark:border-border bg-white dark:bg-[#0F0F0F] overflow-hidden">{loadingComponent}</div>;
  }

  if (!loading && data.length === 0 && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  return (
    <div className="rounded-2xl border border-border dark:border-border bg-white dark:bg-[#0F0F0F] overflow-hidden">
      <div className="overflow-x-auto w-full touch-pan-x scrollbar-thin">
        <table className="w-full text-left text-sm text-content-secondary dark:text-content-secondary min-w-[640px] sm:min-w-full">
          <thead>
            <tr className="border-b border-border dark:border-border bg-surface-secondary dark:bg-[#111111]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-3.5 sm:px-5 py-2.5 sm:py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-content-tertiary whitespace-nowrap ${col.headerClassName || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-secondary dark:divide-border-secondary">
            {data.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={`
                  transition-colors duration-100
                  hover:bg-surface-tertiary dark:hover:bg-[#151515]
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-3.5 sm:px-5 py-3 sm:py-4 ${col.className || ''}`}>
                    {col.render(item, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  );
}
