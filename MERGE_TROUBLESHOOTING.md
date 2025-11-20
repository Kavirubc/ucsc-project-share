# Pull Request Merge Troubleshooting Guide

This guide helps you understand and resolve common issues that prevent merging pull requests, even if you're a collaborator with merge permissions.

## Why Can't I Merge My Pull Request?

Even as a collaborator with merge permissions, your PR may be blocked from merging due to:

1. **Failed Status Checks** - CI/CD checks must pass
2. **Unsigned Commits** - All commits must be signed
3. **Branch Protection Rules** - Additional requirements set by repository admins
4. **Deployment Authorization** - External services (like Vercel) require authorization

## Common Issues and Solutions

### 1. Failed Vercel Deployment Check ⚠️

**Issue**: You see "Authorization required to deploy" from Vercel

**Why this happens**: 
- Vercel needs authorization to deploy from your forked repository
- This is a common issue when PRs come from forks

**How to fix**:
1. **Ask the repository owner** to authorize the Vercel deployment
   - The owner needs to visit their Vercel dashboard
   - Navigate to the project settings
   - Authorize deployments from contributors' forks

2. **Alternative**: Request that the repository owner:
   - Pulls your branch locally
   - Pushes it to a branch on the main repository (not a fork)
   - This allows Vercel to deploy without additional authorization

### 2. Unsigned Commits 🔐

**Issue**: PR is blocked due to unsigned commits

**Check if your commits are signed**:
```bash
# View commit signatures
git log --show-signature
```

**Fix unsigned commits**:

If you haven't set up commit signing yet, see [CONTRIBUTING.md](CONTRIBUTING.md#1-commit-signing-policy) for detailed setup instructions.

If you already have signing configured but your existing commits aren't signed:

```bash
# Checkout your PR branch
git checkout your-branch-name

# Sign all commits retroactively
git rebase --exec 'git commit --amend --no-edit -n -S' -i origin/main

# Force push the signed commits
git push --force-with-lease
```

### 3. Other Failed Status Checks ❌

**Issue**: Build, lint, or test checks are failing

**How to fix**:
1. Check the details of the failed check by clicking on it in the PR
2. Run the checks locally:
   ```bash
   pnpm install      # Install dependencies
   pnpm lint         # Run linting
   pnpm build        # Build the project
   ```
3. Fix any issues and push the changes
4. The checks will run automatically on your new commits

### 4. Branch Protection Rules 🛡️

**Issue**: Branch protection requires specific approvals or checks

**Requirements to check**:
- Review approvals needed
- Status checks that must pass
- Branch must be up to date with base branch

**How to fix**:
1. **Get required reviews**: Request reviews from maintainers
2. **Update your branch** if it's behind:
   ```bash
   git checkout your-branch-name
   git fetch origin
   git rebase origin/main
   git push --force-with-lease
   ```
3. **Wait for status checks** to complete

## Quick Diagnostic Checklist

Use this checklist to diagnose your merge blocker:

- [ ] Are all status checks passing? (Look for green checkmarks)
- [ ] Are all commits signed? (`git log --show-signature`)
- [ ] Is your branch up to date with the base branch?
- [ ] Do you have the required number of approvals?
- [ ] Are there any merge conflicts?
- [ ] Is there a deployment authorization issue?

## Common Status Check States

| Status | Meaning | Action |
|--------|---------|--------|
| ✅ Success | Check passed | No action needed |
| ❌ Failure | Check failed | Fix the issue and push again |
| ⏳ Pending | Check is running | Wait for completion |
| ⚠️ Required | Waiting for check | Check will run automatically |

## Getting Help

If you've followed this guide and still cannot merge:

1. **Check the PR conversation** - Look for bot comments explaining the blocker
2. **Review the PR status section** - GitHub shows merge blockers at the bottom of the PR
3. **Ask the maintainers** - Leave a comment on your PR explaining what you've tried
4. **Check the Actions tab** - View detailed logs of failed workflows

## For Repository Maintainers

To help collaborators merge successfully:

### Enable Fork Deployments in Vercel
1. Go to your Vercel project settings
2. Navigate to Git settings
3. Enable "Deploy Previews" for pull requests from forks
4. Configure deployment authorization as needed

### Review Branch Protection Rules
Consider if your branch protection rules are appropriate:
- Too strict: Blocks legitimate PRs
- Too loose: May allow problematic code

### Communicate Requirements
- Keep CONTRIBUTING.md up to date
- Document all merge requirements clearly
- Add a PR template that lists requirements

## Additional Resources

- [GitHub Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Commit Signing Setup](CONTRIBUTING.md#1-commit-signing-policy)
- [Vercel Deployment Documentation](https://vercel.com/docs/deployments/overview)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Note**: This repository requires all commits to be signed. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions.
