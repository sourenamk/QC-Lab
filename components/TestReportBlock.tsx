
import React from 'react';
import { CategoryTestAnalysis } from './types';
import { DataGraph } from './DataGraph';
import { CumulativeStatsDisplay } from './CumulativeStatsDisplay';
import { WestgardResultsDisplay } from './WestgardResultsDisplay';
import { SigmaMetricsDisplay } from './SigmaMetricsDisplay';
import { ReferenceDataDisplay } from './ReferenceDataDisplay';
import { ComplianceDisplay } from './ComplianceDisplay';

interface TestReportBlockProps {
  item: CategoryTestAnalysis;
  isPdf?: boolean;
}

export const TestReportBlock: React.FC<TestReportBlockProps> = ({ item, isPdf = false }) => {
  const { test, analysis, chartData } = item;

  // This component is now primarily for offscreen PDF rendering.
  // The layout is optimized for a fixed width (750px) and compact vertical space.
  if (!isPdf) {
      // Fallback for potential non-PDF uses, though not currently implemented.
      return <div>This block is intended for PDF generation.</div>;
  }

  return (
    <div style={{ width: '750px', backgroundColor: '#ffffff', color: '#000000', fontFamily: 'sans-serif' }}>
      <section className="test-report-section p-4 border rounded-lg bg-white border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-4 border-b pb-2 text-black border-gray-200">{test.name}</h2>
        
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
                <DataGraph
                    id={`chart-pdf-${test.id}`}
                    data={chartData}
                    title={``}
                    targetMean={parseFloat(test.targetMeanStr)}
                    observedMean={analysis.calculatedStats.observedMean}
                    observedSD={analysis.calculatedStats.observedSD}
                    westgardViolations={analysis.westgardViolations}
                    isPdf={isPdf}
                    width={340}
                    height={210}
                />
            </div>
            <div className="col-span-1 space-y-2">
                <CumulativeStatsDisplay stats={analysis.calculatedStats} isPdf={isPdf} />
                <WestgardResultsDisplay violations={analysis.westgardViolations} isPdf={isPdf} />
                <SigmaMetricsDisplay
                    sigmaMetrics={analysis.sigmaMetric}
                    warningThreshold={parseFloat(test.sigmaWarningThresholdStr)}
                    criticalThreshold={parseFloat(test.sigmaCriticalThresholdStr)}
                    isPdf={isPdf}
                />
            </div>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-4">
             <ReferenceDataDisplay testData={test} isPdf={isPdf} />
             <ComplianceDisplay calculatedStats={analysis.calculatedStats} testData={test} isPdf={isPdf} />
        </div>
      </section>
    </div>
  );
};