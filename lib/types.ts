/**
 * Core types for SPSS-like statistical analysis app
 */

// ============================================
// Cell and Row Data
// ============================================

export type CellValue = string | number | null;

export interface DataRow {
  _id: string; // stable internal row key (nanoid)
  [colId: string]: CellValue | string;
}

// ============================================
// Variable (Column) Metadata
// ============================================

export type VariableType = "numeric" | "string" | "date";
export type MeasureLevel = "nominal" | "ordinal" | "scale";

export interface Variable {
  id: string; // stable column ID
  name: string; // e.g., "age", "income"
  label: string; // display label
  type: VariableType;
  width: number; // column display width in pixels
  decimals: number; // decimal places for display
  missingValues: CellValue[]; // user-defined missing value codes
  defaultValue: CellValue;
  measureLevel: MeasureLevel;
}

// ============================================
// Selection State
// ============================================

export interface CellPosition {
  rowIndex: number;
  colId: string;
}

// ============================================
// Analysis Results
// ============================================

export type OutputBlockType =
  | "descriptives"
  | "frequencies"
  | "correlation"
  | "regression"
  | "t-test";

export interface OutputBlock {
  id: string;
  type: OutputBlockType;
  title: string;
  timestamp: number;
  data:
    | DescriptivesResult
    | FrequenciesResult
    | CorrelationResult
    | RegressionResult
    | TTestResult;
  charts?: ChartSpec[];
}

// ============================================
// Descriptive Statistics Result
// ============================================

export interface DescriptivesStat {
  variable: string;
  n: number;
  mean: number;
  median: number;
  mode: number | number[];
  stddev: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  skewness: number;
  kurtosis: number;
}

export interface DescriptivesResult {
  variables: string[];
  stats: DescriptivesStat[];
}

// ============================================
// Frequency Table Result
// ============================================

export interface FrequencyEntry {
  value: CellValue;
  count: number;
  percent: number;
  validPercent: number;
  cumulativePercent: number;
}

export interface FrequenciesResult {
  variable: string;
  n: number;
  missing: number;
  table: FrequencyEntry[];
}

// ============================================
// Correlation Result
// ============================================

export interface CorrelationResult {
  variables: string[];
  matrix: number[][]; // [i][j] = r between variables[i] and variables[j]
  pValues: number[][];
  n: number;
}

// ============================================
// Regression Result
// ============================================

export interface RegressionCoefficient {
  variable: string;
  b: number;
  stdError: number;
  beta: number;
  t: number;
  pValue: number;
}

export interface RegressionResult {
  dependent: string;
  predictors: string[];
  r: number;
  rSquared: number;
  adjustedRSquared: number;
  fStat: number;
  fPValue: number;
  coefficients: RegressionCoefficient[];
  residuals: number[];
}

// ============================================
// T-Test Result
// ============================================

export interface TTestResult {
  variable: string;
  testValue: number;
  n: number;
  mean: number;
  stddev: number;
  t: number;
  df: number;
  pValue: number;
  meanDiff: number;
  ciLow: number;
  ciHigh: number;
}

// ============================================
// Chart Specifications
// ============================================

export interface ChartSpec {
  type: "bar" | "histogram" | "scatter";
  title: string;
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  xLabel?: string;
  yLabel?: string;
}

// ============================================
// UI State
// ============================================

export type DialogType =
  | "descriptives"
  | "frequencies"
  | "correlation"
  | "regression"
  | "t-test"
  | null;

export type EditorTab = "data" | "variable";
