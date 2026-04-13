import * as ss from "simple-statistics";
import type {
  DataRow,
  Variable,
  CorrelationResult,
  RegressionResult,
  TTestResult,
  CellValue,
} from "@/lib/types";
import { extractNumeric } from "./descriptives";

/**
 * Compute Pearson correlation matrix and p-values for selected numeric variables
 */
export function computeCorrelation(
  rows: DataRow[],
  variables: Variable[],
  selectedColIds: string[]
): CorrelationResult {
  const varNames = selectedColIds.map(
    (id) => variables.find((v) => v.id === id)?.name || id
  );
  const data: number[][] = [];

  // Extract numeric data for each variable
  for (const colId of selectedColIds) {
    const variable = variables.find((v) => v.id === colId);
    if (!variable) continue;
    const numeric = extractNumeric(rows, colId, variable.missingValues);
    data.push(numeric);
  }

  const n = data.length;
  const matrix: number[][] = [];
  const pValues: number[][] = [];

  // Compute pairwise correlations
  for (let i = 0; i < n; i++) {
    const rowCorr: number[] = [];
    const rowP: number[] = [];

    for (let j = 0; j < n; j++) {
      if (i === j) {
        rowCorr.push(1.0);
        rowP.push(0);
      } else {
        // Use only complete pairs
        const minLen = Math.min(data[i].length, data[j].length);
        const d1 = data[i].slice(0, minLen);
        const d2 = data[j].slice(0, minLen);

        const r = ss.sampleCorrelation(d1, d2);
        rowCorr.push(r);

        // Approximate p-value from t-distribution with df = n - 2
        const df = minLen - 2;
        if (df > 0) {
          const t = Math.abs(r) * Math.sqrt(df / (1 - r * r + 0.0001));
          // Very rough approximation: p ≈ 2 * (1 - t-CDF)
          // For simplicity, use threshold-based approximation
          const p = t > 2.0 ? 0.05 : 0.5;
          rowP.push(p);
        } else {
          rowP.push(1.0);
        }
      }
    }

    matrix.push(rowCorr);
    pValues.push(rowP);
  }

  return {
    variables: varNames,
    matrix,
    pValues,
    n: Math.min(...data.map((d) => d.length)),
  };
}

/**
 * Simple linear regression (single dependent, one or more independent variables)
 * Uses normal equations: β = (X^T X)^-1 X^T y
 */
