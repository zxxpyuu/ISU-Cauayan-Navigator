# ISU Cauayan Campus Navigator

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and add the Supabase project URL and public anon key.
3. Run the app with `npm run dev`.

## Supabase setup

1. Create a Supabase project and enable email/password sign-in.
2. Enable email confirmation in the Supabase Auth settings.
3. Set the Auth Site URL and allowed redirect URLs to the local development address and the deployed Vercel URL.
4. In the Supabase SQL Editor, run [`supabase/enforce-isu-email.sql`](./supabase/enforce-isu-email.sql) to restrict account creation to `@isu.edu.ph` addresses.
5. Copy the project URL and anon/public key into `.env.local` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never put a Supabase service-role key in the frontend.
6. Add those same two environment variables in the Vercel project settings and redeploy.

After sign-in, a confirmed ISU account can use the app from anywhere. Users without a confirmed account can use it as guests while inside the campus outline, after granting browser location access. Geolocation requires HTTPS in production and is approximate; a browser-side GPS check can be spoofed and is not suitable as a tamper-proof security boundary.
