# 💸 NJS Event Expense Tracker

A lightweight, modern, and efficient expense tracking application built for group events, trips, or shared living. Manage common pools, individual fees, and calculate complex settlements with ease.

[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3.x-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.x-7952B3?style=for-the-badge&logo=bootstrap)](https://getbootstrap.com/)

---

## ✨ Key Features

- **📊 Smart Dashboard**: Instantly see total spending and a full log of all expenses.
- **👥 Multi-User Management**: Add, edit, or remove participants with custom duration tracking (days stayed).
- **⚖️ Flexible Splitting**:
  - **Group Pool**: Split common costs by days attended or equally.
  - **Individual Fees**: Assign specific costs directly to one person (e.g., equipment rental).
- **🧾 Automatic Settlements**: Intelligent algorithm determines exactly who owes what to whom, minimizing the number of transactions.
- **🔍 Calculation Transparency**: Dedicated "Breakdown" page explaining exactly how each balance was calculated.
- **⚙️ Customizable Settings**: Support for different currencies and configurable calculation modes.
- **🗃️ Local Storage**: Uses a lightweight SQLite database for persistence.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Runtime**: Node.js
- **Database**: [Better-SQLite3](https://github.com/WiseLibs/better-sqlite3)
- **Styling**: [Bootstrap 5](https://getbootstrap.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18.x or later)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/njs-event-expense-tracker.git
   cd njs-event-expense-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Database Setup:**
   The application automatically initializes a local `expenses.db` file in the root directory on the first run.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```text
src/
├── app/            # Next.js App Router (Pages & API Actions)
├── components/     # Reusable UI components
├── lib/            # Database logic & Type definitions
└── ...
```

## 📸 Screenshots

*(Screenshots will be added in post-production)*

## 📄 License

This project is licensed under the **ISC License**.

---

Developed with ❤️ for easier event planning.
