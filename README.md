# 💰 Budget Tracker Pro

A comprehensive web application for tracking income, expenses, and financial analytics with beautiful pie charts and insights.

## ✨ Features

- 🔐 **User Authentication** - Secure login and registration system
- 💳 **Transaction Management** - Add, view, and delete income/expense transactions
- 📊 **Analytics Dashboard** - Beautiful pie charts and financial insights
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎨 **Modern UI** - Clean, intuitive interface with Tailwind CSS
- 📈 **Real-time Updates** - Instant updates to your financial data

## 🚀 Quick Start

### Prerequisites

Make sure you have Node.js installed on your system.

### Installation

1. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm start
   ```
   The server will run on `http://localhost:5000`

2. **Start the Frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   The app will run on `http://localhost:3000`

## 🎯 Demo Account

You can use the demo account to test the application:
- **Email:** demo@example.com
- **Password:** demo123

## 📱 Usage

1. **Register/Login** - Create a new account or use the demo credentials
2. **Add Transactions** - Use the "Add Transaction" tab to record income and expenses
3. **View Analytics** - Check the "Analytics" tab for spending insights and pie charts
4. **Track Progress** - Monitor your financial health on the Overview dashboard

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Beautiful charts and graphs
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **File-based storage** - JSON files for data persistence

## 📁 Project Structure

```
budget-tracker-pro/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── App.jsx            # Main App component
│   └── main.jsx           # Entry point
├── server/                 # Backend source code
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   ├── data/              # JSON data files
│   └── server.js          # Express server
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory for production:

```env
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder

### Backend (Heroku/Railway)
1. Deploy the `server` folder
2. Set environment variables
3. Update API URLs in frontend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please create an issue in the repository.

---

**Happy budgeting! 💰📊**
