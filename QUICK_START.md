# SPSS Web App - Quick Start Guide

## Launch the App

```bash
cd D:/spss
npm run dev
```

Visit: **http://localhost:3000**

---

## 30-Second Tutorial

### 1️⃣ Create Sample Data
- Click **"Add Row"** (bottom left) → Creates first row
- Click **"Add Column"** (bottom left) → Creates first column
- Click cells to edit values
  - Type numbers/text
  - Press **Enter** to save
  - Press **Escape** to cancel

### 2️⃣ Configure Variables
- Click **"Variable View"** tab (bottom)
- Edit column metadata:
  - **Name**: age, income, score
  - **Type**: numeric, string, date
  - **Decimals**: 2 (for numeric)
  - **Label**: Display name
  - **Missing Values**: 999, -1 (codes to exclude)
- Click **"Data View"** to return to spreadsheet

### 3️⃣ Load Real Data
- Click **File** → **Open CSV/Excel**
- Select a CSV or .xlsx file
- Data loads with automatic type inference
- Variables panel updates automatically

### 4️⃣ Run Analysis
- Click **Analyze** → Pick an analysis:
  - **Descriptive Statistics** (numeric variables)
  - **Frequencies** (any variables)
  - **Correlation** (2+ numeric variables)
  - **Regression** (dependent + independent)
- Select variables from the list
- Click **OK**
- Results appear in **Output** panel (right side)

### 5️⃣ View Results
- **Output Panel** shows formatted tables:
  - Descriptive Stats: N, Mean, Median, Std Dev, Min, Max
  - Frequencies: Count, %, Valid %, Cumulative %
  - Correlation: Correlation matrix
  - Regression: Model summary + Coefficients
- Click **▼/▶** to expand/collapse results
- Click **✕** to delete a result
- Click **Clear** to reset all output

### 6️⃣ Persist Data
- Data **auto-saves every 5 seconds** to IndexedDB
- **Reload page** → Data restored
- Click **File** → **Reset Dataset** to clear

---

## Sample Workflow Example

### Create a Dataset in 1 Minute

```
1. Click "Add Column" 3 times
   → Creates 3 columns (col1, col2, col3)

2. Click "Variable View"
   → Rename columns:
     - col1 → "age" (Type: numeric)
     - col2 → "salary" (Type: numeric)
     - col3 → "department" (Type: string)

3. Click "Data View"
   → Add rows with data:
     Row 1: 25, 45000, Sales
     Row 2: 32, 65000, Engineering
     Row 3: 28, 52000, Marketing
     Row 4: 45, 78000, Sales
     Row 5: 38, 71000, Engineering

4. Click Analyze → Descriptive Statistics
   → Select: age, salary
   → Click OK
   → See Mean, Median, Std Dev, etc.

5. Click Analyze → Correlation
   → Select: age, salary
   → Click OK
   → See correlation between age and salary

6. Click Analyze → Regression
   → Dependent: salary
   → Independent: age
   → Click OK
   → See R², coefficients, prediction equation
```

---

## Keyboard Shortcuts

| Action | Key |
|--------|-----|
| Edit cell | Click or Double-click |
| Save cell | Enter |
| Cancel edit | Escape |
| Copy/Paste | Ctrl+C / Ctrl+V (from Excel) |

---

## Tips & Tricks

### 💡 Fast Data Entry
1. Import a CSV file (File → Open CSV)
2. Types auto-detected (25, 45000 → numeric; "Sales" → string)
3. Edit Variable View to customize decimals, labels, missing values

### 💡 Variable Configuration
- **Type**: Set to "numeric" to enable stats analysis
- **Decimals**: Display precision (2 = 12.34)
- **Label**: Display name for reports
- **Missing Values**: Codes to exclude (e.g., 999, -1)
- **Measure Level**: nominal, ordinal, scale (affects interpretation)

### 💡 Missing Data
- Empty cells = NULL
- User-defined codes (999, -1) excluded if listed in Missing Values
- Output shows N (valid cases) and Missing count

### 💡 Results
- Collapse results with **▼** to save space
- **Delete** individual results with **✕**
- **Clear** all results at once
- Results append (oldest at top)

