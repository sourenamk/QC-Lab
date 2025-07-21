
import React from 'react';
import { AnalysisResult } from './types';

interface ComparisonDisplayProps {
    userResult: AnalysisResult;
    controlResult: AnalysisResult;
    testName: string;
    targetMean: number | null;
    onClear: () => void;
}

const StatRow: React.FC<{ label: string; userValue: string | null; controlValue: string | null }> = ({ label, userValue, controlValue }) => {
    return (
        <tr>
            <td className="px-4 py-2 font-medium text-gray-400">{label}</td>
            <td className="px-4 py-2 text-center text-white">{userValue ?? 'N/A'}</td>
            <td className="px-4 py-2 text-center text-white">{controlValue ?? 'N/A'}</td>
        </tr>
    );
};

export const ComparisonDisplay: React.FC<ComparisonDisplayProps> = ({
    userResult,
    controlResult,
    testName,
    onClear
}) => {
    const userStats = userResult.calculatedStats;
    const controlStats = controlResult.calculatedStats;

    return (
        <div className="p-6 bg-gray-800 rounded-lg border border-purple-500/50 relative mt-8">
            <button
                onClick={onClear}
                className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                aria-label="Clear comparison"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <h3 className="text-xl font-semibold text-gray-200 mb-4">Comparison Report: Current vs. Control</h3>
            
            <div>
                <h4 className="text-lg font-medium text-gray-300 mb-2">Statistical Comparison</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-700/50 rounded-md">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Metric</th>
                                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-300">Current Run</th>
                                <th className="px-4 py-2 text-center text-sm font-semibold text-gray-300">Control Run</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-600">
                            <StatRow label="Data Points" userValue={userStats.count.toString()} controlValue={controlStats.count.toString()} />
                            <StatRow label="Mean" userValue={userStats.observedMean?.toFixed(2) ?? null} controlValue={controlStats.observedMean?.toFixed(2) ?? null} />
                            <StatRow label="SD" userValue={userStats.observedSD?.toFixed(3) ?? null} controlValue={controlStats.observedSD?.toFixed(3) ?? null} />
                            <StatRow label="CV (%)" userValue={userStats.observedCV?.toFixed(2) ?? null} controlValue={controlStats.observedCV?.toFixed(2) ?? null} />
                            <StatRow label="Bias (%)" userValue={userStats.biasPercent?.toFixed(2) ?? null} controlValue={controlStats.biasPercent?.toFixed(2) ?? null} />
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
