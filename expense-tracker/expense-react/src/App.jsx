import React, { useState, useEffect } from 'react'

// Expense Tracker - Clean and Professional
// Copyright © A.Mabrouk 2025

function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch (e) {
      return initial
    }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)) } catch (e) {}
  }, [key, state])
  return [state, setState]
}

function formatDateISO(d) {
  if (!d) return ''
  const dt = new Date(d)
  return dt.toLocaleDateString('en-US')
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8)
}

function ExpenseForm({ onAdd, categories }) {
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [cat, setCat] = useState(categories[0] || '')

  function submit(e) {
    e.preventDefault()
    const a = parseFloat(amount)
    if (!desc.trim() || !a || !date) return alert('Please fill all fields')
    onAdd({ id: uid(), desc: desc.trim(), amount: a, date, category: cat })
    setDesc(''); setAmount(''); setDate(''); setCat(categories[0] || '')
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="What did you spend on?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amount (EGP)</label>
            <input
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              type="number"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              value={date}
              onChange={e => setDate(e.target.value)}
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={cat}
              onChange={e => setCat(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Expense
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function Summary({ expenses }) {
  const total = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const average = expenses.length > 0 ? total / expenses.length : 0
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-xl font-bold mb-4">Financial Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{total.toFixed(2)} EGP</div>
          <div className="text-gray-600 mt-1">Total Spent</div>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{expenses.length}</div>
          <div className="text-gray-600 mt-1">Transactions</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{average.toFixed(2)} EGP</div>
          <div className="text-gray-600 mt-1">Average</div>
        </div>
      </div>
    </div>
  )
}

function ExpenseList({ expenses, onDelete }) {
  if (!expenses.length) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md border text-center">
        <div className="text-gray-400 text-6xl mb-4">💸</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No expenses yet</h3>
        <p className="text-gray-500">Start by adding your first expense above</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h2 className="text-xl font-bold mb-4">Expense History</h2>
      <div className="space-y-3">
        {expenses.map(expense => (
          <div key={expense.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-semibold text-gray-900">{expense.desc}</h4>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {expense.category}
                </span>
              </div>
              <p className="text-gray-500 text-sm">{formatDateISO(expense.date)}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-900 text-lg">{Number(expense.amount).toFixed(2)} EGP</span>
              <button
                onClick={() => onDelete(expense.id)}
                className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const defaultCats = ['Food', 'Transportation', 'Housing', 'Healthcare', 'Entertainment', 'Other']
  const [categories] = useState(defaultCats)
  const [expenses, setExpenses] = useLocalStorage('expenses_v1', [])
  const [filterMonth, setFilterMonth] = useState('')
  const [search, setSearch] = useState('')

  function addExpense(exp) {
    setExpenses(prev => [exp, ...prev])
  }

  function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return
    setExpenses(prev => prev.filter(p => p.id !== id))
  }

  function clearAll() {
    if (!confirm('Are you sure you want to clear all expenses?')) return
    setExpenses([])
  }

  function exportCSV() {
    if (!expenses.length) return alert('No data to export')
    const rows = [['Description', 'Amount', 'Date', 'Category']]
    expenses.forEach(e => rows.push([e.desc, e.amount, e.date, e.category]))
    const csv = rows.map(r => r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'expenses.csv'; a.click(); URL.revokeObjectURL(url);
  }

  const filtered = expenses.filter(e => {
    if (filterMonth) {
      const month = filterMonth
      if (!e.date.startsWith(month)) return false
    }
    if (search) {
      const s = search.trim().toLowerCase()
      if (!e.desc.toLowerCase().includes(s) && !e.category.toLowerCase().includes(s)) return false
    }
    return true
  })

  const months = Array.from(new Set(expenses.map(e => e.date.slice(0, 7)))).sort((a, b) => b.localeCompare(a))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">💰 Expense Tracker</h1>
          <p className="text-gray-600 text-lg">Manage your expenses efficiently</p>
          <p className="text-gray-500 mt-1">Copyright © A.Mabrouk 2025</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex gap-4 flex-1">
            <select
              value={filterMonth}
              onChange={e => setFilterMonth(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Months</option>
              {months.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <input
              placeholder="Search expenses..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Export CSV
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <ExpenseForm onAdd={addExpense} categories={categories} />
          <Summary expenses={filtered} />
          <ExpenseList expenses={filtered} onDelete={deleteExpense} />
        </div>
      </div>
    </div>
  )
}