### 💡 Persistence
- Data saved automatically every 5 seconds
- Survives browser close/reload
- Use **Reset Dataset** to clear (with confirmation)

---

## Menu Overview

### File
- **Open CSV/Excel** - Import data with auto-detection
- **Reset Dataset** - Clear all data (confirmation required)

### Edit
- Undo/Redo (placeholder - not yet implemented)

### View
- **Show/Hide Output** - Toggle output panel visibility

### Analyze
- **Descriptive Statistics** - Mean, median, std dev, etc.
- **Frequencies** - Count, %, cumulative %
- **Correlation** - Pearson r, p-values
- **Regression** - Multiple regression, R², coefficients
- **T-Test** - One-sample t-test (placeholder - not in main dialog)

### Graphs
- Placeholder for chart-based analysis

---

## Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Please select a variable" | No variables selected in dialog | Choose ≥1 variable |
| "Select at least 2 variables" | Correlation needs 2+ vars | Choose 2+ numeric variables |
| "Failed to load file" | Invalid CSV/Excel format | Check file format, try again |
| "Variable name already exists" | Duplicate column name | Rename to unique name |
| "Cannot contain spaces" | Space in variable name | Remove spaces (use _ or camelCase) |

---

## Supported File Formats

| Format | Support | Notes |
|--------|---------|-------|
| CSV | ✅ | Auto type inference |
| Excel (.xlsx) | ✅ | First sheet only |
| Clipboard paste | ✅ | TSV from Excel/Sheets |

---

## Browser Requirements

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (not supported)

**Required**: JavaScript enabled, IndexedDB support

---

## Statistics Explained

### Descriptive Statistics
- **N** - Number of valid cases
- **Mean** - Average
- **Median** - Middle value (50th percentile)
- **Mode** - Most frequent value
- **Std Dev** - Standard deviation
- **Variance** - Spread of data
- **Min/Max** - Minimum and maximum values
- **Skewness** - Asymmetry (negative = left, positive = right)
- **Kurtosis** - Tail weight (higher = fatter tails)

### Frequencies
- **Frequency** - Count of occurrences
- **Percent** - % of total rows
- **Valid Percent** - % of non-missing rows
- **Cumulative %** - Running total percentage

### Correlation
- **r** - Correlation coefficient (-1 to +1)
  - 0 = no relationship
  - +1 = perfect positive
  - -1 = perfect negative
- **p-value** - Statistical significance
  - < 0.05 = significant at 95% confidence

### Regression
- **R²** - % of variance explained by model
- **Adjusted R²** - R² adjusted for # of predictors
- **F-statistic** - Model significance test
- **B** - Unstandardized coefficient
- **Beta** - Standardized coefficient
- **t** - t-statistic for each predictor
- **p-value** - Significance of each predictor

---

## Frequently Asked Questions

**Q: Where is my data saved?**
A: IndexedDB (browser local storage). Auto-saves every 5 seconds.

**Q: Can I export results?**
A: Yes, take screenshots or copy tables. Export to PDF coming soon.

**Q: Is there a limit to data size?**
A: Limited by browser memory (typically 50-100K+ rows on modern devices).

**Q: Can I undo/redo?**
A: Reload page to restore from IndexedDB backup (within last 5 sec save).

**Q: Does this work offline?**
A: Yes, fully offline after first load.

**Q: Can I share my dataset?**
A: Export as CSV (File → Open), share file, other users import.

---

## Technical Details

- **Framework**: Next.js 16 + React 19
- **Bundler**: Turbopack
- **State**: Zustand
- **Styling**: Tailwind CSS v4
- **Statistics**: simple-statistics library
- **Charts**: Recharts
- **Storage**: Native IndexedDB API
- **Build**: TypeScript strict mode

---

## Support

For issues or feature requests:
1. Check IMPLEMENTATION_SUMMARY.md for detailed architecture
2. Review error messages in console (F12 → Console tab)
3. Ensure data is valid (no special characters in variable names)
4. Try File → Reset Dataset and reload if stuck

---

**Happy Analyzing! 📊**
