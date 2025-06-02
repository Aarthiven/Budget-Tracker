import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import transactionRoutes from './routes/transactions.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Ensure users.json exists
const usersFile = path.join(dataDir, 'users.json')
if (!fs.existsSync(usersFile)) {
  const initialUsers = [
    {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // demo123
      createdAt: new Date().toISOString()
    }
  ]
  fs.writeFileSync(usersFile, JSON.stringify(initialUsers, null, 2))
}

// Ensure transactions.json exists
const transactionsFile = path.join(dataDir, 'transactions.json')
if (!fs.existsSync(transactionsFile)) {
  const initialTransactions = [
    {
      _id: '1',
      userId: '1',
      description: 'Monthly Salary',
      amount: 5000,
      type: 'income',
      category: 'salary',
      date: new Date().toISOString()
    },
    {
      _id: '2',
      userId: '1',
      description: 'Grocery Shopping',
      amount: 150,
      type: 'expense',
      category: 'food',
      date: new Date().toISOString()
    },
    {
      _id: '3',
      userId: '1',
      description: 'Rent Payment',
      amount: 1200,
      type: 'expense',
      category: 'rent',
      date: new Date().toISOString()
    }
  ]
  fs.writeFileSync(transactionsFile, JSON.stringify(initialTransactions, null, 2))
}

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Budget Tracker API is running!' })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📊 Budget Tracker API is ready!`)
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`)
})
