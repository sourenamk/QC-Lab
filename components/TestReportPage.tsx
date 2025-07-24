
import React from 'react';
import { TestData, CalculatedStats, CumulativeDataPoint } from './types';
import { DataGraph } from './DataGraph';

export const TestReportPage: React.FC<{ test: TestData; stats: CalculatedStats; chartData: CumulativeDataPoint[] }> = ({ test, stats, chartData }) => {

    // --- Data processing for the components ---
    const bioCvGoal = test.refBioCVStr ? parseFloat(test.refBioCVStr) : NaN;
    const bioBiasGoal = test.refBioBiasStr ? parseFloat(test.refBioBiasStr) : NaN;
    const bioTeGoal = test.refBioTEaStr ? parseFloat(test.refBioTEaStr) : NaN;
    const cliaTeGoal = test.cliaTEaStr ? parseFloat(test.cliaTEaStr) : NaN;

    const labCv = stats.observedCV;
    const labBias = stats.biasPercent;
    const labTe = stats.totalErrorPercent;

    const getMetricStatus = (labValue: number | null | undefined, bioGoal: number, cliaGoal?: number): boolean | null => {
        if (labValue === null || labValue === undefined || isNaN(labValue)) return null;

        const bioGoalNum = isNaN(bioGoal) ? null : bioGoal;
        const cliaGoalNum = (cliaGoal === undefined || isNaN(cliaGoal)) ? null : cliaGoal;

        if (bioGoalNum === null && cliaGoalNum === null) return null;

        const meetsBioGoal = bioGoalNum === null ? true : Math.abs(labValue) <= bioGoalNum;
        const meetsCliaGoal = cliaGoalNum === null ? true : Math.abs(labValue) <= cliaGoalNum;
        
        if (cliaGoalNum !== null) {
            return meetsBioGoal && meetsCliaGoal;
        }
        return meetsBioGoal;
    };

    const cvStatus = getMetricStatus(labCv, bioCvGoal);
    const biasStatus = getMetricStatus(labBias, bioBiasGoal);
    const teStatus = getMetricStatus(labTe, bioTeGoal, cliaTeGoal);


    const renderStatusIcon = (status: boolean | null) => {
        if (status === true) return <span style={{ color: '#22c55e', fontSize: '14pt' }}>✔</span>;
        if (status === false) return <span style={{ color: '#ef4444', fontSize: '14pt' }}>✘</span>;
        return <span style={{ color: '#6b7280' }}>-</span>;
    };

    const formatValue = (value: number | null | undefined, unit: string) => (value === null || value === undefined || isNaN(value)) ? 'N/A' : `${value.toFixed(2)}${unit}`;
    const formatGoal = (goal: number | null | undefined, prefix: string) => (goal === null || goal === undefined || isNaN(goal)) ? 'N/A' : `${prefix}${goal.toFixed(2)}%`;
    const formatCliaGoal = (testMetric: "CV" | "BIAS" | "TE", teGoal: number) => {
        if (testMetric === "TE") {
            return formatGoal(teGoal, '≤ ');
        }
        return 'N/A';
    };

    return (
        <div style={{
            width: '210mm',
            height: '297mm',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            color: '#000000',
            fontFamily: 'Helvetica, Arial, sans-serif',
            boxSizing: 'border-box',
        }}>
            {/* Top 50% of A4 Page */}
            <div style={{
                height: '148.5mm', // A5 height
                boxSizing: 'border-box',
                padding: '10mm 10mm 5mm 10mm', // Margins for top half
                display: 'flex',
                flexDirection: 'column'
            }}>
                <h1 style={{ fontSize: '20pt', fontWeight: 'bold', textAlign: 'center', margin: 0, flexShrink: 0, color: '#000000', paddingBottom: '5mm' }}>
                    {test.name} QC Report
                </h1>
                <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
                    <DataGraph 
                        id={`report-chart-${test.id}`}
                        isPdf={true}
                        width={841} // A5 landscape aspect ratio
                        height={595} // A5 landscape aspect ratio
                        data={chartData}
                        title=""
                        targetMean={parseFloat(test.targetMeanStr)}
                        observedMean={stats.observedMean}
                        observedSD={stats.observedSD}
                        westgardViolations={[]}
                    />
                </div>
            </div>

            {/* Bottom 50% of A4 Page */}
            <div style={{
                height: '148.5mm', // A5 height
                boxSizing: 'border-box',
                padding: '5mm 10mm 10mm 10mm', // Margins for bottom half
                display: 'flex',
                flexDirection: 'row',
                gap: '10mm'
            }}>
                {/* Component A: Left Side - Statistical Metrics */}
                <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '14pt', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '2mm', marginBottom: '4mm', color: '#000000' }}>
                        Statistical Metrics
                    </h3>
                    <div style={{ fontSize: '11pt', lineHeight: '2.0', color: '#000000' }}>
                        <p>
                            <strong style={{ minWidth: '150px', display: 'inline-block', color: '#000000' }}>Coefficient of Variation (CV%):</strong>
                            {formatValue(stats.observedCV, '%')}
                        </p>
                        <p>
                            <strong style={{ minWidth: '150px', display: 'inline-block', color: '#000000' }}>Bias:</strong>
                            {formatValue(stats.biasPercent, '%')}
                        </p>
                         <p>
                            <strong style={{ minWidth: '150px', display: 'inline-block', color: '#000000' }}>Total Error (TE):</strong>
                            {formatValue(stats.totalErrorPercent, '%')}
                        </p>
                    </div>
                </div>

                {/* Component B: Right Side - Performance Comparison Table */}
                <div style={{ flex: '1.5', display: 'flex', flexDirection: 'column' }}>
                     <h3 style={{ fontSize: '14pt', fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '2mm', marginBottom: '4mm', color: '#000000' }}>
                        Quality Goal Comparison
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt', color: '#000000' }}>
                        <thead>
                            <tr style={{ borderBottom: '1.5px solid #333', textAlign: 'left' }}>
                                <th style={{ padding: '2mm 1mm', color: '#000000' }}>Metric</th>
                                <th style={{ padding: '2mm 1mm', color: '#000000' }}>Lab's Value</th>
                                <th style={{ padding: '2mm 1mm', color: '#000000' }}>Bio. Var. Goal</th>
                                <th style={{ padding: '2mm 1mm', color: '#000000' }}>CLIA Goal</th>
                                <th style={{ padding: '2mm 1mm', textAlign: 'center', color: '#000000' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '3mm 1mm', fontWeight: 'bold', color: '#000000' }}>CV%</td>
                                <td style={{ padding: '3mm 1mm', fontWeight: 'bold', fontSize: '11pt', color: '#000000' }}>{formatValue(labCv, '%')}</td>
                                <td style={{ padding: '3mm 1mm', color: '#000000' }}>{formatGoal(bioCvGoal, '≤ ')}</td>
                                <td style={{ padding: '3mm 1mm', color: '#000000' }}>{formatCliaGoal("CV", cliaTeGoal)}</td>
                                <td style={{ padding: '3mm 1mm', textAlign: 'center' }}>{renderStatusIcon(cvStatus)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '3mm 1mm', fontWeight: 'bold', color: '#000000' }}>Bias</td>
                                <td style={{ padding: '3mm 1mm', fontWeight: 'bold', fontSize: '11pt', color: '#000000' }}>{formatValue(labBias, '%')}</td>
                                <td style={{ padding: '3mm 1mm', color: '#000000' }}>{formatGoal(bioBiasGoal, '≤ ')}</td>
                                <td style={{ padding: '3mm 1mm', color: '#000000' }}>{formatCliaGoal("BIAS", cliaTeGoal)}</td>
                                <td style={{ padding: '3mm 1mm', textAlign: 'center' }}>{renderStatusIcon(biasStatus)}</td>
                            </tr>
                            <tr style={{ borderBottom: 'none' }}>
                                <td style={{ padding: '3mm 1mm', fontWeight: 'bold', color: '#000000' }}>Total Error (TE)</td>
                                <td style={{ padding: '3mm 1mm', fontWeight: 'bold', fontSize: '11pt', color: '#000000' }}>{formatValue(labTe, '%')}</td>
                                <td style={{ padding: '3mm 1mm', color: '#000000' }}>{formatGoal(bioTeGoal, '≤ ')}</td>
                                <td style={{ padding: '3mm 1mm', color: '#000000' }}>{formatCliaGoal("TE", cliaTeGoal)}</td>
                                <td style={{ padding: '3mm 1mm', textAlign: 'center' }}>{renderStatusIcon(teStatus)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
