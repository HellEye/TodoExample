# Todo frontend

In this scenario, instead of NextJS I'd use vite for running the app.

NextJS server-side rendering sometimes messes with client side logic.

It's a different story when writing api endpoints in next, having one project for both frontend and backend outweighs the negative/annoying aspects of Next

Same thing if server-side rendering is important.

## Libraries

- Tanstack Query - Async state management for communicating with the backend.
  - Includes caching, request debouncing and a lot of other great features that make any other state library almost unnecessary.
- zustand - client state management (used for auth/tokens in this project)
  - lightweight, fast and easy to use. Especially when using tanstack query, it's more than enough, and better than redux
- Tailwind CSS + class variance authority - Styling
- shadcn-ui - prebuilt customizable+accessible+styled components
  - Built on tailwind
  - tailwind+shadcn could be replaced with any other styling library, especially if speed isn't a concern (other libraries usually have "huge" bundle sizes of over 100kb)
- react-hook-form - form management and validation
  - shadcn-ui has a hook-form specific input component, however it requires a bit of setup, so I just made one manually. In a real project I'd likely use that instead, or make one myself.
- zod - client side form validation (Makes more sense when running nextjs as a backend, allows for reuse of server-side validators in forms)
- lucide react - icons
- dayjs - date formatting

## Running without docker

`npm install`

`npm run dev`

Or yarn/pnpm/bun instead of npm
