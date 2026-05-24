import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axios'

export const fetchEmployees = createAsyncThunk('employees/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/employees', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch employees')
  }
})

export const fetchEmployee = createAsyncThunk('employees/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/employees/${id}`)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch employee')
  }
})

export const createEmployee = createAsyncThunk('employees/create', async (employeeData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/employees', employeeData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create employee')
  }
})

export const updateEmployee = createAsyncThunk('employees/update', async ({ id, ...employeeData }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/employees/${id}`, employeeData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update employee')
  }
})

export const deleteEmployee = createAsyncThunk('employees/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/employees/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete employee')
  }
})

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    employee: null,
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false
        state.employees = action.payload.data.employees
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.employees.unshift(action.payload.data.employee)
        state.total += 1
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        const index = state.employees.findIndex((e) => e.id === action.payload.data.employee.id)
        if (index !== -1) state.employees[index] = action.payload.data.employee
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.employees = state.employees.filter((e) => e.id !== action.payload)
        state.total -= 1
      })
  },
})

export const { clearError } = employeeSlice.actions
export default employeeSlice.reducer