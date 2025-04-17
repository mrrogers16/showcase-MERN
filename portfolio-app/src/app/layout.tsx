import type { Metadata } from "next";
import { ClerkProvider }   from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";                 // ← NEW

import "./globals.css";

const geistSans = Geist(
{
    variable : "--font-geist-sans",
    subsets  : ["latin"]
});

const geistMono = Geist_Mono(
{
    variable : "--font-geist-mono",
    subsets  : ["latin"]
});

export const metadata: Metadata =
{
    title       : "Portfolio Next App",
    description : "A portfolio app built with Next.js"
};

export default function RootLayout(
{
    children
} : Readonly<{ children: React.ReactNode }>)
{
    return (
    <ClerkProvider>
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                {/* ────────────────────── Header / Navigation ─────────────────── */}
                <header className="h-16 flex items-center px-6 shadow-sm">
                    <nav className="flex gap-6">
                        <Link
                            href="/"
                            className="text-sm font-medium hover:text-indigo-600"
                        >
                            Home
                        </Link>

                        <Link
                            href="/projects"
                            className="text-sm font-medium hover:text-indigo-600"
                        >
                            Projects
                        </Link>
                    </nav>

                    {/* Spacer pushes auth controls to far right */}
                    <div className="flex-1" />

                    {/* Future: Clerk auth controls
                        <SignedOut>
                            <SignInButton />
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    */}
                </header>

                {/* ────────────────────── Page Content ────────────────────────── */}
                {children}
            </body>
        </html>
    </ClerkProvider>
    );
}
