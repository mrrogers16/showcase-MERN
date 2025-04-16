"use client";

import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/nextjs";

export default function Home()
{
    return (
        <main className="flex flex-col items-center gap-10 px-4 py-16 text-center">
            
            {/* Clerk auth buttons in top-right */}
            <div className="absolute top-6 right-6 flex gap-4">
                <SignInButton />
                <UserButton />
            </div>

            {/* Headline */}
            <section>
                <h1 className="text-4xl font-extrabold tracking-tight">
                    Welcome to My Portfolio
                </h1>
                <p className="mt-3 max-w-xl text-lg text-gray-600 dark:text-gray-300">
                    I’m a full-stack developer building clean, modern web apps using the MERN stack, Vercel, and AWS.
                </p>
            </section>

            {/* CTA buttons */}
            <div className="flex gap-4 flex-col sm:flex-row">
                <Link
                    href="/projects"
                    className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition"
                >
                    View Projects
                </Link>
                <Link
                    href="/contact"
                    className="rounded-lg border border-indigo-600 px-6 py-3 text-indigo-600 font-semibold hover:bg-indigo-50 dark:hover:bg-gray-800 transition"
                >
                    Contact Me
                </Link>
            </div>

            {/* Optional footer */}
            <footer className="mt-20 text-sm text-gray-400 dark:text-gray-600">
                Built with Next.js · Hosted on Vercel
            </footer>
        </main>
    );
}
