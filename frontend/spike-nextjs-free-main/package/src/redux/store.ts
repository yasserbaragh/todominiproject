import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./features/auth-slice"
import taskReducer from "./features/taskSlice"
import statReducer from "./features/statsSlice"
import { TypedUseSelectorHook, useSelector } from 'react-redux'

export const store = configureStore({
    reducer: {
        authReducer,
        taskReducer,
        statReducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector