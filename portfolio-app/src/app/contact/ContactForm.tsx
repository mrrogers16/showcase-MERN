"use client";

import { useState } from "react";

export default function ContactForm() {
    // ------------- local state -----------------------------------------
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
    const [errorText, setErrorText] = useState("");

    // ------------- input change handler --------------------------------
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    // ------------- submit handler --------------------------------------
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setStatus("loading");
        setErrorText("");

        try {
            const res = await fetch("/api/contact",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form)
                });

            if (res.ok) {
                setStatus("sent");
                setForm({ name: "", email: "", message: "" });
            }
            else {
                const { error } = await res.json();
                setErrorText(error ?? "Unknown error");
                setStatus("error");
            }
        }
        catch {
            setErrorText("Network error");
            setStatus("error");
        }
    }

    // ------------- render ----------------------------------------------
    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg space-y-6 rounded-2xl bg-white/60 p-8 shadow-lg backdrop-blur-sm dark:bg-gray-800/60"
        >
            <h1 className="text-2xl font-bold">Contact&nbsp;Me</h1>

            {/* Name */}
            <label className="block">
                <span className="mb-1 block font-medium">Name</span>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2
                        text-gray-900 shadow-sm transition
                        focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400
                        dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100
                        dark:focus:border-indigo-400 dark:focus:ring-indigo-500"
                />
            </label>

            {/* Email */}
            <label className="block">
                <span className="mb-1 block font-medium">Email</span>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2
                        text-gray-900 shadow-sm transition
                        focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400
                        dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100
                        dark:focus:border-indigo-400 dark:focus:ring-indigo-500"
                />
            </label>

            {/* Message */}
            <label className="block">
                <span className="mb-1 block font-medium">Message</span>
                <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    maxLength={5000}
                    rows={7}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2
                        text-gray-900 shadow-sm transition
                        focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400
                        dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100
                        dark:focus:border-indigo-400 dark:focus:ring-indigo-500"
                />
            </label>

            {/* Status banner */}
            {status === "sent" && (
                <p className="flex items-center gap-2 rounded-lg bg-emerald-100 p-3 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                    Thanks! Your message has been sent.
                </p>
            )}
            {status === "error" && (
                <p className="flex items-center gap-2 rounded-lg bg-rose-100 p-3 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200">
                    {errorText}
                </p>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center rounded-lg
                    bg-indigo-600 px-6 py-2 font-semibold text-white
                    transition hover:bg-indigo-700 disabled:opacity-50">
                {status === "loading" ? "Sending…" : "Send"}
            </button>
        </form>
    );
}
