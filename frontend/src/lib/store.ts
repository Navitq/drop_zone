import { configureStore } from '@reduxjs/toolkit'
import userReducer from '@/redux/userReducer'
import modalReducer from '@/redux/modalReducer'

export const makeStore = () => {
  return configureStore({
    reducer: {
        user: userReducer,
        modal: modalReducer,
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
