# Setting Up Supabase CI/CD Secrets

This guide explains how to set up the required secrets for Supabase CI/CD integration with GitHub Actions.

## Required Secrets

The following secrets need to be added to your GitHub repository:

1. `SUPABASE_ACCESS_TOKEN`
2. `SUPABASE_PROJECT_ID`
3. `SUPABASE_DB_PASSWORD`

## Obtaining Secret Values

### SUPABASE_ACCESS_TOKEN

1. Log in to the [Supabase dashboard](https://app.supabase.com)
2. Navigate to your account settings by clicking your profile picture in the bottom left
3. Go to "Access Tokens"
4. Create a new access token with an appropriate name (e.g., "GitHub CI")
5. Copy the generated token immediately (it will only be shown once)

### SUPABASE_PROJECT_ID

1. Log in to the [Supabase dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to the project settings (gear icon)
4. The "Reference ID" is your project ID
5. Copy this ID to use as the `SUPABASE_PROJECT_ID` secret

### SUPABASE_DB_PASSWORD

This is the password you set when creating your Supabase project. If you don't remember it:

1. Log in to the [Supabase dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to Project Settings > Database
4. You can find your database password or reset it if needed

## Adding Secrets to GitHub Repository

1. Navigate to your GitHub repository
2. Go to "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add each of the secrets above with their respective values
5. Once added, the secrets will be available in your GitHub Actions workflows

## Security Considerations

- Never commit these secrets directly to your repository
- Rotate your access tokens periodically
- Use the least privilege principle - only grant the necessary permissions
