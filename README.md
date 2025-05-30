# Meal Reviews

A Vue 3 application for reviewing meals, built with Vite, TypeScript, and Supabase.

## Features

- User authentication (sign up, login, profile management)
- Meal management (create, read, update, delete)
- TypeScript support
- Responsive design

## Prerequisites

- Node.js 18+ and npm
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Docker (for local Supabase development)

## Development Setup

1. **Clone the repository**

   ```sh
   git clone <repository-url>
   cd meal-reviews
   ```

2. **Install dependencies**

   ```sh
   npm install
   ```

3. **Set up local Supabase**

   Start the local Supabase instance:

   ```sh
   npm run supabase-up
   ```

   This will start a local Supabase instance with Docker and apply all migrations from the `supabase/migrations` directory.

4. **Configure environment variables**

   Copy the example environment file:

   ```sh
   cp example.env .env
   ```

   The local Supabase URL and anon key will be displayed after running `supabase-up`. Update `.env` with these values. Also add the service role key:

   ```env
   VITE_SUPABASE_URL='http://127.0.0.1:54321'
   VITE_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

5. **Create a test user**

   ```sh
   npm run create-test-user
   ```

   This will create a test user with the following credentials:
   - Email: test@testperson.com
   - Password: password123

6. **Generate TypeScript types**

   ```bash
   npm run generate-types
   ```

   This will generate TypeScript types from your Supabase schema.

6. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:5173](http://localhost:5173)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test:unit` - Run unit tests
- `npm run lint` - Lint and fix files
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types
- `npm run generate-types` - Generate Supabase TypeScript types
- `npm run supabase-up` - Start local Supabase
- `npm run supabase-reset` - Reset local Supabase database

## Project Structure

```txt
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Vue components
│   ├── lib/             # Shared utilities
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia stores
│   ├── types/           # TypeScript type definitions
│   └── views/           # Vue views/pages
├── supabase/
│   └── migrations/      # Database migrations
└── public/             # Public static files
```

## Database Schema

### Tables

- `auth.users` - Managed by Supabase Auth
- `user_profiles` - Extended user information
  - Links to `auth.users`
  - Stores username, full name, and avatar URL
- `meals` - Meal reviews
  - Links to `auth.users` via `created_by`
  - Stores meal name and description

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Submit a pull request

## License

MIT

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
