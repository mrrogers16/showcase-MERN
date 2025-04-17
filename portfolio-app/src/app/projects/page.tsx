import { getRepos } from "@/app/lib/github";
import RepoGrid     from "@/app/components/RepoGrid";

export const revalidate = 60 * 60 * 6;   // 6 h ISR

export default async function ProjectsPage()
{
    // server‑side fetch with PAT stays secret
    const repos = await getRepos();      // uses env var or arg

    return (
    <section className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6">
            Projects
        </h1>

        {/* client component handles search/filter UI */}
        <RepoGrid repos={repos} />
    </section>
    );
}
