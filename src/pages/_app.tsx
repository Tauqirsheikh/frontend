import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

export default function App({
    Component,
    pageProps,
}: AppProps) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                <Component {...pageProps} />
                <Toaster position="top-right" richColors />
            </AuthProvider>
        </ThemeProvider>
    );
}