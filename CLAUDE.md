# CollegeOra Frontend

## Tech Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Fonts:** Plus Jakarta Sans (headlines), Manrope (body), Space Grotesk (labels)
- **Design System:** Material Design 3 color tokens (defined in `src/app/globals.css`)

## Commands
```sh
npm run dev    # Start dev server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Project Structure
```
src/
  app/          # App Router pages & layouts
  components/   # Shared components
  lib/          # Utilities & helpers
```

## Conventions
- Components use PascalCase filenames: `MyComponent.tsx`
- Utilities use kebab-case: `my-helper.ts`
- All database changes go through `sql/` migration files (numbered: 001-, 002-, etc.)
- Never make manual schema changes in Supabase dashboard
- Use the Supabase server client (`src/lib/supabase/server.ts`) in Server Components and API routes
- Use the Supabase browser client (`src/lib/supabase/client.ts`) only in Client Components

## Environments
| Env | Branch | Database |
|---|---|---|
| INT | `develop` | collegeora-int |
| UAT | `staging` | collegeora-uat |
| PROD | `main` | collegeora-prod |

## Design Reference
Onboarding screen designs are in `Screens for onboarding/` (PNG screenshots + HTML prototypes).

## Knowledge Graph
A Graphify knowledge graph is maintained at `graphify-out/`.
- For architecture questions, read `graphify-out/GRAPH_REPORT.md` first
- For dependency lookups, query `graphify-out/graph.json`
- Do NOT re-read entire directories when the graph can answer your question
- The graph is auto-updated on merge to develop via CI

## Git Workflow
- Never commit directly to `main`, `staging`, or `develop`
- Create feature branches: `feature/<issue-number>-<short-description>`
- PRs are reviewed by Claude PR Reviewer and Claude Security Scanner
- Flow: feature branch → develop → staging → main
