# Financial Calculator

A locally hosted financial calculator that helps users calculate:
1. EMI (Equated Monthly Installment) with prepayment options
2. Systematic Investment Plan (SIP) with step-up option
3. Systematic Withdrawal Plan (SWP)

## Features

### SIP Calculator
- Calculate monthly SIP returns
- Add annual step-up percentage
- View total investment amount
- View expected returns
- View wealth gained

### SWP Calculator
- Calculate systematic withdrawal plan
- Input initial investment amount
- Set monthly withdrawal amount
- View remaining balance
- Get warnings if funds will be exhausted before the specified period

### EMI Calculator
- Calculate loan EMI with flexible prepayment options
- Add monthly extra payments
- Add multiple lumpsum prepayments at specific months
- View comprehensive loan summary:
  - Monthly EMI amount
  - Total interest with and without prepayments
  - Interest saved through prepayments
  - Time saved in months
- Interactive visualizations:
  - Payment breakdown chart (Principal, Interest, Monthly Extra, Lumpsum)
  - Outstanding balance over time
- Detailed amortization schedule with:
  - Monthly EMI breakdown (Principal and Interest)
  - Separate columns for Monthly Extra and Lumpsum prepayments
  - Remaining loan balance

## How to Use

1. Open `index.html` in a web browser
2. Select the desired calculator using the tabs at the top

3. For EMI calculation:
   - Enter loan amount, interest rate, and loan period
   - Optional: Add monthly extra payment amount
   - Optional: Add lumpsum prepayments with month and amount
   - Click "Calculate EMI"
   - View summary, charts, and amortization schedule
   - Charts show payment breakdown and outstanding balance
   - Table shows detailed month-by-month breakdown

4. For SIP calculation:
   - Enter monthly investment amount
   - Set investment period in years
   - Input expected return rate
   - Optional: Add annual step-up percentage
   - Optional: Add expected inflation rate
   - Click "Calculate SIP"

5. For SWP calculation:
   - Enter initial investment amount
   - Set monthly withdrawal amount
   - Input withdrawal period in years
   - Set expected return rate
   - Optional: Add expected inflation rate
   - Click "Calculate SWP"

4. For EMI calculation:
   - Enter loan amount
   - Set annual interest rate
   - Input loan tenure in years
   - Optional: Add monthly extra payment
   - Optional: Add lumpsum prepayment amount and month
   - Click "Calculate EMI"

## Technical Details

- Pure HTML, CSS, and JavaScript implementation
- Uses Chart.js for interactive visualizations
- Mobile-responsive design with modern UI
- Handles currency formatting in Indian Rupees (₹)
- Real-time calculations and updates
- Color-coded results for better readability
- Interactive charts with tooltips
- Responsive tables with horizontal scroll
- Performs complex financial calculations including:
  - Loan amortization with prepayments
  - Compound interest with step-up
  - Inflation-adjusted returns
  
## Features Highlight

### Visual Elements
- Percentage stacked bar chart for payment breakdown
- Line chart with data points for outstanding balance
- Color-coded summary information
- Clean, pastel-colored tables
- Modern tab-based interface

### Calculations
- EMI with prepayment impact
- Interest savings calculation
- Time reduction calculation
- Real returns (inflation-adjusted)
- Corpus depletion analysis

## Server Setup and Hosting

### Local Development Server

1. Prerequisites:
   - Node.js installed on your system
   - npm (Node Package Manager)

2. Installation:
   ```bash
   # Install dependencies
   npm install
   ```

3. Running the server:
   ```bash
   # Start production server
   npm start

   # Or run development server with auto-reload
   npm run dev
   ```

4. Access the calculator:
   - Open your browser and go to `http://localhost:3000`
   - The calculator will be running on your local network

### Production Hosting

1. On a Node.js server:
   ```bash
   # Clone the repository
   git clone <repository-url>
   
   # Install dependencies
   npm install
   
   # Start the server
   npm start
   ```

2. Using static hosting (GitHub Pages, Netlify, etc.):
   - Simply deploy the following files:
     - `index.html`
     - `css/styles.css`
     - `js/calculator.js`
   - No server setup needed for static hosting

3. Environment Variables:
   - `PORT`: Set custom port (default: 3000)
   - Example: `PORT=8080 npm start`

### Server Features
- Express.js based server
- Static file serving
- Configurable port
- Development mode with auto-reload
- Production-ready setup
