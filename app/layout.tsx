import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import ReduxProvider from "@/lib/redux/Provider";

const inter = Inter({
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "EzShopr",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ReduxProvider>
            <html lang="en">
                <body className={`${inter.className} antialiased`}>
                    <Header />
                    <main>{children}</main>
                </body>
            </html>
        </ReduxProvider>
    );
}
