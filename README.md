# 📊 SPSS-IBM-Calculator: Professional Statistical Analysis Web App

A fully client-side, browser-based statistical analysis application inspired by IBM SPSS Statistics. Zero backend, zero database, 100% JavaScript/React.

---

## 🎯 What it is
**SPSS-IBM-Calculator** is a web-based replica of the professional IBM SPSS Statistics environment. It provides researchers, students, and data analysts with a familiar interface to enter, manage, and analyze data directly in their browser without the need for expensive software or complex installations.

## 🚀 What it does
- **Data Management**: Features a dual-view editor (Data View and Variable View) for spreadsheet-style data entry and metadata configuration.
- **Statistical Analysis**: Performs real-time calculations for Descriptive Statistics, Frequencies, Pearson Correlation, and Multiple Linear Regression.
- **Data Visualization**: Generates professional charts including Histograms (with Sturges' formula), Bar Charts, and Scatter Plots.
- **Data Portability**: Supports importing data from CSV and Excel (.xlsx) files, as well as copy-pasting directly from Excel/Google Sheets.
- **Local Persistence**: Automatically saves your work to IndexedDB every 5 seconds, ensuring your data survives page reloads.

---

## ✨ Key Features

### 🖥️ Professional SPSS Environment
- **Familiar UI**: Menu bars, ribbon toolbars, and a split-pane layout for simultaneous data editing and output viewing.
- **Variable Selection**: SPSS-style variable selection modals for all statistical procedures.
- **Data Validation**: Automatic type inference and validation for variable names (no spaces, no duplicates).

### 🧮 Statistical Engine (100% Client-Side)
- **Descriptive Statistics**: Mean, Median, Mode, Standard Deviation, Variance, Skewness, Kurtosis, and more.
- **Frequencies**: Detailed frequency tables with counts, percentages, and cumulative percentages.
- **Inferential Stats**: Pearson correlation matrices and Multiple Linear Regression (OLS) with model summaries.
- **T-Tests**: One-sample T-Tests with 95% confidence intervals.

### 📈 Dynamic Visualizations
- **Auto-Binned Histograms**: Optimal binning using Sturges' formula for accurate distribution analysis.
- **Interactive Charts**: Responsive charts built with Recharts featuring tooltips and legends.
- **Collapsible Output**: Append-only output history with collapsible result blocks for easy management.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Library**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (Custom SPSS Theme)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Statistics**: [simple-statistics](https://simplestatistics.org/)
- **Data Parsing**: [PapaParse](https://www.papaparse.com/) (CSV) & [SheetJS](https://sheetjs.com/) (Excel)
- **Charts**: [Recharts](https://recharts.org/)
- **Persistence**: Browser IndexedDB API

---

## 📂 Project Structure

```text
├── app/                  # Next.js App Router (Layout & Entry)
├── components/
│   ├── layout/           # AppShell, SplitPane, Ribbons
│   ├── menu/             # SPSS-style Menu Bar & Dropdowns
│   ├── data-editor/      # Data View & Variable View Grids
│   ├── dialogs/          # Analysis Modals (Descriptives, Regression, etc.)
│   ├── output/           # Result Tables & Charts
│   └── ui/               # Primary UI Atoms (Button, Modal, etc.)
├── store/                # Zustand Stores (Dataset, Output, UI State)
├── lib/
│   ├── stats/            # Statistical Logic (Descriptives, Inferential)
│   ├── io/               # File Import Logic (CSV, Excel)
│   └── utils/            # Shared Utilities (Validation, Clipboard)
└── public/               # Static Assets
```

---

## 🚦 Quick Start

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/M-Subhan-Ali/Spss-IBM-Calculator.git
   cd Spss-IBM-Calculator
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Typical Workflow
1. **Load Data**: Use `File > Open CSV/Excel` or paste data from Excel into the **Data View**.
2. **Setup Variables**: Switch to **Variable View** to name your columns and set types (Numeric/String).
3. **Run Analysis**: Use the **Analyze** menu to select a procedure.
4. **View Results**: Check the **Output Panel** on the right for your tables and charts.

---

## 🔒 Security & Privacy
- **Privacy First**: All data processing happens locally in your browser. No data is ever uploaded to a server.
- **Offline Ready**: Once loaded, the application can function entirely without an internet connection.

## 📝 License
This project is for educational purposes. Feel free to use and modify it for your own statistical needs.

---

**Developed with ❤️ for Data Enthusiasts.**
