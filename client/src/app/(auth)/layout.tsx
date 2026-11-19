import type { Metadata } from "next";
import AuthInitializer from "../AuthInitializer";
import { Header } from "@/src/components/layout/Header";


export default function ExploreLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>
        {/* <AuthInitializer> */}
            <div className="min-h-screen flex flex-col">
                <Header />
                {children}
            </div>
        {/* </AuthInitializer> */}
    </>;
}