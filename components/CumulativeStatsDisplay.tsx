
import React from 'react';
import { CalculatedStats } from './types';

interface CumulativeStatsDisplayProps {
  stats: CalculatedStats | null;
  isPdf?: boolean;
}

const StatCard: React.FC<{ label: string; value: string | null; unit?: string; isPdf?: boolean }> = ({ label, value, unit, isPdf = false }) => (
  <div className={`flex flex-col rounded-lg shadow-md border text-center ${isPdf ? 'p-2 bg-gray-50 border-gray-200' : 'p-4 bg-gray-800/80 border-gray-700'}`}>
    <dt className={`font-medium truncate printable-hidden ${isPdf ? 'text-xs text-gray-600' : 'text-sm text-gray-400'}`}>{label}</dt>
    <dd className={`mt-1 font-semibold tracking-tight ${isPdf ? 'text-xl text-black' : 'text-2xl text-white'}`}>
      {value ?? 'N/A'}
      {value && unit && <span className={`ml-1 font-normal printable-hidden ${isPdf ? 'text-base text-gray-700' : 'text-lg text-gray-300'}`}>{unit}</span>}
    </dd>
  </div>
);

export const CumulativeStatsDisplay: React.FC<CumulativeStatsDisplayProps> = ({ stats, isPdf = false }) => {
  if (!stats) return null;

  return (
    <div className="compact-display">
        <h3 className={`font-semibold printable-hidden ${isPdf ? 'text-lg mb-1 text-black' : 'text-xl mb-4 text-gray-200'}`}>Cumulative Statistics</h3>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-2 stat-card-grid">
            <StatCard label="Bias" value={stats.biasPercent?.toFixed(2) ?? null} unit="%" isPdf={isPdf} />
            <StatCard label="CV" value={stats.observedCV?.toFixed(2) ?? null} unit="%" isPdf={isPdf} />
            <StatCard label="Data Points" value={stats.count.toString()} isPdf={isPdf} />
        </dl>
    </div>
  );
};