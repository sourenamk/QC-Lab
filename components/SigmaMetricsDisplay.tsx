
import React from 'react';
import { SigmaMetricResult } from './types';

interface SigmaMetricsDisplayProps {
  sigmaMetrics: SigmaMetricResult | null;
  warningThreshold?: number | null;
  criticalThreshold?: number | null;
  isPdf?: boolean;
}

export const SigmaMetricsDisplay: React.FC<SigmaMetricsDisplayProps> = ({ sigmaMetrics, warningThreshold, criticalThreshold, isPdf = false }) => {
  const renderContent = () => {
    if (!sigmaMetrics) {
      return <p className={`italic text-sm printable-hidden ${isPdf ? 'text-gray-700' : 'text-gray-500'}`}>Sigma metrics not yet calculated.</p>;
    }
    
    const { sigmaValue, assessment, details } = sigmaMetrics;
  
    let assessmentColor = 'text-gray-300';
    let thresholdMessage = '';
  
    if (sigmaValue !== null) {
      if (criticalThreshold !== null && sigmaValue < criticalThreshold) {
        assessmentColor = 'text-red-500 font-bold';
        thresholdMessage = `CRITICAL: Sigma (${sigmaValue.toFixed(2)}) is below critical threshold (${criticalThreshold.toFixed(2)}).`;
      } else if (warningThreshold !== null && sigmaValue < warningThreshold) {
        assessmentColor = 'text-yellow-400 font-semibold';
        thresholdMessage = `WARNING: Sigma (${sigmaValue.toFixed(2)}) is below warning threshold (${warningThreshold.toFixed(2)}).`;
      } else {
        if (sigmaValue >= 6) assessmentColor = 'text-green-400';
        else if (sigmaValue >= 5) assessmentColor = 'text-green-500';
        else if (sigmaValue >= 4) assessmentColor = 'text-lime-400';
        else if (sigmaValue >= 3) assessmentColor = 'text-yellow-500';
        else assessmentColor = 'text-red-500';
      }
    }
  
    return (
      <div className={`space-y-1 rounded-md shadow-sm border ${isPdf ? 'p-2 text-sm bg-gray-50 border-gray-200' : 'p-3 text-sm bg-gray-700/50 border-gray-700'}`}>
        <p>
          <span className={`font-medium printable-hidden ${isPdf ? 'text-gray-600' : 'text-gray-400'}`}>Sigma Value: </span>
          <span className={`ml-2 font-bold ${assessmentColor}`}>{sigmaValue !== null ? sigmaValue.toFixed(2) : 'N/A'}</span>
        </p>
        <p>
          <span className={`font-medium printable-hidden ${isPdf ? 'text-gray-600' : 'text-gray-400'}`}>Assessment: </span>
          <span className={`ml-2 ${assessmentColor}`}>{assessment}</span>
        </p>
        {thresholdMessage && (
          <p className={`mt-1 ${isPdf ? 'text-xs' : 'text-sm'} ${assessmentColor.includes('red') ? 'text-red-500' : 'text-yellow-400'} printable-hidden`}>
            {thresholdMessage}
          </p>
        )}
        {details && (
          <p className={`text-xs mt-1 printable-hidden ${isPdf ? 'text-gray-700' : 'text-gray-500'}`}>
            <span className="font-medium">Details:</span> {details}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-lg border compact-display ${isPdf ? 'p-2 bg-white border-gray-200' : 'p-6 bg-gray-800 border-gray-700'}`}>
      <h3 className={`font-semibold mb-1 printable-hidden ${isPdf ? 'text-lg text-black' : 'text-xl text-gray-200'}`}>Sigma Metrics</h3>
      {renderContent()}
    </div>
  );
};