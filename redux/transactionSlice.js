import { createSlice } from '@reduxjs/toolkit';

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    data: [],
    filters: { category: 'All', status: 'All', type: 'All', payment_method: 'All' },
  },
  reducers: {
    setInitialData: (state, action) => {
      state.data = action.payload.map(t => {
        const category = t.merchant === 'Swiggy' ? 'Food' : 
                         t.merchant === 'Landlord' ? 'Rent' :
                         t.merchant === 'Employer' ? 'Salary' :
                         t.merchant === 'Netflix' ? 'Entertainment' :
                         t.merchant === 'Amazon' ? 'Shopping' :
                         t.merchant === 'Uber' ? 'Travel' : 'Miscellaneous';
        
        const type = t.merchant === 'Employer' ? 'income' : 'expense';
        const description = t.description || `${t.merchant} transaction for ${category}`;

        return { ...t, category, type, description };
      });
    },
    addTransaction: (state, action) => {
      state.data.unshift({ ...action.payload, id: Date.now() });
    },
    editTransaction: (state, action) => {
      const index = state.data.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.data[index] = { ...action.payload };
      }
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    }
  }
});

export const { setInitialData, addTransaction, editTransaction, setFilter } = transactionSlice.actions;
export default transactionSlice.reducer;