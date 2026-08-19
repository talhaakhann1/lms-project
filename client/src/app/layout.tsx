import Providers from "./providers";
import "@/src/app/globals.css"
import { Outfit } from "next/font/google";
import { Toaster } from "../components/ui/toaster";
import { ThemeProvider } from "next-themes";
import AuthInitializer from "./AuthInitializer";

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
    <html lang="en"  className={`${outfit.variable} h-full antialiased`} suppressHydrationWarning>
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