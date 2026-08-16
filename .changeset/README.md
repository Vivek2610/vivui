# Changesets

This folder contains [changesets](https://github.com/changesets/changesets) — small
markdown files describing semver-relevant changes.

## Workflow

1. After making changes, run:
   ```bash
   pnpm changeset
   ```
2. Pick the bump type (patch / minor / major) and write a one-line summary.
3. Commit the generated `.md` file alongside your code change.

When the PR is merged to `main`, the **Release** workflow:

- Opens (or updates) a "Version Packages" PR that bumps `package.json` + writes `CHANGELOG.md`.
- When that PR is merged, runs `pnpm changeset publish` to push to npm.
