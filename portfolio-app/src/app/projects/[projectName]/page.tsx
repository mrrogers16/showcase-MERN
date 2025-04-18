import { Octokit } from "@octokit/rest";
import { notFound } from "next/navigation";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

type PageProps = {
    params: { projectName: string };
};

export default async function ProjectDetailPage({ params }: PageProps)
{
    const { projectName } = params;
    const owner = process.env.NEXT_PUBLIC_GITHUB_USER as string;

    if (!owner || !process.env.GITHUB_TOKEN)
    {
        console.error("Missing GitHub credentials in environment variables.");
        return notFound();
    }

    try
    {
        const { data: repo } = await octokit.repos.get({
            owner,
            repo: projectName,
        });

        let readmeContent = "No README available.";

        try
        {
            const { data: readme } = await octokit.repos.getReadme({
                owner,
                repo: projectName,
            });

            const buff = Buffer.from(readme.content, "base64");
            readmeContent = buff.toString("utf-8");
        }
        catch
        {
            // Silent fallback if no README found
        }

        return (
            <main className="max-w-4xl mx-auto p-8">
                <h1 className="text-3xl font-bold text-indigo-600 mb-4">
                    {repo.name}
                </h1>

                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {repo.description || "No description available."}
                </p>

                <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm overflow-x-auto">
                    {readmeContent}
                </pre>
            </main>
        );
    }
    catch (error)
    {
        console.error("Error loading repo:", error);
        return notFound();
    }
}
