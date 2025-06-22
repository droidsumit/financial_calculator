# Financial Calculator

A locally hosted financial calculator that helps users calculate:
1. Systematic Investment Plan (SIP) with step-up option
2. Systematic Withdrawal Plan (SWP)

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

## How to Use

1. Open `index.html` in a web browser
2. For SIP calculation:
   - Enter monthly investment amount
   - Set investment period in years
   - Input expected return rate
   - Optional: Add annual step-up percentage
   - Click "Calculate SIP"

3. For SWP calculation:
   - Enter initial investment amount
   - Set monthly withdrawal amount
   - Input withdrawal period in years
   - Set expected return rate
   - Click "Calculate SWP"

## Technical Details

- Pure HTML, CSS, and JavaScript implementation
- No external dependencies required
- Mobile-responsive design
- Handles currency formatting in Indian Rupees (₹)
- Performs complex financial calculations with compound interest
