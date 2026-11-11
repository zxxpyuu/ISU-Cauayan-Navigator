# ISU Cauayan Campus Navigator

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and add the Supabase project URL and public anon key.
3. Run the app with `npm run dev`.

## Mobile apps (Android and iOS)

This project uses Capacitor to package the same app for Android and iOS. The Android project is in `android/`; the iOS project is in `ios/`.

### Android APK

The dashboard's Quick access section links to the Android APK at `public/downloads/app-debug.apk`; it is served in the deployed app at `/downloads/app-debug.apk`. Install Android Studio with Android SDK Platform 36 and JDK 21. To rebuild the debug APK, run `npm run cap:build:android:apk`; the output is `android/app/build/outputs/apk/debug/app-debug.apk`. Copy the new APK to `public/downloads/app-debug.apk` before deploying so the download link serves the latest build. To open the project in Android Studio, run `npm run cap:open:android`. You can also use `npm run cap:run:android` with a connected Android device or emulator.

### iOS app

iOS builds require a Mac with Xcode. Run `npm run cap:sync`, then `npm run cap:open:ios` to open the Xcode project. Choose a signing team in Xcode to install on a device or archive for TestFlight/App Store. The app asks for location permission because guest access and live location depend on it.

## Supabase setup

1. Create a Supabase project and enable email/password sign-in.
2. Keep email confirmation enabled in Supabase Auth so users must verify their ISU inbox before signing in off campus.
3. Set the Auth Site URL and allowed redirect URLs to the local development address and the deployed Vercel URL.
4. In the Supabase SQL Editor, run [`supabase/enforce-isu-email.sql`](./supabase/enforce-isu-email.sql) to restrict account creation to `@isu.edu.ph` addresses.
5. Copy the project URL and anon/public key into `.env.local` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never put a Supabase service-role key in the frontend.
6. Add those same two environment variables in the Vercel project settings and redeploy.

After sign-in, a confirmed ISU account can use the app from anywhere. Users without a confirmed account can use it as guests while inside the campus outline, after granting browser location access. Geolocation requires HTTPS in production and is approximate; a browser-side GPS check can be spoofed and is not suitable as a tamper-proof security boundary.
