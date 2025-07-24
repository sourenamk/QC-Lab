

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AlertMessage } from './components/AlertMessage';
import { CategoryTabs } from './components/CategoryTabs';
import { TestSelector } from './components/TestSelector';
import { DataGraph } from './components/DataGraph';
import { WestgardResultsDisplay } from './components/WestgardResultsDisplay';
import {
  TestData, TestCategoryData, AppData, AnalysisResult, MonthlyAnalysis,
<<<<<<< HEAD
  BiochemistryTestNames, HematologyTestNames, MONTH_NAMES, CumulativeDataPoint, CategoryMultiPageReportData, TestDataForReport
=======
  BiochemistryTestNames, HematologyTestNames, MONTH_NAMES, CumulativeDataPoint, CategoryReportData
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
} from './components/types';
import { calculateStatsForSeries } from './services/qcCalculator';
import { evaluateWestgardRules } from './services/westgardRulesService';
import { loadAppData, saveAppData } from './services/localStorageService';
import { calculateSigmaMetric, getSigmaAssessment } from './services/sigmaMetricsService';
import { ReferenceDataDisplay } from './components/ReferenceDataDisplay';
import { ComplianceDisplay } from './components/ComplianceDisplay';
import { SigmaMetricsDisplay } from './components/SigmaMetricsDisplay';
import { MonthlyDataGrid } from './components/MonthlyDataGrid';
<<<<<<< HEAD
=======
import { CumulativeStatsDisplay } from './components/CumulativeStatsDisplay';
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
import { exportToPdf, exportToExcel } from './services/pdfReportService';
import Auth from './components/Auth';
import { UserProfile } from './components/UserProfile';
import { ComparisonDisplay } from './components/ComparisonDisplay';
import { parseMultiLineNumericString } from './utils/parsingUtils';
<<<<<<< HEAD
import { CategoryReport } from './components/CategoryReport';
import { CumulativeStatsDisplay } from './components/CumulativeStatsDisplay';

=======
import { PdfGenerator } from './components/PdfGenerator';
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684

// --- Shamsi Calendar Utilities ---
const GREGORIAN_EPOCH = 1721425.5;
const JALALI_EPOCH = 1948320.5;

const isShamsiLeap = (year: number): boolean => {
    // Birashk's algorithm for leap years
    const remainders = [1, 5, 9, 13, 17, 22, 26, 30];
    return remainders.includes(year > 0 ? year % 33 : (year % 33 + 33) % 33);
};

const getDaysInShamsiMonth = (year: number, month: number): number => {
    if (month >= 0 && month <= 5) return 31;
    if (month >= 6 && month <= 10) return 30;
    if (month === 11) return isShamsiLeap(year) ? 30 : 29;
    return 0; // Invalid month
};

