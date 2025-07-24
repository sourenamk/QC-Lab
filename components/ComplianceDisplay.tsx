
import React from 'react';
import { CalculatedStats, TestData } from './types';

interface ComplianceDisplayProps {
  calculatedStats: CalculatedStats | null;
  testData: TestData | null;
  isPdf?: boolean;
}

const ComplianceItem: React.FC<{ label: string; userValue: string | null; targetValue: string | null; compliant?: boolean | null; notes?: string; isPdf?: boolean }> = ({ label, userValue, targetValue, compliant, notes, isPdf = false }) => {
  let complianceText = '';
  let textColor = 'text-gray-300';

  if (compliant === true) {
    complianceText = ' (Compliant)';
    textColor = 'text-green-500';
  } else if (compliant === false) {
    complianceText = ' (Not Compliant)';
    textColor = 'text-red-500';
  } else if (compliant === null) {
    complianceText = ' (N/A)';
    textColor = 'text-gray-500';
  }


  return (
    <div className={isPdf ? 'mb-1' : 'mb-2'}>
      <span className={`font-semibold printable-hidden ${isPdf ? 'text-gray-800 text-sm' : ''}`}>{label}: </span>
      <span className={`ml-2 ${textColor} ${isPdf ? 'text-sm' : ''}`}>
        <span className="printable-hidden">User: </span>
        {userValue ?? 'N/A'}
        {targetValue && <span className="printable-hidden"> (Target: {targetValue})</span>}
        {complianceText}
      </span>
      {notes && <p className={`text-xs pl-2 printable-hidden ${isPdf ? 'text-gray-600' : 'text-gray-500'}`}>{notes}</p>}
    </div>
  );
};

export const ComplianceDisplay: React.FC<ComplianceDisplayProps> = ({ calculatedStats, testData, isPdf = false }) => {
  const renderContent = () => {
    if (!calculatedStats || !testData) {
      return <p className={`italic printable-hidden ${isPdf ? 'text-gray-700' : 'text-gray-500'}`}>Compliance data not yet available.</p>;
    }

    const { observedCV, biasPercent, observedMean } = calculatedStats;
    const { refBioCVStr, refBioBiasStr, cliaTEaStr, refBioTEaStr, targetMeanStr } = testData;

    const targetMean = parseFloat(targetMeanStr);

    // Biological Variation Compliance
    const bioCvTarget = parseFloat(refBioCVStr);
    const bioBiasTarget = parseFloat(refBioBiasStr);

    const isBioCvCompliant = (observedCV !== null && !isNaN(bioCvTarget)) ? observedCV <= bioCvTarget : null;
    const isBioBiasCompliant = (biasPercent !== null && !isNaN(bioBiasTarget)) ? Math.abs(biasPercent) <= bioBiasTarget : null;

    // TEa Compliance
    let teaStrToUse: string | null = null;
    let teaSource: string | null = null;

    if (cliaTEaStr && !isNaN(parseFloat(cliaTEaStr))) {
      teaStrToUse = cliaTEaStr;
      teaSource = 'CLIA';
    } else if (refBioTEaStr && !isNaN(parseFloat(refBioTEaStr))) {
      teaStrToUse = refBioTEaStr;
      teaSource = 'Biological Variation';
    }

    const teaPercentTarget = teaStrToUse ? parseFloat(teaStrToUse) : null;
    let isTeaCompliant: boolean | null = null;
    let teaComplianceNotes = `Using TEa from: ${teaSource || 'Not specified'}.`;


    if (teaPercentTarget !== null && observedMean !== null && !isNaN(targetMean) && targetMean !== 0 && observedCV !== null && biasPercent !== null) {
      const teaAbsolute = (teaPercentTarget / 100) * targetMean;
      const lowerLimit = targetMean - teaAbsolute;
      const upperLimit = targetMean + teaAbsolute;
      isTeaCompliant = observedMean >= lowerLimit && observedMean <= upperLimit;
      teaComplianceNotes += ` Target range for mean: ${lowerLimit.toFixed(2)} - ${upperLimit.toFixed(2)}. Observed mean: ${observedMean.toFixed(2)}.`;
    } else if (teaPercentTarget === null) {
      teaComplianceNotes = 'TEa target not specified or invalid.';
    } else {
      teaComplianceNotes += ' Insufficient data for full TEa assessment (e.g., Observed Mean, Target Mean, CV, or Bias missing).';
    }

    return (
      <>
        <div className={`rounded-md shadow-sm border mb-4 ${isPdf ? 'p-2 bg-gray-50 border-gray-200' : 'p-4 bg-gray-700/50 border-gray-700'}`}>
          <h4 className={`font-semibold mb-1 printable-hidden ${isPdf ? 'text-base text-black' : 'text-md text-gray-300'}`}>Biological Variation Goals</h4>
          <ComplianceItem
            label="Observed CV"
            userValue={observedCV?.toFixed(2) + '%' ?? 'N/A'}
            targetValue={!isNaN(bioCvTarget) ? bioCvTarget.toFixed(2) + '%' : 'N/A'}
            compliant={isBioCvCompliant}
            isPdf={isPdf}
          />
          <ComplianceItem
            label="Observed Bias"
            userValue={biasPercent?.toFixed(2) + '%' ?? 'N/A'}
            targetValue={!isNaN(bioBiasTarget) ? bioBiasTarget.toFixed(2) + '%' : 'N/A'}
            compliant={isBioBiasCompliant}
            isPdf={isPdf}
          />
        </div>

        <div className={`rounded-md shadow-sm border ${isPdf ? 'p-2 bg-gray-50 border-gray-200' : 'p-4 bg-gray-700/50 border-gray-700'}`}>
          <h4 className={`font-semibold mb-1 printable-hidden ${isPdf ? 'text-base text-black' : 'text-md text-gray-300'}`}>Total Allowable Error (TEa)</h4>
          <ComplianceItem
            label="Overall Performance vs TEa"
            userValue={isTeaCompliant === null ? "Cannot Assess" : (isTeaCompliant ? "Meets TEa" : "Exceeds TEa")}
            targetValue={teaPercentTarget?.toFixed(2) + '%' ?? 'N/A'}
            compliant={isTeaCompliant}
            notes={teaComplianceNotes}
            isPdf={isPdf}
          />
        </div>
      </>
    );
  };
  
  return (
     <div className={`rounded-lg border compact-display ${isPdf ? 'p-2 bg-white border-gray-200' : 'p-6 bg-gray-800 border-gray-700'}`}>
      <h3 className={`font-semibold mb-2 printable-hidden ${isPdf ? 'text-lg text-black' : 'text-xl text-gray-200'}`}>Compliance Assessment</h3>
      {renderContent()}
    </div>
  );
};