import Providers from "./providers";
import "@/src/app/globals.css"
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { Toaster } from "../components/ui/toaster";
import { ThemeProvider } from "next-themes";
import AuthInitializer from "./AuthInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export default function RootLayout({
children,
}: {
  children: React.ReactNode;
})
 {
  return (
    <html lang="en"  className={`${geistSans.variable} ${geistMono.variable}  ${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <body>
           <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
        <Providers>
          <AuthInitializer>
          {children}
          <Toaster/>
          </AuthInitializer>
          </Providers>
          </ThemeProvider>
      </body>
    </html>
  );
}