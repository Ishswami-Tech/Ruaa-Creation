# Automatic Vercel deployments

After activation, every contributor's push to `main` runs type checks, commerce tests and the build. If these pass, GitHub Actions builds a production artifact, stages it on Vercel, checks the home, shop, checkout, robots and sitemap URLs, and promotes the same artifact to the live domain. Other branches and pull requests only run verification.

The workflow is `.github/workflows/verify.yml`. Production jobs run serially. Checkout credentials are not persisted, and the deployment token is only supplied to steps that authenticate with Vercel. Commit authors are preserved; no co-authors are added.

## One-time activation

1. Create a Vercel access token scoped to `ishswamitech-1274s-projects` at https://vercel.com/account/settings/tokens. Use an appropriate expiry and rotate it before expiration.
2. In this repository's GitHub Settings → Environments → production, add an environment secret named `VERCEL_TOKEN`. Paste the token directly into GitHub; do not put it in chat, source files or workflow YAML.
3. Set the repository Actions variable `VERCEL_DEPLOY_ENABLED` to `true`, then run **Verify and deploy storefront** from the Actions tab. Subsequent pushes to `main` run automatically.

The team and project variables are configured in the production environment:

- `VERCEL_ORG_ID`: `team_gZnhGiNvZNh8tCbbzHRECptV`
- `VERCEL_PROJECT_ID`: `prj_BiBr9sxkPmnCICYe2BB6DuzglEje`

The production environment allows only the `main` branch. Anyone allowed to push to `main` can trigger a production release; no manual approval is configured. Required-reviewer rules are unavailable on the current GitHub billing plan.

## Current blockers

Activation stays disabled until the token is configured. A Vercel token authenticates the workflow but does not remove account, contributor or billing restrictions. The last corrected deployment was blocked because Vercel could not authorize the commit author. Link GitHub account `aadeshbhujbal` to the Vercel owner account and resolve any remaining account or plan requirements before expecting a successful release.

The live domain is `https://ruaa-creation.vercel.app`. The initial deployment returned 404s because the project used the Other preset; `vercel.json` now explicitly selects Next.js and its `out` export directory. That corrected configuration has not yet passed a hosted deployment because of the account block. The pipeline's staged-page checks prevent a deployment with these 404s from replacing production.
