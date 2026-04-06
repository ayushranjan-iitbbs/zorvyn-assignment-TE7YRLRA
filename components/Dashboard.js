"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setInitialData, addTransaction, editTransaction, setFilter } from '../redux/transactionSlice';
import { openModal, closeModal } from '../redux/uiSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data, filters } = useSelector((state) => state.transactions);
  const { isAdminView, isDarkMode, isModalOpen, modalType, selectedTransaction } = useSelector((state) => state.ui);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [formValues, setFormValues] = useState({
    merchant: '',
    amount: 0,
    date: '',
    payment_method: 'UPI',
    status: 'pending',
    type: 'expense',
    category: 'Miscellaneous',
    description: '',
  });

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://my.api.mockaroo.com/transactions.json?key=8af071f0');
        const json = await res.json();
        dispatch(setInitialData(json));
      } catch (error) {
        console.error('Unable to load transactions:', error);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (modalType === 'edit' && selectedTransaction) {
      setFormValues({
        merchant: selectedTransaction.merchant || '',
        amount: selectedTransaction.amount || 0,
        date: selectedTransaction.date || '',
        payment_method: selectedTransaction.payment_method || 'UPI',
        status: selectedTransaction.status || 'pending',
        type: selectedTransaction.type || 'expense',
        category: selectedTransaction.category || 'Miscellaneous',
        description: selectedTransaction.description || '',
        id: selectedTransaction.id,
      });
    }

    if (modalType === 'add') {
      setFormValues({
        merchant: '',
        amount: 0,
        date: new Date().toISOString().slice(0, 10),
        payment_method: 'UPI',
        status: 'pending',
        type: 'expense',
        category: 'Miscellaneous',
        description: '',
      });
    }
  }, [modalType, selectedTransaction]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesCategory = filters.category === 'All' || item.category === filters.category;
      const matchesStatus = filters.status === 'All' || item.status === filters.status;
      const matchesType = filters.type === 'All' || item.type === filters.type;
      const matchesPayment = filters.payment_method === 'All' || item.payment_method === filters.payment_method;
      const matchesSearch = searchTerm
        ? [item.merchant, item.category, item.payment_method, item.status, item.description]
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;
      const matchesFrom = dateFrom ? new Date(item.date) >= new Date(dateFrom) : true;
      const matchesTo = dateTo ? new Date(item.date) <= new Date(dateTo) : true;
      return matchesCategory && matchesStatus && matchesType && matchesPayment && matchesSearch && matchesFrom && matchesTo;
    });
  }, [data, filters, searchTerm, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalIncome = filteredData.reduce((sum, item) => sum + (item.type === 'income' ? Number(item.amount) : 0), 0);
  const totalExpense = filteredData.reduce((sum, item) => sum + (item.type === 'expense' ? Number(item.amount) : 0), 0);

  const handleFormChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...formValues,
      amount: Number(formValues.amount),
    };

    if (modalType === 'add') {
      dispatch(addTransaction(payload));
    } else if (modalType === 'edit') {
      dispatch(editTransaction(payload));
    }

    dispatch(closeModal());
  };

  return (
    <div className={`min-h-screen pt-20 px-4 pb-8 transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">
        <div className="max-w-2xl space-y-4">
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Ayush Financial Dashboard</h1>
           
        </div>

        <div className="flex flex-col gap-3 justify-end">
          {isAdminView ? (
            <button
              onClick={() => dispatch(openModal({ type: 'add' }))}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-cyan-500/30 transition hover:opacity-95"
            >
              + Add Transaction
            </button>
          ) : (
            <div className="text-sm uppercase tracking-[0.25em] opacity-60">Switch to admin mode to manage entries</div>
          )}
        </div>
      </div>

      <div className="grid gap-4 mb-10 md:grid-cols-3">
        <div className={`rounded-xl border p-6 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <p className="text-sm uppercase tracking-[0.3em] opacity-60">Total transactions</p>
          <p className="mt-4 text-3xl font-black">{filteredData.length}</p>
          <p className="mt-2 text-sm opacity-70">Current view count after filters and search.</p>
        </div>
        <div className={`rounded-xl border p-6 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <p className="text-sm uppercase tracking-[0.3em] opacity-60">Total income</p>
          <p className="mt-4 text-3xl font-black text-emerald-400">₹{totalIncome.toLocaleString()}</p>
          <p className="mt-2 text-sm opacity-70">Revenue entries in the selected dataset.</p>
        </div>
        <div className={`rounded-xl border p-6 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <p className="text-sm uppercase tracking-[0.3em] opacity-60">Total expense</p>
          <p className="mt-4 text-3xl font-black text-rose-400">₹{totalExpense.toLocaleString()}</p>
          <p className="mt-2 text-sm opacity-70">Operational outflows captured in the dashboard.</p>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.7fr_0.9fr] mb-10">
        <div className={`rounded-xl border ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <div className="flex flex-col gap-4 p-6 md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] opacity-50">Detailed filters</p>
                <h2 className="mt-2 text-2xl font-black">Search and refine transactions</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row items-stretch sm:items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search merchant, status, category"
                  className={`min-w-[220px] rounded-l border px-4 py-3 text-sm outline-none transition ${isDarkMode ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.3em] opacity-60">From</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                  className={`w-full rounded-l border px-4 py-3 text-sm outline-none ${isDarkMode ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-[0.3em] opacity-60">To</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                  className={`w-full rounded-l border px-4 py-3 text-sm outline-none ${isDarkMode ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              {[
                { label: 'Category', key: 'category', options: ['All', 'Food', 'Rent', 'Salary', 'Entertainment', 'Shopping', 'Travel', 'Miscellaneous'] },
                { label: 'Status', key: 'status', options: ['All', 'completed', 'pending', 'failed'] },
                { label: 'Type', key: 'type', options: ['All', 'income', 'expense'] },
                { label: 'Payment Method', key: 'payment_method', options: ['All', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'] },
              ].map((filter) => (
                <label key={filter.key} className="block">
                  <span className="text-[10px] uppercase tracking-[0.35em] opacity-60">{filter.label}</span>
                  <select
                    value={filters[filter.key]}
                    onChange={(e) => { dispatch(setFilter({ [filter.key]: e.target.value })); setCurrentPage(1); }}
                    className={`mt-2 w-full rounded-l
 border px-4 py-3 text-sm outline-none ${isDarkMode ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                  >
                    {filter.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={`rounded-xl border p-6 ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
          <p className="text-xs uppercase tracking-[0.35em] opacity-50">Filter Summary</p>
          <div className="mt-6 space-y-4 text-sm">
            <div className={`flex items-center justify-between rounded-3xl border px-4 py-4 ${isDarkMode ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-slate-50'}`}>
              <span>Active Records</span>
              <strong>{filteredData.length}</strong>
            </div>
            <div className={`flex items-center justify-between rounded-3xl border px-4 py-4 ${isDarkMode ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-slate-50'}`}>
              <span>Income / Expense</span>
              <strong>₹{totalIncome.toLocaleString()} / ₹{totalExpense.toLocaleString()}</strong>
            </div>
            <div className={`rounded-3xl border px-4 py-4 ${isDarkMode ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-slate-50'}`}>
              <p className="text-[11px] uppercase tracking-[0.35em] opacity-50">Current filters</p>
              <p className="mt-3 text-sm leading-relaxed opacity-80">{Object.entries(filters).map(([key, value]) => `${key.replace('_', ' ')}: ${value}`).join(' / ')}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-x-auto rounded-xl border border-current/10 bg-transparent">
        <table className="min-w-[1000px] w-full border-collapse text-sm">
          <thead>
            <tr className={`text-[10px] font-black uppercase tracking-[0.25em] border-b ${isDarkMode ? 'border-white/10 bg-white/5 text-slate-300' : 'border-slate-200 bg-slate-100 text-slate-700'}`}>
              <th className="p-5 text-left">Tx ID</th>
              <th className="p-5 text-left">Date</th>
              <th className="p-5 text-left">Merchant</th>
              <th className="p-5 text-left">Category</th>
              <th className="p-5 text-left">Payment</th>
              <th className="p-5 text-left">Status</th>
              <th className="p-5 text-right">Amount</th>
              {isAdminView && <th className="p-5 text-center">Action</th>}
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={isAdminView ? 8 : 7} className="p-10 text-center text-sm opacity-60">
                  No transactions match the current filters. Adjust search or filter settings to view data.
                </td>
              </tr>
            ) : currentData.map((item) => (
              <tr key={item.id} className={`border-b ${isDarkMode ? 'border-white/10' : 'border-slate-200'} transition-colors hover:bg-blue-500/5`}>
                <td className="p-5 text-[11px] tracking-[0.05em] uppercase opacity-60">{item.id}</td>
                <td className="p-5">{item.date}</td>
                <td className="p-5">
                  <div className="font-semibold">{item.merchant}</div>
                  <p className="text-xs opacity-70">{item.description}</p>
                </td>
                <td className="p-5 text-sm uppercase opacity-80">{item.category}</td>
                <td className="p-5">{item.payment_method}</td>
                <td className="p-5">
                  <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase ${item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : item.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {item.status}
                  </span>
                </td>
                <td className={`p-5 text-right font-black ${item.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {item.type === 'income' ? '+' : '-'} ₹{Number(item.amount).toLocaleString()}
                </td>
                {isAdminView && (
                  <td className="p-5 text-center">
                    <button
                      onClick={() => dispatch(openModal({ type: 'edit', data: item }))}
                      className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition hover:bg-slate-200/10"
                    >
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-xs uppercase tracking-[0.3em] opacity-50">Page {currentPage} / {totalPages}</p>
        <div className="flex items-center gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="rounded-full border px-4 py-3 text-sm transition disabled:opacity-30 hover:bg-blue-600/10"
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="rounded-full border px-4 py-3 text-sm transition disabled:opacity-30 hover:bg-blue-600/10"
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-start pt-20 bg-slate-950/80 px-4 py-8">
          <div className={`w-full max-w-2xl overflow-hidden rounded-xl border p-6 shadow-2xl transition ${isDarkMode ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-current/10">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] opacity-50">{modalType === 'add' ? 'Create transaction' : 'Edit transaction'}</p>
                <h2 className="text-2xl font-black tracking-tight">{modalType === 'add' ? 'New finance entry' : `Edit ${formValues.merchant}`}</h2>
              </div>
              <button
                onClick={() => dispatch(closeModal())}
                className="rounded-full border px-4 py-2 text-sm transition hover:bg-slate-100/10"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] opacity-60">Merchant</span>
                  <input
                    required
                    value={formValues.merchant}
                    onChange={(e) => handleFormChange('merchant', e.target.value)}
                    className={`w-full rounded-l
 border px-4 py-3 text-sm outline-none ${isDarkMode ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] opacity-60">Amount</span>
                  <input
                    required
                    type="number"
                    value={formValues.amount}
                    onChange={(e) => handleFormChange('amount', e.target.value)}
                    className={`w-full rounded-l
 border px-4 py-3 text-sm outline-none ${isDarkMode ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-2 text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] opacity-60">Date</span>
                  <input
                    required
                    type="date"
                    value={formValues.date}
                    onChange={(e) => handleFormChange('date', e.target.value)}
                    className={`w-full rounded-l
 border px-4 py-3 text-sm outline-none ${isDarkMode ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                  />
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] opacity-60">Type</span>
                  <select
                    value={formValues.type}
                    onChange={(e) => handleFormChange('type', e.target.value)}
                    className={`w-full rounded-l
 border px-4 py-3 text-sm outline-none ${isDarkMode ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] opacity-60">Status</span>
                  <select
                    value={formValues.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className={`w-full rounded-l
 border px-4 py-3 text-sm outline-none ${isDarkMode ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="space-y-2 text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] opacity-60">Category</span>
                  <select
                    value={formValues.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className={`w-full rounded-l
 border px-4 py-3 text-sm outline-none ${isDarkMode ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                  >
                    <option>Miscellaneous</option>
                    <option>Food</option>
                    <option>Rent</option>
                    <option>Salary</option>
                    <option>Entertainment</option>
                    <option>Shopping</option>
                    <option>Travel</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] opacity-60">Payment Method</span>
                  <select
                    value={formValues.payment_method}
                    onChange={(e) => handleFormChange('payment_method', e.target.value)}
                    className={`w-full rounded-l
 border px-4 py-3 text-sm outline-none ${isDarkMode ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                  >
                    <option>UPI</option>
                    <option>Credit Card</option>
                    <option>Debit Card</option>
                    <option>Net Banking</option>
                  </select>
                </label>

                <label className="space-y-2 text-sm">
                  <span className="text-xs uppercase tracking-[0.3em] opacity-60">Transaction ID</span>
                  <input
                    disabled={modalType === 'edit'}
                    value={formValues.id || 'Auto generated'}
                    className={`w-full rounded-l
 border px-4 py-3 text-sm outline-none ${isDarkMode ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm">
                <span className="text-xs uppercase tracking-[0.3em] opacity-60">Description</span>
                <textarea
                  rows={4}
                  value={formValues.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className={`w-full rounded-3xl border px-4 py-4 text-sm outline-none resize-none ${isDarkMode ? 'border-white/10 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-900'}`}
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => dispatch(closeModal())}
                  className={`rounded-l border px-5 py-3 text-sm font-semibold transition ${isDarkMode ? 'border-white/10 bg-slate-900 text-white hover:bg-slate-800' : 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-l bg-blue-600 px-5 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                >
                  {modalType === 'add' ? 'Add Transaction' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;