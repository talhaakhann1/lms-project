"use client";

import { Provider } from "react-redux";
import { store } from "../store/authStore";

type ProviderProps={
    children:React.ReactNode
}

export default function Providers({children}:ProviderProps){
    return <Provider store={store}>{children}</Provider>
}