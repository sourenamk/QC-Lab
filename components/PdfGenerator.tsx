
import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CategoryReportData } from './types';
import { TestReportBlock } from './TestReportBlock';
import { LoadingSpinner } from './LoadingSpinner';

interface PdfGeneratorProps {
    data: CategoryReportData;
    onComplete: () => void;
}

const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;
const MARGIN_PT = 40;

export const PdfGenerator: React.FC<PdfGeneratorProps> = ({ data, onComplete }) => {
    const [status, setStatus] = useState<string>('Initializing...');
    const offscreenContainerRef = useRef<HTMLDivElement | null>(null);
    const offscreenRootRef = useRef<any>(null); // To hold the React root

    // Setup offscreen div for rendering components to be captured
    useEffect(() => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = '-9999px';
        div.style.top = '0';
        div.style.width = '750px'; // Set fixed width for consistent rendering resolution
        document.body.appendChild(div);
        offscreenContainerRef.current = div;
        offscreenRootRef.current = ReactDOM.createRoot(div);
        
        return () => {
            offscreenRootRef.current?.unmount();
            if (offscreenContainerRef.current) {
                document.body.removeChild(offscreenContainerRef.current);
            }
        };
    }, []);

    // PDF generation logic, runs when component is mounted with data
    useEffect(() => {
        if (!offscreenRootRef.current) return; // Wait for setup to complete

        const generatePdf = async () => {
            const pdf = new jsPDF('p', 'pt', 'a4');
            let yPos = MARGIN_PT;

            for (let i = 0; i < data.testAnalyses.length; i++) {
                const item = data.testAnalyses[i];
                setStatus(`Processing test ${i + 1} of ${data.testAnalyses.length}: ${item.test.name}`);

                // Render the current block offscreen with PDF-specific styling
                await new Promise<void>(resolve => {
                    offscreenRootRef.current.render(<TestReportBlock item={item} isPdf={true} />);
                    setTimeout(resolve, 500); 
                });

                const canvas = await html2canvas(offscreenContainerRef.current!.firstChild as HTMLElement, {
                    scale: 2, // Capture at higher resolution for better quality
                    useCORS: true,
                    backgroundColor: '#ffffff' // Use a white background for PDF
                });

                const imgData = canvas.toDataURL('image/png');
                const pdfImgWidth = A4_WIDTH_PT - (MARGIN_PT * 2);
                const pdfImgHeight = (canvas.height * pdfImgWidth) / canvas.width;
                
                // Check if the block fits on the current page, add new page if not
                if (i > 0 && yPos + pdfImgHeight > (A4_HEIGHT_PT - MARGIN_PT)) {
                    pdf.addPage();
                    yPos = MARGIN_PT; // Reset Y position for new page
                }

                pdf.addImage(imgData, 'PNG', MARGIN_PT, yPos, pdfImgWidth, pdfImgHeight);
                yPos += pdfImgHeight + 20; // Move Y position down for the next block, adding padding
            }

            setStatus('Saving PDF...');
            const fileName = `QC_Report_${data.categoryName.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
            pdf.save(fileName);
            onComplete();
        };

        generatePdf().catch(err => {
            console.error("PDF generation failed", err);
            alert("Sorry, there was an error generating the PDF.");
            onComplete();
        });

    }, [data, onComplete]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50">
            <LoadingSpinner message={status} size="large" />
            <p className="text-white mt-4 text-lg">{status}</p>
        </div>
    );
};