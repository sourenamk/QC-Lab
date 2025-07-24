
import React, { useState } from 'react';
import { CategoryMultiPageReportData, TestDataForReport } from './types';
import { DataGraph } from './DataGraph';
import { MultiPageReportGenerator } from './MultiPageReportGenerator';

const TestResultTable: React.FC<{ testInfo: TestDataForReport }> = ({ testInfo }) => {
    const { testData, stats } = testInfo;
    return (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-4 h-full">
            <h4 className="text-lg font-bold text-teal-300 mb-2 truncate">{testData.name}</h4>
            <table className="w-full text-sm text-left">
                <tbody className="divide-y divide-gray-700">
                    <tr>
                        <td className="py-2 font-medium text-gray-400">Data Points</td>
                        <td className="py-2 text-gray-200 text-right">{stats.count}</td>
                    </tr>
                    <tr>
                        <td className="py-2 font-medium text-gray-400">Observed Mean</td>
                        <td className="py-2 text-gray-200 text-right">{stats.observedMean?.toFixed(2) ?? 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 font-medium text-gray-400">Observed SD</td>
                        <td className="py-2 text-gray-200 text-right">{stats.observedSD?.toFixed(3) ?? 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 font-medium text-gray-400">Observed CV (%)</td>
                        <td className="py-2 text-gray-200 text-right">{stats.observedCV?.toFixed(2) ?? 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 font-medium text-gray-400">Bias (%)</td>
                        <td className="py-2 text-gray-200 text-right">{stats.biasPercent?.toFixed(2) ?? 'N/A'}</td>
                    </tr>
                    <tr>
                        <td className="py-2 font-medium text-gray-400">Total Error (%)</td>
                        <td className="py-2 text-gray-200 text-right">{stats.totalErrorPercent?.toFixed(2) ?? 'N/A'}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};


export const CategoryReport: React.FC<{ data: CategoryMultiPageReportData, onClose: () => void }> = ({ data, onClose }) => {
    const [activeTab, setActiveTab] = useState('results'); // 'results' or 'charts'
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 z-50 flex flex-col p-4 sm:p-6 lg:p-8" role="dialog" aria-modal="true" aria-labelledby="category-report-title">
            <div className="flex-shrink-0 flex items-center justify-between pb-4 border-b border-gray-700">
                <h2 id="category-report-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                    {data.categoryName} Summary Report
                </h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
                >
                    <span className="sr-only">Close</span>
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex-shrink-0 my-4 border-b border-gray-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('results')}
                        role="tab"
                        aria-selected={activeTab === 'results'}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'results' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-t-sm`}
                    >
                        Data & Results
                    </button>
                    <button
                        onClick={() => setActiveTab('charts')}
                        role="tab"
                        aria-selected={activeTab === 'charts'}
                        className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'charts' ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-t-sm`}
                    >
                        Charts
                    </button>
                </nav>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {activeTab === 'results' && (
                    <div role="tabpanel" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {data.tests.map(testInfo => (
                            <TestResultTable key={testInfo.testData.id} testInfo={testInfo} />
                        ))}
                    </div>
                )}
                {activeTab === 'charts' && (
                     <div role="tabpanel" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {data.tests.map(testInfo => (
                             <div key={testInfo.testData.id} className="bg-gray-800 p-2 rounded-lg border border-gray-700">
                                <DataGraph
                                    id={`summary-chart-${testInfo.testData.id}`}
                                    data={testInfo.chartData}
                                    title={`${testInfo.testData.name} QC Chart`}
                                    targetMean={parseFloat(testInfo.testData.targetMeanStr)}
                                    observedMean={testInfo.stats.observedMean}
                                    observedSD={testInfo.stats.observedSD}
                                    westgardViolations={[]} // Full violations not shown in summary view
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="flex-shrink-0 pt-5 mt-3 border-t border-gray-700 flex justify-end">
                <button
                    onClick={() => setIsGeneratingPdf(true)}
                    disabled={isGeneratingPdf}
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {isGeneratingPdf ? 'Generating...' : 'Generate PDF Report'}
                </button>
            </div>

            {isGeneratingPdf && <MultiPageReportGenerator data={data} onComplete={() => setIsGeneratingPdf(false)} />}
        </div>
    );
};
