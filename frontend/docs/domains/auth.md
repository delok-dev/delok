# Domain: auth

## What it solves

User registration, login, email verification, password reset, and social OAuth. Wraps `better-auth` so UI never calls `authClient` directly except via `AuthService`.

## Location

`src/domains/auth/` + views `src/views/auth/*` + routes `app/(auth)/*`

## Structure

```
auth/
  api/auth.service.ts        # AuthService — signUp, signIn, requestPasswordReset, resetPassword, resendVerification, signInGoogle/Github
  components/
    AuthCard.tsx, AuthLayout.tsx, SignUpForm.tsx, SignInForm.tsx,
    ForgotPasswordForm.tsx, ResetPasswordForm.tsx, ResendVerificationForm.tsx,
    VerifyEmailCard.tsx, EmailVerifiedCard.tsx, AuthErrorCard.tsx, SocialLogin.tsx
  hooks/
    useSignUp.ts, useSignIn.ts, useForgotPassword.ts, useResetPassword.ts, useResendVerification.ts
  schemas/
    auth.schema.ts (passwordSchema, signInSchema, forgotPasswordSchema, resetPasswordSchema)
    sign-up.schema.ts (signUpSchema)
  types/auth.type.ts         # SignUpForm, SignInForm, ResetPasswordForm inferred from schemas
  index.ts
```

## Components / Hooks / Schemas / Types / API

- **Components:** Forms use `react-hook-form` + `zodResolver`. `SocialLogin` renders Google/GitHub buttons.
- **Hooks:** Each form has a hook (e.g., `useSignUp`) that calls `AuthService` and handles toasts/navigation.
- **Schemas:** `passwordSchema` requires 8-128 chars, uppercase, lowercase, number, special char. `signUpSchema` requires name ≥3, email, password+confirm.
- **Types:** Inferred via `z.infer<typeof schema>`.
- **API:** `AuthService` delegates to `authClient.signUp.email`, `authClient.signIn.email`, `authClient.requestPasswordReset`, `authClient.resetPassword`, `authClient.signIn.social`, plus raw `fetch POST /api/auth/resend-verification`.

## Dependencies

- External: `better-auth`, `zod`, `react-hook-form`, `@hookform/resolvers`
- Internal: `src/lib/auth/auth-client.ts`, `src/constants/routes.ts`, `src/utils/api-error.ts`, `src/hooks/useCooldown.ts`
- Other domains: none

## Routes using it

- `/sign-up` -> `SignUpPage` -> `SignUpForm` -> `useSignUp` -> `AuthService.signUp`
- `/sign-up/verify-email` -> `VerifyEmailPage` -> `ResendVerificationForm`
- `/sign-up/verified` -> `EmailVerifiedPage`
- `/sign-in` -> `SignInPage` -> `SignInForm` -> `useSignIn`
- `/sign-in/forgot-password` -> `ForgotPasswordPage`
- `/sign-in/reset-password` -> `ResetPasswordPage` (reads `?token`)
- `/auth/error` -> `AuthErrorPage`

## External systems

- Backend auth endpoints via `NEXT_PUBLIC_API_URL` (better-auth server) + OAuth providers (Google, GitHub).
