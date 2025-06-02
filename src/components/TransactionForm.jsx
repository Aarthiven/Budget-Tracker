import React, { useState } from 'react'

const TransactionForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'other'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const categories = {
    income: [
      { value: 'salary', label: 'Salary' },
      { value: 'business', label: 'Business' },
      { value: 'investment', label: 'Investment' },
      { value: 'freelance', label: 'Freelance' },
      { value: 'other', label: 'Other' }
    ],
    expense: [
      { value: 'food', label: 'Food & Dining' },
      { value: 'rent', label: 'Rent & Housing' },
      { value: 'utilities', label: 'Utilities' },
      { value: 'transportation', label: 'Transportation' },
      { value: 'entertainment', label: 'Entertainment' },
      { value: 'shopping', label: 'Shopping' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'education', label: 'Education' },
      { value: 'other', label: 'Other' }
    ]
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset category when type changes
      ...(name === 'type' && { category: 'other' })
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString()
    }

    const success = await onAdd(transactionData)
    
    if (success) {
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: 'other'
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
    
    setLoading(false)
  }

  return (
    <div className="card">
      <div className="flex items-center mb-6">
        <span className="text-2xl mr-3">➕</span>
        <h2 className="text-xl font-semibold text-gray-900">
          Add New Transaction
        </h2>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Transaction added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="input-field"
            placeholder="What was this transaction for?"
            required
          />
        </div>

        <div>
          <label className="label">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="input-field"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        <div>
          <label className="label">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="income">💰 Income</option>
            <option value="expense">💸 Expense</option>
          </select>
        </div>

        <div>
          <label className="label">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
            required
          >
            {categories[formData.type].map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Transaction'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">💡 Quick Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific with descriptions for better tracking</li>
          <li>• Choose the right category for accurate analytics</li>
          <li>• Add transactions regularly to stay on top of your finances</li>
        </ul>
      </div>
    </div>
  )
}

export default TransactionForm
