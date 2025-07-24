
import React from 'react';
import { WestgardRuleViolation } from './types';

interface WestgardResultsDisplayProps {
  violations: WestgardRuleViolation[];
  isPdf?: boolean;
}

export const WestgardResultsDisplay: React.FC<WestgardResultsDisplayProps> = ({ violations, isPdf = false }) => {
  return (
    <div className={`rounded-lg border compact-display ${isPdf ? 'p-2 bg-white border-gray-200' : 'p-6 bg-gray-800 border-gray-700'}`}>
      <h3 className={`font-semibold printable-hidden ${isPdf ? 'text-lg mb-1 text-black' : 'text-xl mb-2 text-gray-200'}`}>Westgard Rule Evaluation</h3>
      {violations.length === 0 ? (
        <p className="text-green-500 printable-hidden text-sm">No Westgard rule violations detected.</p>
      ) : (
        <ul className={`list-disc pl-5 space-y-0.5 westgard-list ${isPdf ? 'text-sm' : ''}`}>
          {violations.map((violation, index) => (
            <li key={index} className={violation.rule.includes('Warning') ? 'text-yellow-500' : 'text-red-500'}>
              <strong className="font-semibold">{violation.rule}</strong>
              <span className={`printable-hidden ${isPdf ? 'text-gray-800' : ''}`}>: {violation.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};