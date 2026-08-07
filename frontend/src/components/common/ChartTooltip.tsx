import React from 'react';

interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  isCurrency?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  isCurrency = false,
  valuePrefix = '',
  valueSuffix = '',
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-gray-800 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[140px] z-50">
        {label && (
          <p className="font-bold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-gray-800/80 pb-1 text-xs">
            {label}
          </p>
        )}
        {payload.map((entry: any, index: number) => {
          const color = entry.color || entry.fill || entry.payload?.fill || '#0EA5E9';
          const name = entry.name === 'inventoryValue' ? 'Valuation' : entry.name || entry.dataKey;
          const rawVal = entry.value;
          const formattedVal = isCurrency
            ? `$${Number(rawVal).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
            : `${valuePrefix}${Number(rawVal).toLocaleString()}${valueSuffix}`;

          return (
            <div key={index} className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-gray-600 dark:text-gray-300 font-medium">{name}:</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white font-mono">{formattedVal}</span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};
