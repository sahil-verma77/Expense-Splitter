# Expense Splitter

A simple, responsive web app to keep track of shared group expenses and calculate how much each member owes or should receive.

**[🌐 Live Demo](https://sahil-verma77.github.io/Expense-Splitter/)** · **[📂 GitHub Repository](https://github.com/sahil-verma77/Expense-Splitter)**

## ✨ Features

- 👥 **Manage group members:** Add members and remove them when they are not linked to existing expense records.
- 🧾 **Record expenses:** Enter an expense title and amount, then choose who paid.
- 🤝 **Split expenses:** Select the members sharing each expense. The amount is divided equally among the selected members.
- ✅ **Quick selection:** Select all or clear all split participants.
- 📊 **Automatic balance calculation:** See who owes money, who gets money back, or who is settled up.
- 🗑️ **Manage records:** Delete individual expenses or clear all members and expenses after confirmation.
- 💾 **Save progress:** Members and expenses persist in the browser using `localStorage`, including after a page refresh.
- 📱 **Responsive interface:** Use the app across different screen sizes.
- 🔎 **Input validation:** Get feedback for missing or duplicate member names and invalid expense details.

## 🛠️ Built With

- HTML5
- CSS3
- Tailwind CSS
- JavaScript
- Browser `localStorage`

## 🚀 Getting Started

To run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/sahil-verma77/Expense-Splitter.git
   ```
2. Open the project folder:
   ```bash
   cd Expense-Splitter
   ```
3. Open `index.html` in your browser. You can also use the **Live Server** extension in VS Code while developing.

No build step is required.

## 📖 How to Use

1. Add at least two group members.
2. Enter an expense title and amount.
3. Select who paid and which members should share the cost.
4. Add the expense to see its details and the updated balances.
5. Delete an expense when needed, or use **Clear All** to reset the group and its records.

## 📁 Project Structure

```text
Expense-Splitter/
├── index.html   # Page structure and interface
├── style.css    # Custom styling
├── script.js    # Member management, expenses, and balance calculations
└── README.md
```

## 💡 Note About Saved Data

The app stores member and expense data in your browser's `localStorage`. The data remains available after refreshing the page, but it is specific to that browser and device. Clearing the browser's site data can remove it.
