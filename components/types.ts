
<<<<<<< HEAD

=======
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
export const MONTH_NAMES = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

export interface TestInfo {
  id: string;
  name: string;
}

export const BiochemistryTestNames = {
  categoryName: "Biochemistry",
  tests: [
    { id: "glu", name: "Glucose" }, { id: "urea", name: "Urea" }, { id: "creat", name: "Creatinine" },
    { id: "ua", name: "Uric Acid" }, { id: "chol", name: "Cholesterol" }, { id: "trig", name: "Triglycerides" },
    { id: "hdl", name: "HDL" }, { id: "ldl", name: "LDL" }, { id: "tp", name: "Total Protein" },
    { id: "alb", name: "Albumin" }, { id: "ast", name: "AST" }, { id: "alt", name: "ALT" },
    { id: "alp", name: "ALP" }, { id: "bili", name: "Bilirubin" },
    { id: "fe", name: "Iron (Fe)" }, { id: "ca", name: "Calcium (Ca)" }, { id: "p", name: "Phosphorus (P)" },
    { id: "ldh", name: "LDH (Lactate Dehydrogenase)" }, { id: "zn", name: "Zinc (Zn)" }
  ]
};

export const HematologyTestNames = {
  categoryName: "Hematology",
  tests: [
    { id: "wbc", name: "WBC" }, { id: "rbc", name: "RBC" }, { id: "hgb", name: "Hemoglobin" },
    { id: "hct", name: "Hematocrit" }, { id: "mcv", name: "MCV" }, { id: "mch", name: "MCH" },
    { id: "plt", name: "Platelets" }
  ]
};

// Represents the result of a single analysis run (could be for a month).
export interface AnalysisResult {
  timestamp: string;
  calculatedStats: CalculatedStats;
  westgardViolations: WestgardRuleViolation[];
  sigmaMetric: SigmaMetricResult | null;
}

// Stored data for a given month
export interface MonthlyAnalysis {
  values: string[]; // Array of daily values for the month
  result: AnalysisResult | null; // This result is now deprecated in favor of cumulative analysis
}

// For individual test data storage
export interface TestData {
  id: string;
  name: string;
  targetMeanStr: string;
  refBioCVStr: string;      // Biological Variation CV (%)
  refBioBiasStr: string;    // Biological Variation Bias (%)
  refBioTEaStr: string;     // Biological Variation Total Allowable Error (%)
  cliaTEaStr: string;       // CLIA Total Allowable Error (%)
  sigmaWarningThresholdStr: string; // e.g., "4"
  sigmaCriticalThresholdStr: string; // e.g., "3"
  targetCvPercentStr: string; // Target CV% for the test
  monthlyAnalyses: {
    [yearMonthKey: string]: MonthlyAnalysis; // e.g., "2024-0" for Jan 2024
  };
}

// For categories of tests
export interface TestCategoryData {
  name: string;
  tests: TestData[];
}

// Overall application data structure for local storage
export interface AppData {
  year: number;
  categories: TestCategoryData[];
}

export interface SigmaMetricResult {
  sigmaValue: number | null;
  assessment: string; // e.g., "World Class", "Poor", "N/A"
  details: string; // Any calculation notes or errors
}

// For calculated statistics from a series of data
export interface CalculatedStats {
  count: number;
  observedMean: number | null;
  observedSD: number | null;
  observedCV: number | null;
  bias: number | null; 
  biasPercent: number | null;
<<<<<<< HEAD
  totalErrorPercent: number | null;
=======
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
}

// For Westgard rule violations
export interface WestgardRuleViolation {
  rule: string; // e.g., "1_3s", "2_2s"
  message: string;
  dataPointIndices?: number[]; // Indices of data points within the analyzed series
  dayNumbers?: number[]; // The day of the month (1-31) corresponding to the violation - NOW LARGELY DEPRECATED
}

// Data point for the cumulative graph
export interface CumulativeDataPoint {
  date: Date;
  value: number;
  isCurrentMonth: boolean;
}

<<<<<<< HEAD
// --- NEW MULTI-PAGE PDF REPORT TYPES ---

export interface TestDataForReport {
  testData: TestData;
  stats: CalculatedStats;
  chartData: CumulativeDataPoint[];
}

export interface CategoryMultiPageReportData {
  categoryName: string;
  tests: TestDataForReport[];
}
=======
// Data for the comprehensive category report
export interface CategoryTestAnalysis {
  test: TestData;
  analysis: AnalysisResult;
  chartData: CumulativeDataPoint[];
}

export interface CategoryReportData {
  categoryName: string;
  testAnalyses: CategoryTestAnalysis[];
}
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
