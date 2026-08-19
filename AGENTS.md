<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## ClientFlow AI - Agent Rules

When working on this repository, please adhere to the following project-specific rules:

1. **AI Models**: We use Mistral AI (`@mistralai/mistralai`) for our generative logic, NOT OpenAI. Always assume `MISTRAL_API_KEY` is the standard when modifying backend AI services.
2. **Tech Stack Constraints**: 
   - Frontend: Use React 19, Vite, TanStack Router, TanStack Query, and Tailwind CSS.
   - Backend: Node.js, Express, and Supabase. Do not install massive new ORMs without explicit permission; rely on the Supabase client.
3. **Styling Guidelines**: All UI additions should utilize existing `shadcn/ui` components when possible. Ensure support for both dark and light themes via Tailwind's `dark:` classes.
4. **Environment Variables**: Never hardcode secrets. Always use `import.meta.env` for frontend variables and `env.ts` (using Zod validation) for backend variables.
5. **Git Protocol**: Do not rewrite history on the `main` branch, as this breaks synchronization with integrated platforms.
