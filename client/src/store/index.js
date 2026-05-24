import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import employeeReducer from '../features/employees/employeeSlice'
import brandReducer from '../features/brands/brandSlice'
import outletReducer from '../features/outlets/outletSlice'
import foodCourtReducer from '../features/foodcourt/foodCourtSlice'
import productReducer from '../features/products/productSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    employees: employeeReducer,
    brands: brandReducer,
    outlets: outletReducer,
    foodCourt: foodCourtReducer,
    products: productReducer,
    dashboard: dashboardReducer,
  },
})

export default store