import { Schema, model, models } from "mongoose";

/*
    One “Contact Me” submission.

    Required:
    - name      Visitor’s name
    - email     Visitor’s email
    - message   Their inquiry (max 5 000 chars)

    Optional:
    - read      You can toggle this in an admin UI later
*/
const ContactSchema = new Schema(
{
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true, maxlength: 5_000 },
    read:    { type: Boolean, default: false }
},
{
    timestamps: true            // adds createdAt & updatedAt
});

// Hot‑reload guard for Next.js dev server
export const Contact =
    models.Contact || model("Contact", ContactSchema);
