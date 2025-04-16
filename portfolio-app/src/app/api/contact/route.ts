import { NextResponse } from "next/server";
import { dbConnect }    from "@/app/lib/mongoose";
import { Contact }      from "@/app/models/Contact";
import xss              from "xss";

/* ---------- Helpers --------------------------------------------------- */

// quick email regex (not perfect RFC 5322 but good enough)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// allow letters, numbers, some punctuation; 100‑char max
const NAME_RE  = /^[\p{L}\p{N} .,'-]{1,100}$/u;

/**
 * Strip any HTML tags / scripts and encode dangerous chars.
 * Using xss library’s default whitelist (no tags allowed).
 */
function sanitise(input: string): string
{
    return xss(input.trim());
}

/* ---------- Route handler -------------------------------------------- */

export async function POST(request: Request)
{
    // 1. Parse JSON body -------------------------------------------------
    let data: { name?: string; email?: string; message?: string };

    try
    {
        data = await request.json();
    }
    catch
    {
        return NextResponse.json(
            { error: "Invalid JSON" },
            { status: 400 }
        );
    }

    // 2. Presence & format checks ---------------------------------------
    const { name, email, message } = data;

    if (!name || !email || !message)
    {
        return NextResponse.json(
            { error: "name, email, and message are required" },
            { status: 422 }
        );
    }

    if (!NAME_RE.test(name))
    {
        return NextResponse.json(
            { error: "Name contains invalid characters or is too long" },
            { status: 422 }
        );
    }

    if (!EMAIL_RE.test(email))
    {
        return NextResponse.json(
            { error: "Invalid email address" },
            { status: 422 }
        );
    }

    if (message.length > 5_000)
    {
        return NextResponse.json(
            { error: "Message exceeds 5 000 characters" },
            { status: 422 }
        );
    }

    // 3. Sanitise to mitigate XSS / NoSQL injection ----------------------
    //    xss() wipes scripts & encodes HTML entities.
    //    Replacing leading "$" prevents malicious Mongo operators.
    const clean = {
        name:    sanitise(name),
        email:   sanitise(email),
        message: sanitise(message).replace(/^\$/, "&#36;")
    };

    // 4. Write to MongoDB -----------------------------------------------
    await dbConnect();
    await Contact.create(clean);

    // 5. Success ---------------------------------------------------------
    return NextResponse.json({ success: true }, { status: 201 });
}
