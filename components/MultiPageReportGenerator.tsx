
import React, { useEffect, useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CategoryMultiPageReportData, TestDataForReport } from './types';
import { LoadingSpinner } from './LoadingSpinner';
import { TestReportPage } from './TestReportPage';

interface MultiPageReportGeneratorProps {
    data: CategoryMultiPageReportData;
    onComplete: () => void;
}

export const MultiPageReportGenerator: React.FC<MultiPageReportGeneratorProps> = ({ data, onComplete }) => {
    const [status, setStatus] = useState<string>('Initializing report...');
    const [currentlyRenderingTest, setCurrentlyRenderingTest] = useState<TestDataForReport | null>(data.tests[0] ?? null);
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const generateReport = async () => {
            try {
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });

                const testsToReport = data.tests;

                for (let i = 0; i < testsToReport.length; i++) {
                    const testInfo = testsToReport[i];
                    setStatus(`Processing page ${i + 1} of ${testsToReport.length}: ${testInfo.testData.name}`);
                    setCurrentlyRenderingTest(testInfo);
                    
                    // Allow React to render the component before capturing
                    await new Promise(resolve => setTimeout(resolve, 100));

                    if (!reportRef.current) {
                        throw new Error('Report container element not found.');
                    }
                    
                    const canvas = await html2canvas(reportRef.current, {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        backgroundColor: '#ffffff'
                    });

                    const imgData = canvas.toDataURL('image/png');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();

                    if (i > 0) {
                        pdf.addPage();
                    }
                    
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                }

                setStatus('Saving PDF...');
                const fileName = `QC_Report_${data.categoryName.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
                pdf.save(fileName);
                
                onComplete();

            } catch (error) {
                console.error("PDF generation failed", error);
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                setStatus(`Error: ${errorMessage}`);
                // Do not auto-close on error. Let the user see the message.
            }
        };

        generateReport();
    }, [data, onComplete]);

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center z-[100]">
                <LoadingSpinner size="large" />
                <p className="text-white mt-4 text-lg text-center px-4">{status}</p>
                {status.startsWith('Error:') && (
                     <button 
                        onClick={onComplete}
                        className="mt-6 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none"
                    >
                        Close
                    </button>
                )}
            </div>
            {/* Hidden offscreen container for rendering each page */}
            <div style={{ position: 'absolute', left: '-9999px', top: '0', zIndex: -1 }}>
                <div ref={reportRef}>
                    {currentlyRenderingTest && (
                        <TestReportPage 
                            test={currentlyRenderingTest.testData} 
                            stats={currentlyRenderingTest.stats} 
                            chartData={currentlyRenderingTest.chartData} 
                        />
                    )}
                </div>
            </div>
        </>
    );
};
