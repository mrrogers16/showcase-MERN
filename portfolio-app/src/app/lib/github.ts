// src/app/lib/github.ts
// ───────────────────────────────────────────────────────────────────────────────
// Octokit setup
// ───────────────────────────────────────────────────────────────────────────────
import { Octokit }      from "@octokit/rest";
import { RequestError } from "@octokit/request-error";

const octo = new Octokit(
{
    auth : process.env.GITHUB_TOKEN         // set this in Vercel → Settings
});

// ───────────────────────────────────────────────────────────────────────────────
// RepoSafe: guarantees numeric fields are never undefined
// ───────────────────────────────────────────────────────────────────────────────
export type RepoSafe =
{
    name             : string;
    html_url         : string;
    homepage        ?: string | null;
    description     ?: string | null;
    language        ?: string | null;
    stargazers_count : number;
    forks_count      : number;
    fork            ?: boolean;              // used only for filtering
};

// ───────────────────────────────────────────────────────────────────────────────
// Convert Octokit repo → RepoSafe
// ───────────────────────────────────────────────────────────────────────────────
function toSafe(repo: any): RepoSafe
{
    return {
        name             : repo.name,
        html_url         : repo.html_url,
        homepage         : repo.homepage,
        description      : repo.description,
        language         : repo.language,
        stargazers_count : repo.stargazers_count ?? 0,
        forks_count      : repo.forks_count      ?? 0,
        fork             : repo.fork
    };
}

// ───────────────────────────────────────────────────────────────────────────────
// Replace any fancy Unicode dash with a plain ASCII "-"
// ───────────────────────────────────────────────────────────────────────────────
function sanitizeUser(raw: string): string
{
    return raw.replace(
        /[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, // all “dash‑ish” chars
        "-"
    ).trim();
}

// ───────────────────────────────────────────────────────────────────────────────
// Public helper
// Call with no arg → uses NEXT_PUBLIC_GITHUB_USER
// Call with arg     → overrides env var
// ───────────────────────────────────────────────────────────────────────────────
export async function getRepos(
    user = process.env.NEXT_PUBLIC_GITHUB_USER ?? ""
): Promise<RepoSafe[]>
{
    user = sanitizeUser(user);

    if (!user)
    {
        throw new Error(
            "GitHub username missing. Pass it to getRepos() or set NEXT_PUBLIC_GITHUB_USER."
        );
    }

    const perPage = 100;
    let   page    = 1;
    let   repos   : RepoSafe[] = [];

    while (true)
    {
        try
        {
            const { data } = await octo.repos.listForUser(
            {
                username : user,
                per_page : perPage,
                page
            });

            repos.push(...data.map(toSafe));

            if (data.length < perPage)
            {
                break;                  // last page reached
            }

            ++page;
        }
        catch (err)
        {
            if (err instanceof RequestError && err.status === 404)
            {
                throw new Error(`GitHub user “${user}” not found.`);
            }

            // re‑throw other API or network errors
            throw err;
        }
    }

    return repos
        .filter(r => !r.fork)           // hide forks
        .sort((a, b) =>
        {
            if (a.stargazers_count !== b.stargazers_count)
            {
                return b.stargazers_count - a.stargazers_count;
            }
            return b.forks_count - a.forks_count;
        });
}
