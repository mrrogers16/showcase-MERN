import { Octokit } from "@octokit/rest";
import { getRepos } from "@/app/lib/github";

const octo = new Octokit({ auth: process.env.GITHUB_TOKEN });

// 6h ISR
export const revalidate = 21600;

// ───────────────────────────────────────────────────────────────────────────────
// 1. Pre-build params
// ───────────────────────────────────────────────────────────────────────────────
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const repos = await getRepos();
  return repos.map((r) => ({ slug: r.name }));
}

// ───────────────────────────────────────────────────────────────────────────────
// 2. Page component
// ───────────────────────────────────────────────────────────────────────────────
type PageProps = {
  params: Promise<Record<string, string>>;
  searchParams?: Promise<Record<string, string>>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const username = process.env.NEXT_PUBLIC_GITHUB_USER!;
  const resolvedParams = await params;

  const { data: repo } = await octo.repos.get({
    owner: username,
    repo: resolvedParams.slug,
  });

  let readmeHTML = "<p>No README available for this repository.</p>"; // Fallback content
  try {
    const { data } = await octo.rest.repos.getReadme({
      owner: username,
      repo: resolvedParams.slug,
      mediaType: { format: "html" },
    });
    readmeHTML = data;
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.error(`Failed to fetch README: ${error.message}`);
    }
    else{
        console.error("Unknown error occurred while fetching README:", error);
    }
  }

  return (
    <article className="prose md:prose-lg mx-auto px-4 py-12">
      <h1>{repo.full_name}</h1>

      <div dangerouslySetInnerHTML={{ __html: readmeHTML }} />

      <hr />

      <p>
        ⭐ <strong>{repo.stargazers_count}</strong> | 🍴{" "}
        <strong>{repo.forks_count}</strong> | Last push:{" "}
        {new Date(repo.pushed_at).toLocaleDateString()}
      </p>

      <p>
        <a href={repo.html_url} target="_blank" className="btn">
          View on GitHub
        </a>
        {repo.homepage && (
          <a href={repo.homepage} target="_blank" className="btn ml-4">
            Live site
          </a>
        )}
      </p>
    </article>
  );
}