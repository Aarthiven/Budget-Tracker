import React, { useState, useEffect } from 'react'
import axios from 'axios'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'
import Analytics from './Analytics'
import Summary from './Summary'

const Dashboard = ({ user, onLogout }) => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTransactions(response.data)
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTransaction = async (transactionData) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        'http://localhost:5000/api/transactions',
        transactionData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTransactions([response.data, ...transactions])
      return true
    } catch (error) {
      console.error('Error adding transaction:', error)
      return false
    }
  }

  const deleteTransaction = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTransactions(transactions.filter(t => t._id !== id))
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  const calculateSummary = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    
    return {
      income,
      expenses,
      balance: income - expenses
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'transactions', name: 'Transactions', icon: '💳' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'add', name: 'Add Transaction', icon: '➕' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                💰 Budget Tracker Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}!</span>
              <button
                onClick={onLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Summary summary={calculateSummary()} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Analytics transactions={transactions} />
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                <TransactionList 
                  transactions={transactions.slice(0, 5)} 
                  onDelete={deleteTransaction}
                  showActions={false}
                />
                {transactions.length > 5 && (
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View all transactions →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <TransactionList 
            transactions={transactions} 
            onDelete={deleteTransaction}
            showActions={true}
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics transactions={transactions} />
        )}

        {activeTab === 'add' && (
          <div className="max-w-md mx-auto">
            <TransactionForm onAdd={addTransaction} />
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
