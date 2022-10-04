import { configureStore } from '@reduxjs/toolkit'
import { adminLoginReducer } from '../reducers/adminReducer';

const rootReducer = {
    adminLogin: adminLoginReducer
}

const store = configureStore({
    reducer: rootReducer,
})

export default store;