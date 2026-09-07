# Domain: auth

## What it solves

User login via social OAuth (Google, GitHub). Wraps `better-auth` so UI never calls `authClient` directly except via `AuthService`.

## Location

`src/domains/auth/` + views `src/views/auth/*` + routes `app/(auth)/*`

## Structure

```
auth/
  api/auth.service.ts        # AuthService — signInGoogle, signInGithub
  components/
    AuthCard.tsx, AuthLayout.tsx, SignInForm.tsx, AuthErrorCard.tsx, SocialLogin.tsx
  index.ts
```

## Components / API

- **Components:** `SocialLogin` renders Google/GitHub buttons as the primary authentication method. `SignInForm` wraps `SocialLogin` inside an `AuthCard`.
- **API:** `AuthService` delegates to `authClient.signIn.social` for both Google and GitHub OAuth.

## Dependencies

- External: `better-auth`
- Internal: `src/lib/auth/auth-client.ts`, `src/constants/routes.ts`
- Other domains: none

## Routes using it

- `/sign-in` -> `SignInPage` -> `SignInForm` -> `SocialLogin` -> `AuthService.signInGoogle/Github`
- `/auth/error` -> `AuthErrorPage` -> `AuthErrorCard`

## External systems

- Backend auth endpoints via `NEXT_PUBLIC_API_URL` (better-auth server) + OAuth providers (Google, GitHub).
