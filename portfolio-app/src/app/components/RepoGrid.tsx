"use client";

import { useState, useMemo } from "react";
import Link                  from "next/link";
import type { RepoSafe }     from "@/app/lib/github";

export default function RepoGrid({ repos }: { repos: RepoSafe[] })
{
    const [query, setQuery] = useState("");

    // memoised filter to avoid re‑render cost on each keystroke
    const filtered = useMemo(() =>
    {
        const q = query.toLowerCase();
        return repos.filter(r => r.name.toLowerCase().includes(q));
    }, [query, repos]);

    return (
    <>
        {/* search bar */}
        <input
            type="search"
            placeholder="Search…"
            className="w-full md:w-1/2 rounded-lg border px-4 py-2 mb-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
        />

        {/* repo cards */}
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map(repo => (
                <li
                    key={repo.name}
                    className="rounded-lg border p-6 flex flex-col transition hover:shadow-lg"
                >
                    <h3 className="text-xl font-semibold text-indigo-500">
                        {repo.name}
                    </h3>

                    <p className="flex-1 mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {repo.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                        {repo.stargazers_count > 0 &&
                            <span>⭐ {repo.stargazers_count}</span>}
                        {repo.forks_count > 0 &&
                            <span>🍴 {repo.forks_count}</span>}
                        {repo.language &&
                            <span>{repo.language}</span>}
                    </div>

                    <div className="mt-6 flex gap-4">
                        <Link href={`/projects/${repo.name}`} className="btn">
                            Details
                        </Link>
                        <a href={repo.html_url} className="btn" target="_blank">
                            Code
                        </a>
                        {repo.homepage &&
                            <a
                                href={repo.homepage}
                                className="btn"
                                target="_blank"
                            >
                                Live
                            </a>}
                    </div>
                </li>
            ))}
        </ul>
    </>
    );
}
