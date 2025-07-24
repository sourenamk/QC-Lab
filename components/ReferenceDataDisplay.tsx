
import React from 'react';
import { TestData } from './types';

interface ReferenceDataDisplayProps {
  testData: TestData | null;
  isPdf?: boolean;
}

export const ReferenceDataDisplay: React.FC<ReferenceDataDisplayProps> = ({ testData, isPdf = false }) => {
  const renderContent = () => {
     if (!testData) {
        return <p className={`italic text-sm printable-hidden ${isPdf ? 'text-gray-700' : 'text-gray-500'}`}>Reference data not available for the selected test.</p>;
     }
     return (
        <div className={`space-y-1 rounded-md shadow-sm border ${isPdf ? 'p-2 text-sm bg-gray-50 border-gray-200' : 'p-3 text-sm bg-gray-700/50 border-gray-700'}`}>
            <p>
            <span className={`font-medium printable-hidden ${isPdf ? 'text-gray-600' : 'text-gray-400'}`}>Bio. Var. CV (%): </span>
            <span className={`ml-2 ${isPdf ? 'text-black' : 'text-gray-100'}`}>{testData.refBioCVStr || 'N/A'}</span>
            </p>
            <p>
            <span className={`font-medium printable-hidden ${isPdf ? 'text-gray-600' : 'text-gray-400'}`}>Bio. Var. Bias (%): </span>
            <span className={`ml-2 ${isPdf ? 'text-black' : 'text-gray-100'}`}>{testData.refBioBiasStr || 'N/A'}</span>
            </p>
            <p>
            <span className={`font-medium printable-hidden ${isPdf ? 'text-gray-600' : 'text-gray-400'}`}>Bio. Var. TEa (%): </span>
            <span className={`ml-2 ${isPdf ? 'text-black' : 'text-gray-100'}`}>{testData.refBioTEaStr || 'N/A'}</span>
            </p>
            <p>
            <span className={`font-medium printable-hidden ${isPdf ? 'text-gray-600' : 'text-gray-400'}`}>CLIA TEa (%): </span>
            <span className={`ml-2 ${isPdf ? 'text-black' : 'text-gray-100'}`}>{testData.cliaTEaStr || 'N/A'}</span>
            </p>
        </div>
     );
  };

  return (
    <div className={`rounded-lg border compact-display ${isPdf ? 'p-2 bg-white border-gray-200' : 'p-6 bg-gray-800 border-gray-700'}`}>
      <h3 className={`font-semibold mb-1 printable-hidden ${isPdf ? 'text-lg text-black' : 'text-xl text-gray-200'}`}>Reference Data</h3>
      {renderContent()}
    </div>
  );
};