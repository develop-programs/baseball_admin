import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/custom/navbar";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Raipur Netball Association",
    description: "Official portal for Raipur Netball Association",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="light"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navbar />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <footer className="bg-gray-100 py-4 px-4 text-center text-sm text-gray-600">
                        <p>© {new Date().getFullYear()} Raipur Netball Association. All rights reserved.</p>
                    </footer>
                </ThemeProvider>
            </body>
        </html>
    );
}
