# CI/CD Pipeline & Branch Protection

## Overview

This project implements a comprehensive CI/CD pipeline with GitHub Actions and automated branch protection rules to ensure code quality and stability.

## CI/CD Workflow

### 1. CI Workflow (`.github/workflows/ci.yml`)

Runs on every pull request and push to `main`:

**Backend Checks (.NET)**
- ✅ Restore dependencies
- ✅ Verify code formatting (dotnet format)
- ✅ Build solution
- ✅ Run backend tests (xUnit)

**Frontend Checks (Angular)**
- ✅ Install dependencies (npm)
- ✅ ESLint verification
- ✅ Production build
- ✅ Frontend tests (Vitest)

**Status:** All checks must pass before merge

### 2. Deploy Workflow (`.github/workflows/deploy.yml`)

Runs when called by the successful Release Please workflow. It can also be started manually from
the Actions tab for recovery; pushing a tag directly does not deploy:

**Pre-Deployment**
- Re-run all CI checks
- Verify frontend build
- Verify backend tests

**Deployment**
- Build and publish API
- Bundle Angular app into wwwroot
- Deploy to Azure App Service (gamecatalog-ivashchenko)
- Run smoke tests on deployed application

**Post-Deployment**
- Verify application liveness (`/health`)
- Verify database readiness (`/health/ready`)
- Confirm frontend assets load
- Verify API endpoints respond

### 3. Release Workflow (`.github/workflows/release.yml`)

Automated versioning using Release Please:

**Version Strategy**
- `feat:` → Minor version bump (1.0.0 → 1.1.0)
- `fix:` → Patch version bump (1.0.0 → 1.0.1)
- `feat!:` or `BREAKING CHANGE:` → Major version bump (1.0.0 → 2.0.0)
- `docs:`, `chore:`, `test:`, `ci:`, `style:` → No release

**Release Process**
1. Release Please reads commits on `main`
2. Creates/updates release pull request with changelog
3. Merge release PR → triggers version tag and GitHub Release
4. Successful release creation → Release workflow calls Deploy automatically

## Branch Protection Rules

### For `main` Branch

**Status Checks Required** (ALL must pass):
```
✅ ci / Verify formatting
✅ ci / Build and test (backend)
✅ ci / Lint (frontend)
✅ ci / Build (frontend)
✅ ci / Test (frontend)
```

**Additional Protection**
```
✅ Require pull request before merging
✅ Require 1 approval before merge
✅ Dismiss stale reviews on new commits
✅ Require branches up to date before merge
✅ Enforce for administrators
✅ Restrict force pushes
✅ Restrict deletions
```

### What This Means

❌ **Cannot merge** if any check fails  
❌ **Cannot merge** without approval  
❌ **Cannot force push** to main  
❌ **Cannot delete** main branch  
✅ **Must be up-to-date** with latest main  

## Quality Metrics

### Code Quality
- **TypeScript Strict Mode:** Enabled in frontend
- **ESLint:** Strict Angular linting rules
- **dotnet format:** Code formatting verification
- **Test Coverage:** Both frontend and backend tests required

### Performance
- **API Response Time:** < 500ms average
- **Build Time:** ~2-3 minutes total
- **Deploy Time:** ~5 minutes to Azure

### Testing

**Backend Tests**
- Location: `backend/tests/GameCatalog.Api.Tests/`
- Framework: xUnit
- Database: In-memory SQLite (relational behavior)
- Run: `cd backend && dotnet test`

**Frontend Tests**
- Location: `frontend/src/app/**/*.spec.ts`
- Framework: Vitest (via Angular test builder)
- Run: `cd frontend && npm run test:ci`

**Manual Tests**
- UI Test Plan: `docs/tests/ui/TEST_PLAN.md`
- API Test Plan: `docs/tests/api/TEST_PLAN.md`
- API Results: `docs/tests/api/TEST_RESULTS.md`

## Development Workflow

### Creating a Feature

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes following conventional commits
3. Push to GitHub: `git push -u origin feature/feature-name`
4. Create pull request on GitHub
5. CI checks run automatically
6. Request review
7. Merge to `main` (after approval + all checks pass)

### Conventional Commits

Format: `<type>(<scope>): <description>`

**Types:**
- `feat:` New feature (triggers minor version)
- `fix:` Bug fix (triggers patch version)
- `docs:` Documentation only
- `style:` Code style (no logic change)
- `test:` Test additions/changes
- `ci:` CI/CD changes
- `chore:` Build, dependency updates

**Examples:**
```
feat(games): add sorting by release date
fix(api): correct pagination offset calculation
docs: update deployment instructions
ci: improve test timeout handling
```

## Release Process

### Automated Release (Recommended)

1. Merge PRs to `main` with conventional commits
2. Release Please automatically creates release PR
3. Review and merge release PR
4. GitHub Release is created automatically
5. Deploy workflow runs automatically

### Recovery Deployment

Run the Deploy workflow from the GitHub Actions tab. Do not manually create `v*` tags or GitHub
Releases: Release Please owns both, and an existing tag or Release causes the automated release to
fail with a duplicate-version conflict.

## Monitoring & Health Checks

### Health Endpoints

**Liveness Check** (process running)
```
GET https://gamecatalog-ivashchenko.azurewebsites.net/health
Response: 200 OK
```

**Readiness Check** (database connected)
```
GET https://gamecatalog-ivashchenko.azurewebsites.net/health/ready
Response: 200 OK (if DB connected), 503 (if not)
```

### Azure App Service

- **Tier:** Basic (B1) with Always On enabled
- **Database:** Azure SQL Database (Basic tier)
- **Auto Migrations:** Enabled via `Database:MigrateOnStartup`
- **Region:** Canada Central

## Troubleshooting CI Failures

### "ci / Verify formatting" Failed
```bash
cd backend
dotnet format
git add .
git commit -m "style: run dotnet format"
git push
```

### "ci / Build and test" Failed
```bash
cd backend
dotnet test
# Fix failing tests
git add .
git commit -m "test: fix failing unit tests"
git push
```

### "ci / Lint" Failed
```bash
cd frontend
npm run lint
# Fix linting errors (or use --fix if available)
git add .
git commit -m "style: fix linting errors"
git push
```

### "ci / Build" Failed
```bash
cd frontend
npm run build
# Fix build errors
git add .
git commit -m "fix: resolve build errors"
git push
```

### "ci / Test" Failed
```bash
cd frontend
npm run test:ci
# Fix failing tests
git add .
git commit -m "test: fix failing frontend tests"
git push
```

## Best Practices

✅ **Always create a pull request** - Never push directly to `main`  
✅ **Write descriptive commit messages** - Helps with changelog generation  
✅ **Keep commits atomic** - One change per commit  
✅ **Test locally before pushing** - Reduces CI failures  
✅ **Review your own PR first** - Catch obvious issues  
✅ **Wait for all checks to pass** - Don't merge on red  
✅ **Use conventional commits** - Enables automated versioning  

## Future Improvements

- [ ] Add code coverage reporting
- [ ] Add performance regression testing
- [ ] Add accessibility (a11y) testing
- [ ] Add E2E tests with Playwright or Cypress
- [ ] Add security scanning (SAST)
- [ ] Add dependency version checking
- [ ] Add load testing before production deploy

---

**Last Updated:** July 4, 2026  
**Maintained by:** Development Team
