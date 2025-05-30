# Supabase CI/CD Migration Plan

This plan outlines the steps to implement automated Supabase migrations using GitHub Actions for the meal-reviews project.

## To-Do List

### Initial Setup

- [x] Install Supabase CLI globally in CI environment
- [x] Document Supabase access token creation process
- [x] Document how to find project reference ID
- [x] Document setting up repository secrets:
  - [x] `SUPABASE_ACCESS_TOKEN`
  - [x] `SUPABASE_PROJECT_ID`
  - [x] `SUPABASE_DB_PASSWORD`
- [x] Actual setup of repository secrets (to be done by repository owner)

### Migration Workflow

- [x] Create new GitHub Actions workflow file for migrations
- [x] Configure workflow triggers:
  - On push to main (production)
  - On pull request (testing)
- [x] Set up job steps:
  - [x] Install Supabase CLI
  - [x] Link to Supabase project
  - [x] Run migrations
  - [x] Run dry-run migrations for PRs

### Documentation

- [x] Create Supabase secrets setup guide (moved to `docs/supabase-secrets-setup.md`)
- [x] Update project README with migration workflow
- [ ] Add contributing guidelines for database changes
- [ ] Add troubleshooting guide

## Notes

- Need to handle sensitive credentials securely
- Consider implementing migration dry-runs for PRs
