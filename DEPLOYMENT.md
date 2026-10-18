# Automatic Vercel deployments

After activation, every contributor's push to `main` runs type checks, commerce tests and the build. If these pass, GitHub Actions builds a production artifact, stages it on Vercel, checks the home, shop, checkout, robots and sitemap URLs, and promotes the same artifact to the live domain. Other branches and pull requests only run verification.

The workflow is `.github/workflows/verify.yml`. Production jobs run serially. Checkout credentials are not persisted, and the deployment token is only supplied to steps that authenticate with Vercel. Commit authors are preserved; no co-authors are added.

Vercel's own Git-triggered deployments are disabled with `git.deploymentEnabled: false` in `vercel.json`. GitHub Actions remains the automatic deployment trigger for `main`, using `VERCEL_TOKEN`. Manual CLI deployments remain available. This setting does not disable Vercel's authorization checks: the token-based deployment can still be blocked by author or plan restrictions. Blocked deployments fail the workflow promptly instead of waiting for the full job timeout.

## One-time activation

1. Create a Vercel access token scoped to `ishswamitech-1274s-projects` at https://vercel.com/account/settings/tokens. Use an appropriate expiry and rotate it before expiration.
2. In this repository's GitHub Settings → Environments → production, add an environment secret named `VERCEL_TOKEN`. Paste the token directly into GitHub; do not put it in chat, source files or workflow YAML.
3. Set the repository Actions variable `VERCEL_DEPLOY_ENABLED` to `true`, then run **Verify and deploy storefront** from the Actions tab. Subsequent pushes to `main` run automatically.

The team and project variables are configured in the production environment:

- `VERCEL_ORG_ID`: `team_gZnhGiNvZNh8tCbbzHRECptV`
- `VERCEL_PROJECT_ID`: `prj_BiBr9sxkPmnCICYe2BB6DuzglEje`

The production environment allows only the `main` branch. Anyone allowed to push to `main` can trigger a production release; no manual approval is configured. Required-reviewer rules are unavailable on the current GitHub billing plan.

## Current deployment setup

Token-based deployments are configured. Vercel's contributor check still applies: the authenticated `ishswami` account is authorised for this project. Preserve commit authorship and do not rewrite history to change it.

The live domain is `https://ruaa-creation.vercel.app`. `vercel.json` selects the Next.js framework and its default `.next` output. The app now includes server routes for Prisma/PostgreSQL and admin access; it is no longer a static export and cannot be deployed by uploading `out`.

Verification uses an isolated PostgreSQL service for admin integration tests before production deployment. No production database secret is supplied to those tests. Follow `ADMIN-SETUP.md` to connect the real database, review/apply the additive migration, import the catalogue and create the owner account. Builds do not migrate or seed a database automatically.
