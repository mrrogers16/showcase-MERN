"use client";

import { useState } from "react";

export default function ContactForm()
{
    // ------------- local state -----------------------------------------
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
    const [errorText, setErrorText] = useState("");

    // ------------- input change handler --------------------------------
    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)
    {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    // ------------- submit handler --------------------------------------
    async function handleSubmit(e: React.FormEvent)
    {
        e.preventDefault();

        setStatus("loading");
        setErrorText("");

        try
        {
            const res = await fetch("/api/contact",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok)
            {
                setStatus("sent");
                setForm({ name: "", email: "", message: "" });
            }
            else
            {
                const { error } = await res.json();
                setErrorText(error ?? "Unknown error");
                setStatus("error");
            }
        }
        catch
        {
            setErrorText("Network error");
            setStatus("error");
        }
    }

    // ------------- render ----------------------------------------------
    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-lg space-y-4 rounded-lg border p-6 shadow"
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
                    className="w-full rounded border px-3 py-2"
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
                    className="w-full rounded border px-3 py-2"
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
                    className="w-full rounded border px-3 py-2"
                />
            </label>

            {/* Status banner */}
            {status === "sent" && (
                <p className="rounded bg-green-100 p-2 text-green-800">
                    Thanks! Your message has been sent.
                </p>
            )}
            {status === "error" && (
                <p className="rounded bg-red-100 p-2 text-red-800">
                    {errorText}
                </p>
            )}

            <button
                type="submit"
                disabled={status === "loading"}
                className="rounded bg-indigo-600 px-4 py-2 font-medium text-white disabled:opacity-50"
            >
                {status === "loading" ? "Sending…" : "Send"}
            </button>
        </form>
    );
}
