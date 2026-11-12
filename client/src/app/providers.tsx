"use client";

import { Provider } from "react-redux";
import { store } from "../store/authStore";
import BlurFadeThemeTransition from "@/components/ui/BlurFadeThemeTransition";

type ProviderProps = {
    children: React.ReactNode
}

export default function Providers({ children }: ProviderProps) {
    return <Provider store={store}>
        <BlurFadeThemeTransition>

            {children}
        </BlurFadeThemeTransition>
    </Provider>
}