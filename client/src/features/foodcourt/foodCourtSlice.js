import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axios'

export const fetchFoodCourts = createAsyncThunk('foodCourt/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/foodcourt', { params })
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch food courts')
  }
})

export const createFoodCourt = createAsyncThunk('foodCourt/create', async (foodCourtData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/foodcourt', foodCourtData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create food court')
  }
})

export const updateFoodCourt = createAsyncThunk('foodCourt/update', async ({ id, ...foodCourtData }, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/foodcourt/${id}`, foodCourtData)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update food court')
  }
})

export const deleteFoodCourt = createAsyncThunk('foodCourt/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/foodcourt/${id}`)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete food court')
  }
})

const foodCourtSlice = createSlice({
  name: 'foodCourt',
  initialState: {
    foodCourts: [],
    foodCourt: null,
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
      .addCase(fetchFoodCourts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFoodCourts.fulfilled, (state, action) => {
        state.loading = false
        state.foodCourts = action.payload.data.foodCourts
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchFoodCourts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createFoodCourt.fulfilled, (state, action) => {
        state.foodCourts.unshift(action.payload.data.foodCourt)
        state.total += 1
      })
      .addCase(updateFoodCourt.fulfilled, (state, action) => {
        const index = state.foodCourts.findIndex((f) => f.id === action.payload.data.foodCourt.id)
        if (index !== -1) state.foodCourts[index] = action.payload.data.foodCourt
      })
      .addCase(deleteFoodCourt.fulfilled, (state, action) => {
        state.foodCourts = state.foodCourts.filter((f) => f.id !== action.payload)
        state.total -= 1
      })
  },
})

export const { clearError } = foodCourtSlice.actions
export default foodCourtSlice.reducer