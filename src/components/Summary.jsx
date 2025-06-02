import React from 'react'

const Summary = ({ summary }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const cards = [
    {
      title: 'Current Balance',
      amount: summary.balance,
      icon: '💰',
      color: summary.balance >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: summary.balance >= 0 ? 'bg-green-50' : 'bg-red-50',
      borderColor: summary.balance >= 0 ? 'border-green-200' : 'border-red-200'
    },
    {
      title: 'Total Income',
      amount: summary.income,
      icon: '📈',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Total Expenses',
      amount: summary.expenses,
      icon: '📉',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`card ${card.bgColor} ${card.borderColor} border-2`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className={`text-2xl font-bold ${card.color}`}>
                {formatCurrency(card.amount)}
              </p>
            </div>
            <div className="text-3xl">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Summary