function gregorianToJd(year: number, month: number, day: number): number {
    return (GREGORIAN_EPOCH - 1) + (365 * (year - 1)) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) + Math.floor((year - 1) / 400) + Math.floor((((367 * month) - 362) / 12) + (month <= 2 ? 0 : ((((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) ? -1 : -2)) + day);
}

function jdToGregorian(jd: number): { gy: number; gm: number; gd: number } {
    const wjd = Math.floor(jd - 0.5) + 0.5;
    const depoch = wjd - GREGORIAN_EPOCH;
    const quadricent = Math.floor(depoch / 146097);
    const dqc = depoch % 146097;
    const cent = Math.floor(dqc / 36524);
    const dcent = dqc % 36524;
    const quad = Math.floor(dcent / 1461);
    const dquad = dcent % 1461;
    const yindex = Math.floor(dquad / 365);
    let year = (quadricent * 400) + (cent * 100) + (quad * 4) + yindex;
    if (!((cent === 4) || (yindex === 4))) {
        year++;
    }
    const yearday = wjd - gregorianToJd(year, 1, 1);
    const leapadj = (wjd < gregorianToJd(year, 3, 1)) ? 0 : ((((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) ? 1 : 2);
    const month = Math.floor((((yearday + leapadj) * 12) + 373) / 367);
    const day = (wjd - gregorianToJd(year, month, 1)) + 1;
    return { gy: year, gm: month, gd: day };
}

function jalaliToJd(y: number, m: number, d: number): number {
    const epbase = y - (y >= 0 ? 474 : 473);
    const epyear = 474 + (epbase % 2820);
    return d + (m <= 7 ? (m - 1) * 31 : ((m - 1) * 30) + 6) + Math.floor(((epyear * 682) - 110) / 2816) + (epyear - 1) * 365 + Math.floor(epbase / 2820) * 1029983 + (JALALI_EPOCH - 1);
}

function shamsiToGregorian(jy: number, jm: number, jd: number): { gy: number, gm: number, gd: number } {
    return jdToGregorian(jalaliToJd(jy, jm, jd));
}

const shamsiDateParts = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { calendar: 'persian' }).formatToParts(new Date());
const currentShamsiYear = parseInt(shamsiDateParts.find(p => p.type === 'year')?.value ?? new Date().getFullYear().toString(), 10);
const currentShamsiMonth = parseInt(shamsiDateParts.find(p => p.type === 'month')?.value ?? (new Date().getMonth() + 1).toString(), 10) - 1;

const years = Array.from({ length: 10 }, (_, i) => currentShamsiYear - i);

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [appData, setAppData] = useState<AppData | null>(null);
  const [activeCategoryName, setActiveCategoryName] = useState<string>(BiochemistryTestNames.categoryName);
  const [activeTestId, setActiveTestId] = useState<string | null>(null);

  const [dayInputs, setDayInputs] = useState<string[]>([]);
  
  const [cumulativeAnalysisResult, setCumulativeAnalysisResult] = useState<AnalysisResult | null>(null);
  const [controlAnalysisResult, setControlAnalysisResult] = useState<AnalysisResult | null>(null);
  const [cumulativeChartData, setCumulativeChartData] = useState<CumulativeDataPoint[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [selectedMonth, setSelectedMonth] = useState(currentShamsiMonth);
  const [selectedYear, setSelectedYear] = useState(currentShamsiYear);
  
<<<<<<< HEAD
  const [categoryReportData, setCategoryReportData] = useState<CategoryMultiPageReportData | null>(null);
=======
  const [pdfGenerationData, setPdfGenerationData] = useState<CategoryReportData | null>(null);
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684

  useEffect(() => {
    const storedUser = localStorage.getItem('qcAppUser');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setIsAuthLoading(false);
  }, []);

  const handleLogin = (loggedInUser: { name: string; email: string }) => {
      localStorage.setItem('qcAppUser', JSON.stringify(loggedInUser));
      setUser(loggedInUser);
  };

  const handleLogout = () => {
      localStorage.removeItem('qcAppUser');
      setUser(null);
      setAppData(null);
      setActiveTestId(null);
<<<<<<< HEAD
      setCategoryReportData(null);
=======
      setPdfGenerationData(null);
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
      setIsLoading(true);
  };

  const createInitialTestData = (testInfo: {id: string, name: string}): TestData => ({
    id: testInfo.id,
    name: testInfo.name,
    targetMeanStr: '',
    refBioCVStr: '',
    refBioBiasStr: '',
    refBioTEaStr: '',
    cliaTEaStr: '',
    sigmaWarningThresholdStr: '4', 
    sigmaCriticalThresholdStr: '3', 
    targetCvPercentStr: '',
    monthlyAnalyses: {},
  });

  useEffect(() => {
    if (!user) {
        if (!isAuthLoading) setIsLoading(false);
        return;
    }
    setIsLoading(true);
    const loadedData = loadAppData(user.email);
    if (loadedData) {
        const migratedCategories = loadedData.categories.map(cat => ({
            ...cat,
            tests: cat.tests.map(t => {
                const { analysisHistory, ...restOfT } = t as any; // Remove old field
                const initialT = createInitialTestData(t);
                const newTest = { ...initialT, ...restOfT };
                if (!newTest.monthlyAnalyses) { // Ensure new field exists
                    newTest.monthlyAnalyses = {};
                }
                return newTest;
            }),
        }));
        const migratedAppData = { ...loadedData, categories: migratedCategories };
        setAppData(migratedAppData);
        if (migratedAppData.categories.length > 0) {
            const firstCategory = migratedAppData.categories[0];
            setActiveCategoryName(firstCategory.name);
            if (firstCategory.tests.length > 0) {
                setActiveTestId(firstCategory.tests[0].id);
            }
        }
        setSuccessMessage(`Welcome back, ${user.name}! Your data has been loaded.`);
        setTimeout(() => setSuccessMessage(null), 4000);
    } else {
      const initialCategories: TestCategoryData[] = [
        { name: BiochemistryTestNames.categoryName, tests: BiochemistryTestNames.tests.map(createInitialTestData) },
        { name: HematologyTestNames.categoryName, tests: HematologyTestNames.tests.map(createInitialTestData) },
      ];
      const initialAppData: AppData = { year: new Date().getFullYear(), categories: initialCategories };
      setAppData(initialAppData);
      setActiveCategoryName(initialCategories[0].name);
      setActiveTestId(initialCategories[0].tests.length > 0 ? initialCategories[0].tests[0].id : null);
      setSuccessMessage(`Welcome, ${user.name}! A new data profile has been created for you.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
    setIsLoading(false);
  }, [user, isAuthLoading]);

  const activeCategory = useMemo(() => appData?.categories.find(cat => cat.name === activeCategoryName), [appData, activeCategoryName]);
  const activeTest = useMemo(() => activeCategory?.tests.find(t => t.id === activeTestId), [activeCategory, activeTestId]);

  const aggregateAllDataForTest = useCallback((test: TestData): CumulativeDataPoint[] => {
    const allPoints: CumulativeDataPoint[] = [];
    if (!test.monthlyAnalyses) return [];

    const sortedYearMonthKeys = Object.keys(test.monthlyAnalyses).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      if (yearA !== yearB) return yearA - yearB;
      return monthA - monthB;
    });

    for (const yearMonthKey of sortedYearMonthKeys) {
        const [year, month] = yearMonthKey.split('-').map(Number);
        const monthlyData = test.monthlyAnalyses[yearMonthKey];
        
        const isCurrentMonth = year === selectedYear && month === selectedMonth;

        monthlyData.values.forEach((valueStr, dayIndex) => {
            const value = parseFloat(valueStr);
            if (!isNaN(value)) {
                const { gy, gm, gd } = shamsiToGregorian(year, month + 1, dayIndex + 1);
                const date = new Date(gy, gm - 1, gd);
                
                allPoints.push({
                    date: date,
                    value: value,
                    isCurrentMonth: isCurrentMonth,
                });
            }
        });
    }
    return allPoints;
  }, [selectedMonth, selectedYear]);

  // Effect to load data grid and chart for the current view
  useEffect(() => {
    if (!activeTest) return;

    // Load grid data for the selected Shamsi month
    const yearMonthKey = `${selectedYear}-${selectedMonth}`;
    const savedMonthData = activeTest.monthlyAnalyses?.[yearMonthKey];
    const daysInMonth = getDaysInShamsiMonth(selectedYear, selectedMonth);
    setDayInputs(savedMonthData ? savedMonthData.values.slice(0, daysInMonth) : Array(daysInMonth).fill(''));

    // Update chart with all historical data
    const aggregatedData = aggregateAllDataForTest(activeTest);
    setCumulativeChartData(aggregatedData);

  }, [activeTest, selectedMonth, selectedYear, aggregateAllDataForTest]);

  // Effect to clear analysis results ONLY when the user changes selection (test or date)
  useEffect(() => {
    setCumulativeAnalysisResult(null);
    setControlAnalysisResult(null);
  }, [activeTestId, selectedMonth, selectedYear]);


  const handleTestParamsChange = useCallback((testId: string, updatedData: Partial<TestData>) => {
    setAppData(prevData => {
      if (!prevData) return null;
      const newCategories = prevData.categories.map(category => {
        if (category.name === activeCategoryName) {
          return { ...category, tests: category.tests.map(test => test.id === testId ? { ...test, ...updatedData } : test) };
        }
        return category;
      });
      return { ...prevData, categories: newCategories };
    });
  }, [activeCategoryName]);

  const handleSaveParameters = () => {
    if (appData && user) {
      saveAppData(appData, user.email);
      setSuccessMessage("Test parameters saved successfully!");
      setTimeout(() => setSuccessMessage(null), 2500);
    }
  };
  
  const handleDayInputChange = (dayIndex: number, value: string) => {
    const newDayInputs = [...dayInputs];
    newDayInputs[dayIndex] = value;
    setDayInputs(newDayInputs);
  };
  
  const handleUpdateAndAnalyze = async () => {
    if (!activeTest || isAnalyzing || !appData || !user) return;
    setIsAnalyzing(true);
    setCumulativeAnalysisResult(null);
    setControlAnalysisResult(null); 
    setErrorMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 0));

      const targetMean = parseFloat(activeTest.targetMeanStr);
      if (isNaN(targetMean)) {
        setErrorMessage('Target Mean must be a valid number for analysis.');
        setIsAnalyzing(false);
        return;
      }
      
      const yearMonthKey = `${selectedYear}-${selectedMonth}`;
      const newMonthlyAnalysisForGrid: MonthlyAnalysis = {
        values: dayInputs,
        result: null
      };
      
      let updatedTest: TestData | undefined;
      const newAppData = {
        ...appData,
        categories: appData.categories.map(category => {
          if (category.name === activeCategoryName) {
            const newTests = category.tests.map(test => {
              if (test.id === activeTestId) {
                const newMonthlyAnalyses = { ...test.monthlyAnalyses, [yearMonthKey]: newMonthlyAnalysisForGrid };
                updatedTest = { ...test, monthlyAnalyses: newMonthlyAnalyses };
                return updatedTest;
              }
              return test;
            });
            return { ...category, tests: newTests };
          }
          return category;
        })
      };
      setAppData(newAppData);
      saveAppData(newAppData, user.email);

      if (!updatedTest) {
        setErrorMessage("Could not find the test to update.");
        setIsAnalyzing(false);
        return;
      }

      const cumulativeData = aggregateAllDataForTest(updatedTest);
      setCumulativeChartData(cumulativeData);
      
      if (cumulativeData.length === 0) {
        setErrorMessage("No numeric data found across all months to analyze.");
        setIsAnalyzing(false);
        return;
      }

      const dataValues = cumulativeData.map(d => d.value);
      
      const stats = calculateStatsForSeries(dataValues, targetMean);
      const violations = evaluateWestgardRules(dataValues, stats.observedMean, stats.observedSD);

      let sigmaMetrics: AnalysisResult['sigmaMetric'] = null;
      const teaStrToUse = activeTest.cliaTEaStr || activeTest.refBioTEaStr;
      if (stats.observedCV !== null && stats.biasPercent !== null && teaStrToUse) {
          const tea = parseFloat(teaStrToUse);
          if (!isNaN(tea)) {
              const sigmaValue = calculateSigmaMetric(tea, stats.biasPercent, stats.observedCV);
              sigmaMetrics = {
                  sigmaValue,
                  assessment: getSigmaAssessment(sigmaValue),
                  details: `Calculated using TEa=${tea}%, Bias=${stats.biasPercent.toFixed(2)}%, CV=${stats.observedCV.toFixed(2)}%`
              };
          }
      }

      const analysisResult: AnalysisResult = {
          timestamp: new Date().toISOString(),
          calculatedStats: stats,
          westgardViolations: violations,
          sigmaMetric: sigmaMetrics,
      };

      setCumulativeAnalysisResult(analysisResult);
      setSuccessMessage("Data updated and cumulative analysis complete!");
      setTimeout(() => setSuccessMessage(null), 3000);

    } catch(error) {
        console.error("Analysis failed:", error);
        setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred during analysis.");
    } finally {
        setIsAnalyzing(false);
    }
  };
  
 const handleGenerateCategoryPdf = (categoryName: string) => {
<<<<<<< HEAD
    setCategoryReportData(null); 
=======
    setPdfGenerationData(null); 
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
    setErrorMessage(null);

    if (!appData) {
        setErrorMessage("Application data is not loaded.");
        return;
    }

    const category = appData.categories.find(c => c.name === categoryName);
    if (!category) {
        setErrorMessage(`Category "${categoryName}" not found.`);
        return;
    }

<<<<<<< HEAD
    const testsForReport: TestDataForReport[] = category.tests
        .map(test => {
            const chartData = aggregateAllDataForTest(test);
            if (chartData.length === 0) return null; // Only include tests with data

            const dataValues = chartData.map(d => d.value);
            const targetMean = parseFloat(test.targetMeanStr);
            if (isNaN(targetMean)) return null; // Cannot analyze without a target mean

            const stats = calculateStatsForSeries(dataValues, targetMean);
            
            return {
                testData: test,
                stats: stats,
                chartData: chartData,
            };
        })
        .filter((item): item is TestDataForReport => item !== null);

    if (testsForReport.length === 0) {
        setErrorMessage(`No analyzed tests with data found in the ${categoryName} category to generate a report.`);
=======
    const testAnalyses = category.tests
        .map(test => {
            const chartData = aggregateAllDataForTest(test);
            if (chartData.length === 0) return null;

            const dataValues = chartData.map(d => d.value);
            const targetMean = parseFloat(test.targetMeanStr);
            if (isNaN(targetMean)) return null;

            const stats = calculateStatsForSeries(dataValues, targetMean);
            const violations = evaluateWestgardRules(dataValues, stats.observedMean, stats.observedSD);

            let sigmaMetrics: AnalysisResult['sigmaMetric'] = null;
            const teaStrToUse = test.cliaTEaStr || test.refBioTEaStr;
            if (stats.observedCV !== null && stats.biasPercent !== null && teaStrToUse) {
                const tea = parseFloat(teaStrToUse);
                if (!isNaN(tea)) {
                    const sigmaValue = calculateSigmaMetric(tea, stats.biasPercent, stats.observedCV);
                    sigmaMetrics = {
                        sigmaValue,
                        assessment: getSigmaAssessment(sigmaValue),
                        details: `TEa=${tea}%, Bias=${stats.biasPercent.toFixed(2)}%, CV=${stats.observedCV.toFixed(2)}%`,
                    };
                }
            }

            const analysis: AnalysisResult = {
                timestamp: new Date().toISOString(),
                calculatedStats: stats,
                westgardViolations: violations,
                sigmaMetric: sigmaMetrics,
            };

            return { test, analysis, chartData };
        })
        .filter((item): item is { test: TestData; analysis: AnalysisResult; chartData: CumulativeDataPoint[] } => item !== null);

    if (testAnalyses.length === 0) {
        setErrorMessage(`No data available to generate a report for the ${categoryName} category.`);
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
        setTimeout(() => setErrorMessage(null), 4000);
        return;
    }
    
<<<<<<< HEAD
    setCategoryReportData({
        categoryName,
        tests: testsForReport,
=======
    setPdfGenerationData({
        categoryName,
        testAnalyses,
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
    });
};

 const handleExportPdf = async () => {
    if (!cumulativeAnalysisResult || !activeTest || isExporting) return;
    setIsExporting(true);
    setSuccessMessage("Generating PDF report...");
    setErrorMessage(null);
    try {
      await exportToPdf('analysis-section-content', activeTest.name);
      setSuccessMessage("PDF report generated successfully!");
    } catch (error: any) {
      setErrorMessage(`Failed to generate PDF: ${error.message}`);
      setSuccessMessage(null);
    } finally {
      setIsExporting(false);
      setTimeout(() => {
          setSuccessMessage(null);
          setErrorMessage(null);
      }, 4000);
    }
  };

  const handleExportExcel = async () => {
    if (!cumulativeAnalysisResult || !activeTest || !cumulativeChartData || isExporting) return;
    setIsExporting(true);
    setSuccessMessage("Generating Excel report...");
    setErrorMessage(null);
    try {
      await exportToExcel(
          'cumulative-chart',
          activeTest,
          cumulativeChartData,
          cumulativeAnalysisResult.calculatedStats
      );
      setSuccessMessage("Excel report generated successfully!");
    } catch (error: any) {
      setErrorMessage(`Failed to generate Excel: ${error.message}`);
      setSuccessMessage(null);
    } finally {
      setIsExporting(false);
      setTimeout(() => {
          setSuccessMessage(null);
          setErrorMessage(null);
      }, 4000);
    }
  };

  const handleControlFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !activeTest) {
        return;
    }

    setErrorMessage(null);
    setSuccessMessage("Processing control file...");

    try {
        const text = await file.text();
        const controlValues = parseMultiLineNumericString(text);

        if (controlValues.length === 0) {
            throw new Error("No numeric data found in the control file.");
        }

        const targetMean = parseFloat(activeTest.targetMeanStr);
        if (isNaN(targetMean)) {
            throw new Error("A valid Target Mean must be set for the active test before loading control data.");
        }

        const controlStats = calculateStatsForSeries(controlValues, targetMean);
        const controlViolations = evaluateWestgardRules(controlValues, controlStats.observedMean, controlStats.observedSD);

        const controlResult: AnalysisResult = {
            timestamp: new Date().toISOString(),
            calculatedStats: controlStats,
            westgardViolations: controlViolations,
            sigmaMetric: null, 
        };
        
        setControlAnalysisResult(controlResult);
        setSuccessMessage("Control data loaded successfully. See comparison below.");
    } catch (error: any) {
        setErrorMessage(`Error processing control file: ${error.message}`);
        setControlAnalysisResult(null);
    } finally {
        setTimeout(() => setSuccessMessage(null), 3000);
        event.target.value = '';
    }
};

  const renderAnalysisSection = () => {
    if (isAnalyzing) {
      return <LoadingSpinner message="Performing cumulative analysis..." />;
    }
    if (!cumulativeAnalysisResult) {
      return <p className="text-center text-gray-500 italic mt-8">Enter data and click 'Update &amp; Analyze' to view cumulative results.</p>;
    }
    
    const { calculatedStats, westgardViolations, sigmaMetric } = cumulativeAnalysisResult;
    const canExport = !!cumulativeAnalysisResult && !isExporting;
    
    return (
      <div className="mt-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold text-gray-100 printable-hidden">Cumulative Analysis Report</h2>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => document.getElementById('control-file-input')?.click()}
                        className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all text-sm"
                    >
                        Compare vs Control
                    </button>
                    <input type="file" id="control-file-input" className="hidden" onChange={handleControlFileUpload} accept=".txt,text/plain" />

                    <button
                        onClick={handleExportPdf}
                        disabled={!canExport}
                        className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed text-sm"
                    >
                        {isExporting ? 'Exporting...' : 'Export to PDF'}
                    </button>
                    <button
                        onClick={handleExportExcel}
                        disabled={!canExport}
                        className="px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed text-sm"
                    >
                        {isExporting ? 'Exporting...' : 'Export to Excel'}
                    </button>
                </div>
            </div>

            <div id="analysis-section-content" className="space-y-8 p-4 bg-gray-900">
                <CumulativeStatsDisplay stats={calculatedStats} />
                
                {controlAnalysisResult && activeTest && (
                    <ComparisonDisplay 
                        userResult={cumulativeAnalysisResult}
                        controlResult={controlAnalysisResult}
                        testName={activeTest.name}
                        targetMean={parseFloat(activeTest.targetMeanStr)}
                        onClear={() => setControlAnalysisResult(null)}
                    />
                )}
                
                <div className="data-graph-container">
                    <DataGraph 
                        id="cumulative-chart"
                        data={cumulativeChartData}
                        title={`${activeTest?.name} QC Chart - Cumulative View`}
                        targetMean={activeTest ? parseFloat(activeTest.targetMeanStr) : null}
                        observedMean={calculatedStats.observedMean}
                        observedSD={calculatedStats.observedSD}
                        westgardViolations={westgardViolations}
                    />
                </div>

                <WestgardResultsDisplay violations={westgardViolations} />
                <SigmaMetricsDisplay 
                    sigmaMetrics={sigmaMetric} 
                    warningThreshold={activeTest ? parseFloat(activeTest.sigmaWarningThresholdStr) : null}
                    criticalThreshold={activeTest ? parseFloat(activeTest.sigmaCriticalThresholdStr) : null}
                />
                <ReferenceDataDisplay testData={activeTest || null} />
                <ComplianceDisplay calculatedStats={calculatedStats} testData={activeTest || null} />
            </div>
      </div>
    );
  };

  const renderDashboard = () => (
     <div className="min-h-screen bg-gray-900 text-gray-200">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="text-center mb-10 relative">
          <div className="absolute top-0 right-0">
            {appData && (
                <UserProfile 
                user={user!} 
                onLogout={handleLogout} 
                onGenerateCategoryPdf={handleGenerateCategoryPdf}
                categories={appData.categories.map(c => c.name)}
                />
            )}
          </div>
          <p className="text-xl font-semibold text-teal-200 mb-2">
            Mohammad Karimi, MSc in Medical Immunology
          </p>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 tracking-tight">
            Comprehensive Lab QC Analyzer
          </h1>
          <p className="mt-2 text-lg text-gray-400">Cumulative Quality Control Data Analysis</p>
        </header>

        {!appData ? (
          <AlertMessage type="error" message="Could not load application data. Please refresh the page." />
        ) : (
          <>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <CategoryTabs 
                categories={appData.categories.map(c => c.name)} 
                activeCategory={activeCategoryName} 
                onSelectCategory={(name) => {
                  setActiveCategoryName(name);
                  const newCategory = appData.categories.find(c => c.name === name);
                  setActiveTestId(newCategory?.tests[0]?.id || null);
                }}
              />
              {activeCategory && (
                <TestSelector 
                  tests={activeCategory.tests} 
                  activeTestId={activeTestId} 
                  onSelectTest={setActiveTestId}
                />
              )}
            </div>

            {successMessage && <div className="my-4"><AlertMessage type="success" message={successMessage} onClose={() => setSuccessMessage(null)} /></div>}
            {errorMessage && <div className="my-4"><AlertMessage type="error" message={errorMessage} onClose={() => setErrorMessage(null)} /></div>}

            {activeTest ? (
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Input Parameters & Data Entry */}
                <div className="lg:col-span-1 space-y-8">
                  <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                      <h2 className="text-2xl font-bold text-gray-100 mb-4 border-b border-gray-600 pb-2">Test Parameters</h2>
                      <div className="space-y-4">
                        {(['targetMeanStr', 'refBioCVStr', 'refBioBiasStr', 'refBioTEaStr', 'cliaTEaStr', 'sigmaWarningThresholdStr', 'sigmaCriticalThresholdStr'] as const).map(key => (
                          <div key={key}>
                            <label htmlFor={key} className="block text-sm font-medium text-gray-300">
                                {key.replace('Str', '').replace(/([A-Z])/g, ' $1').replace('ref Bio', 'Ref. Bio.').trim()}:
                            </label>
                            <input
                                id={key}
                                type="text"
                                value={activeTest[key]}
                                onChange={(e) => handleTestParamsChange(activeTest.id, { [key]: e.target.value })}
                                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder={key.includes('Threshold') ? 'e.g., 3' : 'e.g., 100.5'}
                            />
                          </div>
                        ))}
                      </div>
                      <button onClick={handleSaveParameters} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                        Save Parameters
                      </button>
                  </div>

                   <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-100 mb-4 border-b border-gray-600 pb-2">Monthly Data Entry</h2>
                        <div className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <label htmlFor="month-select" className="block text-sm font-medium text-gray-300">Month</label>
                                <select id="month-select" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    {MONTH_NAMES.map((name, index) => <option key={name} value={index}>{name}</option>)}
                                </select>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="year-select" className="block text-sm font-medium text-gray-300">Year</label>
                                <select id="year-select" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    {years.map(year => <option key={year} value={year}>{year}</option>)}
                                </select>
                            </div>
                        </div>

                        <MonthlyDataGrid 
                           dayInputs={dayInputs} 
                           onDayInputChange={handleDayInputChange} 
                           selectedMonth={selectedMonth}
                           selectedYear={selectedYear}
                        />

                        <button
                          onClick={handleUpdateAndAnalyze}
                          disabled={isAnalyzing}
                          className="mt-6 w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                          {isAnalyzing ? 'Analyzing...' : 'Update & Analyze'}
                        </button>
                    </div>

                </div>

                {/* Right Column: Analysis Results */}
                <div className="lg:col-span-2">
                    {renderAnalysisSection()}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Please select a test category and a test to begin.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );

  if (isAuthLoading || isLoading) {
    return (
        <div className="min-h-screen bg-gray-900 flex justify-center items-center">
            <LoadingSpinner message={isAuthLoading ? "Initializing..." : `Loading data for ${user?.email}...`} />
        </div>
    );
  }

  if (!user) {
      return <Auth onLogin={handleLogin} />;
  }

  return (
    <>
        {renderDashboard()}
<<<<<<< HEAD
        {categoryReportData && <CategoryReport data={categoryReportData} onClose={() => setCategoryReportData(null)} />}
=======
        {pdfGenerationData && <PdfGenerator data={pdfGenerationData} onComplete={() => setPdfGenerationData(null)} />}
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
    </>
  );
};

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
