import ContactForm from "./ContactForm";

export const metadata =                 // optional SEO tag
{
    title: "Contact | Portfolio"
};

export default function ContactPage() {
    return (
        <main className="flex flex-col items-center gap-10 px-4 py-16">
            {/* Simple hero headline */}
            <section className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight">
                    Get&nbsp;in&nbsp;Touch
                </h1>
                <p className="mt-3 max-w-xl text-lg text-gray-600">
                    Whether you’d like to collaborate, have a question,
                    or just want to say hello—drop me a message below.
                </p>
            </section>

            {/* The form itself */}
            <ContactForm />
        </main>
    );
}
