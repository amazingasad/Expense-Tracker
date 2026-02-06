# TourSplit Pro - Expense Tracker

A premium, lightweight expense tracking application designed for group travel and tours. Split expenses fairly and track who owes what with an elegant, modern interface.

![TourSplit Pro](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

- **👥 Multi-Traveler Support**: Add multiple travelers to your trip
- **💰 Expense Tracking**: Record who paid for what with detailed descriptions
- **📊 Real-time Statistics**: View total expenses and average cost per person
- **⚖️ Smart Settlement**: Automatically calculates who owes what to minimize transactions
- **📥 PDF Export**: Generate professional expense reports with one click
- **💾 Auto-Save**: All data is saved locally - never lose your records
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎨 Modern UI**: Beautiful glassmorphic design with smooth animations

## 🚀 Getting Started

### Prerequisites

You only need a modern web browser! No installation required.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amazingasad/Expense-Tracker.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Expense-Tracker
   ```

3. Open `index.html` in your web browser:
   ```bash
   # On macOS
   open index.html
   
   # On Linux
   xdg-open index.html
   
   # On Windows
   start index.html
   ```

Alternatively, you can use a local development server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## 📖 How to Use

### Step 1: Set Up Your Trip
1. Enter the number of travelers
2. Click "Continue"

### Step 2: Add Travelers
1. Enter names for each traveler (or leave blank for auto-generated names)
2. Click "Create Dashboard"

### Step 3: Track Expenses
1. Select who paid for the expense from the dropdown
2. Enter a description (e.g., "Hotel", "Dinner", "Gas")
3. Enter the amount
4. Click "Add Expense"

### Step 4: View Settlements
1. Click "Calculate Final Split" to see who owes what
2. The app calculates the minimum number of transactions needed to settle all debts

### Step 5: Export Report
1. Click the "📥 PDF" button to download a detailed expense report

## 🛠️ Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling with modern features (CSS Grid, Flexbox, animations)
- **JavaScript (ES6+)**: Application logic and interactivity
- **jsPDF**: PDF generation functionality
- **localStorage**: Data persistence
- **Google Fonts**: Plus Jakarta Sans typography

## 📂 Project Structure

```
Expense-Tracker/
├── index.html      # Main HTML file with app structure
├── script.js       # JavaScript logic for expense tracking
├── style.css       # Styling and responsive design
└── README.md       # Project documentation
```

## 🎯 Key Functionalities

### Expense Management
- Add, view, and delete expenses
- Track payer, description, amount, and timestamp for each expense
- Real-time calculation of total and per-person averages

### Settlement Algorithm
The app uses a greedy algorithm to minimize the number of transactions:
1. Calculate each person's balance (amount paid - fair share)
2. Match debtors with creditors
3. Optimize transfers to minimize transaction count

### Data Persistence
All data is stored in the browser's localStorage, so your expenses persist even after closing the browser.

## 🎨 Features in Detail

### Glassmorphic UI
- Modern frosted glass effect
- Smooth animations and transitions
- Responsive grid layout
- Mobile-first design approach

### Smart Defaults
- Auto-generated member names if not provided
- Validates input to prevent errors
- Confirmation dialogs for destructive actions

## 🔒 Privacy

All data is stored locally in your browser. No server connection required. Your expense data never leaves your device.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/amazingasad/Expense-Tracker/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**amazingasad**

- GitHub: [@amazingasad](https://github.com/amazingasad)

## 🙏 Acknowledgments

- Icons and fonts from Google Fonts
- jsPDF library for PDF generation
- Inspiration from modern expense tracking apps

## 📞 Support

If you have any questions or need help, please open an issue in the GitHub repository.

---

Made with ❤️ for travelers everywhere
