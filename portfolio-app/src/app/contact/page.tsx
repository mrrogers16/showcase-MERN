import ContactForm from "./ContactForm";

export const metadata =                 // optional SEO tag
{
    title: "Contact | Portfolio"
};

export default function ContactPage()
{
    return (
        <main className="p-6">
            <ContactForm />
        </main>
    );
}
