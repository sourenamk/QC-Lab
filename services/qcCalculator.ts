

<<<<<<< HEAD
=======

>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
import { CalculatedStats } from '../components/types';

// Helper function to calculate Mean
export const calculateMean = (values: number[]): number | null => {
  if (!values || values.length === 0) return null;
  const numericValues = values.filter(v => !isNaN(v));
  if (numericValues.length === 0) return null;
  return numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
};

// Helper function to calculate Standard Deviation
export const calculateSD = (values: number[], mean?: number): number | null => {
  if (!values || values.length < 2) return null; // SD is not meaningful for N < 2
  const numericValues = values.filter(v => !isNaN(v));
  if (numericValues.length < 2) return null;

  const m = mean ?? calculateMean(numericValues);
  if (m === null) return null;
  const variance = numericValues.reduce((sumSqDiff, val) => sumSqDiff + Math.pow(val - m, 2), 0) / (numericValues.length - 1);
  return Math.sqrt(variance);
};

const calculateCV = (sd: number | null, mean: number | null): number | null => {
  if (sd === null || mean === null || mean === 0) return null;
  return Math.abs((sd / mean) * 100); // CV is usually positive
};

<<<<<<< HEAD
export const calculateZScore = (value: number, mean: number, sd: number): number | null => {
  if (sd === 0 || sd === null || isNaN(sd)) return null; // Avoid division by zero or invalid SD
  return (value - mean) / sd;
};

/**
 * Calculates Total Error as a percentage.
 * TE% = |Bias%| + (Z * CV%)
 * @param biasPercent Bias as a percentage.
 * @param cvPercent Coefficient of Variation as a percentage.
 * @param zScore The Z-score to use for the confidence interval (default is 1.65 for 95% confidence).
 * @returns Total Error as a percentage, or null if inputs are invalid.
 */
export const calculateTotalError = (biasPercent: number | null, cvPercent: number | null, zScore: number = 1.65): number | null => {
    if (biasPercent === null || cvPercent === null) {
        return null;
    }
    return Math.abs(biasPercent) + (zScore * cvPercent);
};


=======
export const calculateZScore = (value: number, targetMean: number, calculatedSD: number): number | null => {
  if (calculatedSD === 0 || calculatedSD === null || isNaN(calculatedSD)) return null; // Avoid division by zero or invalid SD
  return (value - targetMean) / calculatedSD;
};

>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
export const calculateStatsForSeries = (
  observedValues: number[], // Assumes already filtered for valid numbers
  targetMeanVal: number
): CalculatedStats => {
  const count = observedValues.length;
  const observedMean = calculateMean(observedValues);
  const observedSD = calculateSD(observedValues, observedMean ?? undefined);
  const observedCV = calculateCV(observedSD, observedMean);

  let bias: number | null = null;
  let biasPercent: number | null = null;

  if (observedMean !== null && !isNaN(targetMeanVal)) {
    bias = observedMean - targetMeanVal;
    if (targetMeanVal !== 0) {
      biasPercent = (bias / targetMeanVal) * 100;
    }
  }
<<<<<<< HEAD
  
  const totalErrorPercent = calculateTotalError(biasPercent, observedCV);
=======
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684

  return {
    count,
    observedMean,
    observedSD,
    observedCV,
    bias,
    biasPercent,
<<<<<<< HEAD
    totalErrorPercent
  };
};
=======
  };
};
>>>>>>> 6a843952fbc9d61b359a862d3279608ef2e5b684
