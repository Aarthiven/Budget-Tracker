import React, { useState } from 'react'

const TransactionList = ({ transactions, onDelete, showActions = true }) => {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryIcon = (category) => {
    const icons = {
      salary: '💼',
      business: '🏢',
      investment: '📊',
      freelance: '💻',
      food: '🍽️',
      rent: '🏠',
      utilities: '⚡',
      transportation: '🚗',
      entertainment: '🎬',
      shopping: '🛍️',
      healthcare: '🏥',
      education: '📚',
      other: '📝'
    }
    return icons[category] || '📝'
  }

  const filteredTransactions = transactions
    .filter(transaction => {
      if (filter === 'all') return true
      return transaction.type === filter
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date) - new Date(a.date)
      } else if (sortBy === 'amount') {
        return b.amount - a.amount
      }
      return 0
    })

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      onDelete(id)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="text-2xl mr-3">💳</span>
          <h2 className="text-xl font-semibold text-gray-900">
            Transaction History
          </h2>
        </div>
        <div className="text-sm text-gray-500">
          {filteredTransactions.length} transaction(s)
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Type
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field text-sm"
          >
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field text-sm"
          >
            <option value="date">Date (Newest First)</option>
            <option value="amount">Amount (Highest First)</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No transactions found
          </h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? "Start by adding your first transaction!"
              : `No ${filter} transactions found. Try changing the filter.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction._id || transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {getCategoryIcon(transaction.category)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {transaction.description}
                  </h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className="capitalize">{transaction.category}</span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`font-semibold ${
                    transaction.type === 'income' 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {transaction.type}
                  </div>
                </div>
                
                {showActions && (
                  <button
                    onClick={() => handleDelete(transaction._id || transaction.id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete transaction"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TransactionList
