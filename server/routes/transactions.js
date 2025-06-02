import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { authenticateToken } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()
const transactionsFile = path.join(__dirname, '../data/transactions.json')

// Helper function to read transactions
const readTransactions = () => {
  try {
    const data = fs.readFileSync(transactionsFile, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// Helper function to write transactions
const writeTransactions = (transactions) => {
  fs.writeFileSync(transactionsFile, JSON.stringify(transactions, null, 2))
}

// Get all transactions for authenticated user
router.get('/', authenticateToken, (req, res) => {
  try {
    const transactions = readTransactions()
    const userTransactions = transactions.filter(t => t.userId === req.user.id)
    
    // Sort by date (newest first)
    userTransactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    res.json(userTransactions)
  } catch (error) {
    console.error('Error fetching transactions:', error)
    res.status(500).json({ message: 'Error fetching transactions' })
  }
})

// Add new transaction
router.post('/', authenticateToken, (req, res) => {
  try {
    const { description, amount, type, category, date } = req.body

    // Validation
    if (!description || !amount || !type || !category) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' })
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ message: 'Type must be income or expense' })
    }

    const transactions = readTransactions()

    const newTransaction = {
      _id: Date.now().toString(),
      userId: req.user.id,
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: date || new Date().toISOString()
    }

    transactions.push(newTransaction)
    writeTransactions(transactions)

    res.status(201).json(newTransaction)
  } catch (error) {
    console.error('Error adding transaction:', error)
    res.status(500).json({ message: 'Error adding transaction' })
  }
})

// Update transaction
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const { description, amount, type, category } = req.body

    const transactions = readTransactions()
    const transactionIndex = transactions.findIndex(
      t => t._id === id && t.userId === req.user.id
    )

    if (transactionIndex === -1) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    // Update transaction
    transactions[transactionIndex] = {
      ...transactions[transactionIndex],
      description: description || transactions[transactionIndex].description,
      amount: amount ? parseFloat(amount) : transactions[transactionIndex].amount,
      type: type || transactions[transactionIndex].type,
      category: category || transactions[transactionIndex].category,
      updatedAt: new Date().toISOString()
    }

    writeTransactions(transactions)
    res.json(transactions[transactionIndex])
  } catch (error) {
    console.error('Error updating transaction:', error)
    res.status(500).json({ message: 'Error updating transaction' })
  }
})

// Delete transaction
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params
    const transactions = readTransactions()
    
    const transactionIndex = transactions.findIndex(
      t => t._id === id && t.userId === req.user.id
    )

    if (transactionIndex === -1) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    transactions.splice(transactionIndex, 1)
    writeTransactions(transactions)

    res.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    res.status(500).json({ message: 'Error deleting transaction' })
  }
})

// Get transaction statistics
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const transactions = readTransactions()
    const userTransactions = transactions.filter(t => t.userId === req.user.id)

    const stats = {
      totalTransactions: userTransactions.length,
      totalIncome: userTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      totalExpenses: userTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      categoriesCount: {
        income: [...new Set(userTransactions.filter(t => t.type === 'income').map(t => t.category))].length,
        expense: [...new Set(userTransactions.filter(t => t.type === 'expense').map(t => t.category))].length
      }
    }

    stats.balance = stats.totalIncome - stats.totalExpenses

    res.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ message: 'Error fetching statistics' })
  }
})

export default router
