import { configureStore } from '@reduxjs/toolkit'
import commonSlice from './common.slice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      common: commonSlice
    }
  })
}

// Infer the type of makeStore
export type CommonStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<CommonStore['getState']>
export type CommonDispatch = CommonStore['dispatch']