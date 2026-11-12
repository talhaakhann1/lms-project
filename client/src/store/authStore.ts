import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import enrollmentReducer from "./enrollmentSlice";

export const store=configureStore({
    reducer:{
        auth:authSlice,
         enrollment: enrollmentReducer,
    }
})

export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch




