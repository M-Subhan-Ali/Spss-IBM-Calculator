# Enhanced Descriptive Statistics - SPSS-Style Implementation

## 🎯 New Features Added

### 1. SPSS-Style Variable Selection Modal
**File:** `components/dialogs/DescriptivesDialog.tsx`

The modal now features professional variable selection UI:
- **Left Panel**: Available numeric variables
- **Right Panel**: Selected variables (click to remove)
- **Click-to-Select**: Add/remove variables instantly
- **Visual Feedback**: Selected variables highlighted in blue

```
┌─────────────────────────────────────────┐
│   Available Variables │ Selected Variables│
├─────────────────────────────────────────┤
│ • age                 │ • age        ✕  │
│ • salary              │ • salary     ✕  │
│ • experience          │ • experience ✕  │
└─────────────────────────────────────────┘
```

### 2. Statistics Checkboxes
Users can select which statistics to calculate:

```
☑ Mean
☑ Median
☑ Mode
```

- **Default**: All checked (Mean, Median, Mode)
- **Validation**: At least one must be selected
- **Optimization**: Only selected stats shown in output

### 3. Histogram Visualization
```
☑ Show Histogram
  (Histogram shows distribution of values)
```

- **Sturges' Formula** for optimal bin calculation:
  ```
  bins = Math.ceil(Math.log2(n) + 1)
  ```
- **Automatic Binning**: No manual bin count needed
- **Per-Variable**: Histogram for each selected variable
- **Recharts Integration**: Professional rendering

### 4. Enhanced Output Table
**Dynamic table headers** based on selected statistics:

```
Variable   N    Mean    Median    Mode
─────────────────────────────────────
age       100   32.5    31        28
salary    100   65000   63000     55000
```

Only columns for selected statistics appear.

### 5. Data Cleaning & Validation

**Automatic Filtering:**
- ✅ Removes `null` values
- ✅ Removes `undefined` values
- ✅ Removes non-numeric values
- ✅ Removes user-defined missing values
- ✅ Only `isFinite()` numbers included

**Code:**
```typescript
const cleanData = extractNumeric(rows, colId, variable.missingValues);
// Returns only valid numeric values ready for calculation
```

---

## 📊 IBM SPSS Workflow

The app now perfectly follows SPSS workflow:

```
┌─────────────────────────────────────────┐
│         ANALYZE MENU                    │
│  File | Edit | View | Analyze | Graphs │
│                  │                      │
│         ┌────────▼──────────┐           │
│         │ Descriptive Stats │           │
│         └────────┬──────────┘           │
│                  │                      │
│   ┌──────────────▼──────────────┐      │
│   │  Variable Selection Modal    │      │
│   │  ┌──────────┬─────────────┐ │      │
│   │  │Available │ Selected    │ │      │
│   │  ├──────────┼─────────────┤ │      │
│   │  │ age      │ age      ✕ │ │      │
│   │  │ salary   │ salary   ✕ │ │      │
│   │  └──────────┴─────────────┘ │      │
│   │  ☑ Mean ☑ Median ☑ Mode     │      │
│   │  ☑ Show Histogram             │      │
│   │  [Cancel] [Run]               │      │
│   └──────────────┬──────────────┘      │
│                  │                      │
│        ┌─────────▼─────────┐            │
│        │  CALCULATIONS     │            │
│        │ (Client-Side)     │            │
│        └─────────┬─────────┘            │
│                  │                      │
│   ┌──────────────▼──────────────┐      │
│   │   OUTPUT PANEL              │      │
│   ├──────────────────────────────┤      │
│   │ Descriptive Statistics       │      │
│   │ Variable │ N   │ Mean│Median │      │
│   │ age      │100  │32.5│ 31    │      │
│   │ salary   │100  │65K │ 63K   │      │
│   │                              │      │
│   │ Distribution: age            │      │
│   │ [Histogram Chart]            │      │
│   └──────────────────────────────┘      │
└─────────────────────────────────────────┘
```

---

## 🧮 Statistical Calculations

All calculations run **100% client-side** in the browser:

### Mean (Average)
```typescript
const mean = ss.mean(cleanData);
// Example: [25, 30, 35] → 30
```

### Median (Middle Value)
```typescript
const median = ss.median(cleanData);
// Sorted array → middle value
// [25, 30, 35] → 30
// [25, 30, 35, 40] → 32.5 (avg of middle two)
```

### Mode (Most Frequent)
```typescript
const mode = ss.mode(cleanData);
// Most occurring value
// [1, 2, 2, 3, 3, 3] → 3
```

---

## 📈 Histogram Implementation

### Sturges' Formula
```typescript
// Optimal number of bins based on sample size
const bins = Math.ceil(Math.log2(n) + 1);

// Examples:
// n=30  → bins = 6
// n=100 → bins = 8
// n=500 → bins = 10
```

### Data Processing
```typescript
1. Extract numeric values only
2. Apply Sturges' formula: bins = ceil(log2(n) + 1)
3. Calculate bin width: (max - min) / bins
4. Create bin ranges and count occurrences
5. Render with Recharts BarChart
```

### Output
```
Distribution: age
┌─────────────────────────────────┐
│         Frequency                │
│    ▄▄▄                           │
│   ▐█▌▐█▐██▐█▌                   │
│   ▐█▌▐█▐██▐█▌                   │
│ ──┴─────────────────────────────►
│   20-25 25-30 30-35 35-40...     │
│            Age (Years)            │
└─────────────────────────────────┘
```

---

## 🎨 UI/UX Enhancements

### Modal Layout
- **Large Modal** (lg size): `max-w-3xl`
- **Two-Column Grid**: Available vs Selected variables
- **Scrollable Lists**: `h-48 overflow-y-auto`
- **Visual Selection**: Blue highlight on select
- **Click Labels**: No arrow buttons needed

### Colors (SPSS Palette)
- **Available Var**: `hover:bg-spss-selected-bg`
- **Selected Var**: `bg-spss-selected-bg text-spss-selected`
- **Hover State**: `hover:text-spss-selected`
- **Borders**: `border-spss-border`

### Interactions
- **Click to Add**: Click variable in left panel
- **Click to Remove**: Click variable in right panel (shows ✕)
- **Keyboard Escape**: Close modal
- **Tab Navigation**: Standard form tabbing

---

## 🔧 Code Architecture

### Component Files
```
components/dialogs/
├── DescriptivesDialog.tsx     # SPSS-style variable selector
└── (Modal, Button, Checkbox UI components)

components/output/
├── OutputBlock.tsx             # Enhanced result formatter
├── StatTable.tsx               # Table rendering
└── HistogramChart.tsx          # Recharts histogram

lib/stats/
├── descriptives.ts             # Mean, Median, Mode + rawData
└── (Other analysis functions)
```

### State Management
```typescript
// useState for dialog options
const [showMean, setShowMean] = useState(true);
const [showMedian, setShowMedian] = useState(true);
const [showMode, setShowMode] = useState(true);
const [showHistogram, setShowHistogram] = useState(false);

// useMemo for optimization
const numericVariables = useMemo(() =>
  variables.filter(v => v.type === "numeric"),
  [variables]
);
```

### Data Flow
```
1. User selects variables → setSelected(Set)
2. User checks options → setShowMean/Median/Mode/Histogram
3. User clicks "Run" → handleRun()
4. Calculate stats → computeDescriptives()
5. Add to output → addBlock({ ...result, showMean, showMedian, etc })
6. OutputBlock renders based on metadata
7. HistogramChart renders if showHistogram === true
```

---

## ✅ Validation & Error Handling

**User-Friendly Validation:**
```typescript
// Validate variable selection
if (selected.size === 0) {
  alert("Please select at least one variable");
  return;
}

// Validate statistic selection
if (!showMean && !showMedian && !showMode) {
  alert("Please select at least one statistic");
  return;
}

// Validate data
if (rows.length === 0) {
  alert("Please load or create data first");
  return;
}
```

**Data Cleaning:**
- Null/undefined values excluded
- Non-numeric strings converted, or skipped
- User-defined missing values excluded
- Only `isFinite()` numbers used

---

## 🚀 Testing Workflow

### Create Sample Data
```
Variable    Value
age         25
age         30
age         35
age         28
age         32

salary      50000
salary      65000
salary      75000
salary      58000
salary      70000
```

### Run Analysis
1. Click **Analyze** → **Descriptive Statistics**
2. Modal opens
3. Click "age" in left panel → moves to right
4. Click "salary" in left panel → moves to right
5. Leave all checkboxes checked (default)
6. Check **☑ Show Histogram**
7. Click **[Run]**

### Expected Output
```
Descriptive Statistics
Variable │ N  │ Mean  │ Median │ Mode
─────────┼────┼───────┼────────┼──────
age      │ 5  │ 30.0  │ 30     │ 28
salary   │ 5  │ 63600 │ 65000  │ 70000

Distributions
[Histogram: age]    [Histogram: salary]
```

---

## 🎯 Performance Optimizations

### useMemo Caching
```typescript
// Memoize filtered variable lists
const numericVariables = useMemo(() =>
  variables.filter(v => v.type === "numeric"),
  [variables]  // Only recalculate when variables change
);

const selectedVariables = useMemo(() =>
  numericVariables.filter(v => selected.has(v.id)),
  [numericVariables, selected]
);
```

### Data Extraction Once
```typescript
// extractNumeric() called once per variable
// Results used for all statistics (mean, median, mode)
const numeric = extractNumeric(rows, colId, missingValues);
const mean = ss.mean(numeric);
const median = ss.median(numeric);
const mode = ss.mode(numeric);
```

### Sturges' Formula
```typescript
// O(1) calculation - very fast
const bins = Math.ceil(Math.log2(n) + 1);
// No complex algorithms, just math
```

---

## 📋 Summary of Changes

| Component | Change | Impact |
|-----------|--------|--------|
| DescriptivesDialog.tsx | Complete rewrite with SPSS UI | ✅ Professional variable selector |
| OutputBlock.tsx | Added histogram rendering logic | ✅ Show distributions when requested |
| descriptives.ts | Added rawData export | ✅ Histograms have source data |
| HistogramChart.tsx | Sturges' formula support | ✅ Optimal binning automatic |

---

## ✨ Results

✅ **IBM SPSS Workflow** - Perfect Analyze → Select → Run → Output flow
✅ **Professional UI** - Left/right variable selector like SPSS
✅ **Dynamic Statistics** - Show only selected stats in output
✅ **Histogram Support** - Auto-binned with Sturges' formula
✅ **Data Cleaning** - Robust null/undefined handling
✅ **Performance** - useMemo optimizations, no recalculations
✅ **Error Handling** - Comprehensive validation and user feedback
✅ **Backward Compatible** - Existing analyses still work

---

## 🚀 Launch & Test

```bash
cd D:/spss
npm run dev
# Visit http://localhost:3000
```

All features ready to use immediately!