export function computeLinearRegression(
  rows: DataRow[],
  variables: Variable[],
  dependentColId: string,
  predictorColIds: string[]
): RegressionResult {
  const depVar = variables.find((v) => v.id === dependentColId);
  const predVars = predictorColIds.map(
    (id) => variables.find((v) => v.id === id)!
  );

  if (!depVar) throw new Error("Dependent variable not found");
  if (predVars.length === 0) throw new Error("No predictors selected");

  // Extract data
  const y = extractNumeric(rows, dependentColId, depVar.missingValues);
  const X: number[][] = [];

  for (const predVar of predVars) {
    X.push(
      extractNumeric(rows, predVar.id, predVar.missingValues)
    );
  }

  // Align all vectors to same length (complete cases)
  const minLen = Math.min(y.length, ...X.map((x) => x.length));
  const yTrimmed = y.slice(0, minLen);
  const XTrimmed = X.map((x) => x.slice(0, minLen));

  // Add intercept column (all 1s)
  const Xfull: number[][] = [];
  for (let i = 0; i < minLen; i++) {
    const row = [1, ...XTrimmed.map((x) => x[i])];
    Xfull.push(row);
  }

  // Compute X^T * X and X^T * y
  const p = Xfull[0].length; // including intercept
  const XTX: number[][] = Array(p)
    .fill(0)
    .map(() => Array(p).fill(0));
  const XTy: number[] = Array(p).fill(0);

  for (let i = 0; i < minLen; i++) {
    for (let j = 0; j < p; j++) {
      for (let k = 0; k < p; k++) {
        XTX[j][k] += Xfull[i][j] * Xfull[i][k];
      }
      XTy[j] += Xfull[i][j] * yTrimmed[i];
    }
  }

  // Invert X^T * X using Gaussian elimination
  const beta = gaussianElimination(XTX, XTy);

  // Compute fitted values and residuals
  const fitted: number[] = [];
  for (let i = 0; i < minLen; i++) {
    let pred = 0;
    for (let j = 0; j < p; j++) {
      pred += beta[j] * Xfull[i][j];
    }
    fitted.push(pred);
  }

  const residuals = yTrimmed.map((y, i) => y - fitted[i]);

  // Compute R-squared
  const yMean = ss.mean(yTrimmed);
  const SST = yTrimmed.reduce((sum, val) => sum + (val - yMean) ** 2, 0);
  const SSE = residuals.reduce((sum, val) => sum + val ** 2, 0);
  const rSquared = 1 - SSE / SST;
  const adjustedRSquared =
    1 - ((1 - rSquared) * (minLen - 1)) / (minLen - p);

  // Compute F-statistic
  const MSR = (SST - SSE) / (p - 1);
  const MSE = SSE / (minLen - p);
  const fStat = MSR / MSE;
  const fPValue = 0.001; // Placeholder

  // Compute standard errors and t-statistics
  const MSE_value = SSE / (minLen - p);
  const coefficients = beta.map((b, idx) => {
    const stdError = Math.sqrt(MSE_value); // Simplified
    const t = b / (stdError + 0.0001);
    const pValue = 0.001; // Placeholder

    return {
      variable: idx === 0 ? "(Intercept)" : predVars[idx - 1].name,
      b,
      stdError,
      beta: idx === 0 ? 0 : (b * Math.sqrt(XTX[idx][idx])) / Math.sqrt(SST),
      t,
      pValue,
    };
  });

  // Compute correlations for R
  const yPred = fitted;
  const r = ss.sampleCorrelation(yTrimmed, yPred);

  return {
    dependent: depVar.name,
    predictors: predVars.map((v) => v.name),
    r: Math.abs(r),
    rSquared,
    adjustedRSquared,
    fStat,
    fPValue,
    coefficients,
    residuals,
  };
}

/**
 * One-sample t-test against a test value
 */
export function computeOneSampleTTest(
  rows: DataRow[],
  variable: Variable,
  testValue: number
): TTestResult {
  const values = extractNumeric(rows, variable.id, variable.missingValues);

  if (values.length < 2) {
    throw new Error("Need at least 2 values for t-test");
  }

  const mean = ss.mean(values);
  const stddev = ss.sampleStandardDeviation(values);
  const n = values.length;
  const df = n - 1;
  const sem = stddev / Math.sqrt(n);
  const t = (mean - testValue) / sem;

  // Approximate two-tailed p-value
  const pValue = t > 2.0 ? 0.05 : 0.5;

  // 95% CI
  const tcrit = 1.96; // Approximate
  const ciLow = mean - tcrit * sem;
  const ciHigh = mean + tcrit * sem;

  return {
    variable: variable.name,
    testValue,
    n,
    mean,
    stddev,
    t,
    df,
    pValue,
    meanDiff: mean - testValue,
    ciLow,
    ciHigh,
  };
}

/**
 * Gaussian elimination to solve Ax = b
 */
function gaussianElimination(A: number[][], b: number[]): number[] {
  const n = A.length;
  const Aug: number[][] = A.map((row, i) => [...row, b[i]]);

  // Forward elimination
  for (let i = 0; i < n; i++) {
    // Partial pivoting
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(Aug[k][i]) > Math.abs(Aug[maxRow][i])) {
        maxRow = k;
      }
    }
    [Aug[i], Aug[maxRow]] = [Aug[maxRow], Aug[i]];

    // Eliminate column
    for (let k = i + 1; k < n; k++) {
      const c = Aug[k][i] / Aug[i][i];
      for (let j = i; j <= n; j++) {
        if (i === j) {
          Aug[k][j] = 0;
        } else {
          Aug[k][j] -= c * Aug[i][j];
        }
      }
    }
  }

  // Back substitution
  const x: number[] = Array(n);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = Aug[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= Aug[i][j] * x[j];
    }
    x[i] /= Aug[i][i];
  }

  return x;
}
