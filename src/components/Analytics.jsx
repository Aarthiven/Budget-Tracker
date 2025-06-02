import React from 'react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
)

const Analytics = ({ transactions }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  // Calculate expense breakdown by category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
      return acc
    }, {})

  // Calculate income breakdown by category
  const incomeByCategory = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
      return acc
    }, {})

  // Colors for charts
  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
  ]

  // Expense pie chart data
  const expenseChartData = {
    labels: Object.keys(expensesByCategory).map(cat => 
      cat.charAt(0).toUpperCase() + cat.slice(1)
    ),
    datasets: [
      {
        data: Object.values(expensesByCategory),
        backgroundColor: colors.slice(0, Object.keys(expensesByCategory).length),
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  }

  // Income pie chart data
  const incomeChartData = {
    labels: Object.keys(incomeByCategory).map(cat => 
      cat.charAt(0).toUpperCase() + cat.slice(1)
    ),
    datasets: [
      {
        data: Object.values(incomeByCategory),
        backgroundColor: ['#10B981', '#059669', '#047857', '#065F46', '#064E3B'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  }

  // Monthly trend data
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
    
    if (!acc[month]) {
      acc[month] = { income: 0, expenses: 0 }
    }
    
    if (transaction.type === 'income') {
      acc[month].income += transaction.amount
    } else {
      acc[month].expenses += transaction.amount
    }
    
    return acc
  }, {})

  const monthlyChartData = {
    labels: Object.keys(monthlyData).slice(-6), // Last 6 months
    datasets: [
      {
        label: 'Income',
        data: Object.keys(monthlyData).slice(-6).map(month => monthlyData[month].income),
        backgroundColor: '#10B981',
        borderColor: '#059669',
        borderWidth: 1
      },
      {
        label: 'Expenses',
        data: Object.keys(monthlyData).slice(-6).map(month => monthlyData[month].expenses),
        backgroundColor: '#EF4444',
        borderColor: '#DC2626',
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = formatCurrency(context.parsed || context.raw)
            return `${context.label}: ${value}`
          }
        }
      }
    }
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.raw)}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value)
          }
        }
      }
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Analytics Available
          </h3>
          <p className="text-gray-500">
            Add some transactions to see your spending analytics and insights.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="mr-2">📈</span>
          Financial Analytics
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {transactions.length}
            </div>
            <div className="text-sm text-gray-600">Total Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.keys(incomeByCategory).length}
            </div>
            <div className="text-sm text-gray-600">Income Sources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {Object.keys(expensesByCategory).length}
            </div>
            <div className="text-sm text-gray-600">Expense Categories</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(
                Math.max(...Object.values(expensesByCategory), 0)
              )}
            </div>
            <div className="text-sm text-gray-600">Highest Expense</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        {Object.keys(expensesByCategory).length > 0 && (
          <div className="card">
            <h4 className="text-md font-semibold mb-4 text-center">
              💸 Expense Breakdown
            </h4>
            <div className="chart-container">
              <Pie data={expenseChartData} options={chartOptions} />
            </div>
          </div>
        )}

        {/* Income Breakdown */}
        {Object.keys(incomeByCategory).length > 0 && (
          <div className="card">
            <h4 className="text-md font-semibold mb-4 text-center">
              💰 Income Sources
            </h4>
            <div className="chart-container">
              <Pie data={incomeChartData} options={chartOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Monthly Trend */}
      {Object.keys(monthlyData).length > 0 && (
        <div className="card">
          <h4 className="text-md font-semibold mb-4">
            📊 Monthly Income vs Expenses
          </h4>
          <div className="chart-container">
            <Bar data={monthlyChartData} options={barOptions} />
          </div>
        </div>
      )}
    </div>
  )
}

export default Analytics
