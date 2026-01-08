# React Native Jumpstart

A production-ready React Native starter template following 2026 best practices. Built with Expo, Supabase, NativeWind, and RevenueCat.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Configuration Guide](#configuration-guide)
  - [1. Supabase Setup](#1-supabase-setup)
  - [2. RevenueCat Setup](#2-revenuecat-setup)
  - [3. Sentry Setup](#3-sentry-setup)
  - [4. PostHog Setup](#4-posthog-setup)
- [Understanding the Architecture](#understanding-the-architecture)
  - [State Management](#state-management)
  - [Authentication Flow](#authentication-flow)
  - [Payment Flow](#payment-flow)
  - [Styling with NativeWind](#styling-with-nativewind)
  - [Internationalization](#internationalization)
- [Development](#development)
- [Building & Deployment](#building--deployment)
- [Troubleshooting](#troubleshooting)

---

## Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| Framework | Expo SDK 54+ | Zero-config React Native with New Architecture |
| Navigation | Expo Router v4 | File-based routing with typed routes |
| Backend | Supabase | PostgreSQL, Auth, Real-time, Edge Functions |
| Styling | NativeWind v4 | Tailwind CSS for React Native |
| State (Client) | Zustand | Lightweight state management |
| State (Server) | TanStack Query v5 | Data fetching and caching |
| Auth | Supabase Auth | Email, Google, Apple authentication |
| Payments | RevenueCat | Cross-platform in-app purchases |
| Forms | React Hook Form + Zod | Type-safe form validation |
| Error Tracking | Sentry | Crash reporting and monitoring |
| Analytics | PostHog | Product analytics and feature flags |
| i18n | i18next | Internationalization |
| CI/CD | EAS Build + GitHub Actions | Cloud builds and deployments |

---

## Features

### Authentication
- Email/password sign up and login
- Magic link (passwordless) authentication
- Google OAuth
- Apple OAuth (required for iOS apps with third-party login)
- Password reset flow
- Protected routes with automatic redirects
- Secure token storage using `expo-secure-store`

### Payments
- RevenueCat integration for iOS and Android
- Subscription management
- Purchase restoration
- Entitlement checking
- Beautiful paywall modal

### UI Components
Built with NativeWind (Tailwind CSS for React Native):
- **Button** - Multiple variants (primary, secondary, outline, ghost, destructive)
- **Input** - Form input with validation states
- **Card** - Content container with variants
- **FormInput** - React Hook Form integrated input

### State Management
- **Zustand** for client state (auth, app settings, theme)
- **TanStack Query** for server state (data fetching, caching, background refetch)
- **Persist middleware** for offline support

### Error Tracking (Sentry)
- Native crash reporting for iOS and Android
- JavaScript error tracking
- Performance monitoring
- User context for debugging
- Session replay

### Analytics (PostHog)
- Automatic screen tracking
- Custom event logging
- User identification
- Feature flags for gradual rollouts
- Funnels and retention analysis

### Internationalization
- i18next with expo-localization
- English and Spanish translations included
- Easy to add new languages
- RTL support ready

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/react-native-jumpstart.git
cd react-native-jumpstart

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the development server
npm start
```

---

## Project Structure

```
react-native-jumpstart/
├── app/                          # Expo Router pages (file-based routing)
│   ├── (auth)/                   # Auth screens (login, register, forgot-password)
│   ├── (tabs)/                   # Main tab screens (home, profile, settings)
│   ├── (modals)/                 # Modal screens (paywall)
│   └── _layout.tsx               # Root layout with providers
├── src/
│   ├── components/
│   │   ├── ui/                   # Base UI components (Button, Input, Card)
│   │   └── forms/                # Form components (FormInput)
│   ├── lib/                      # Library configurations
│   │   ├── supabase.ts           # Supabase client setup
│   │   ├── revenuecat.ts         # RevenueCat setup
│   │   ├── sentry.ts             # Sentry initialization
│   │   ├── posthog.ts            # PostHog analytics
│   │   └── queryClient.ts        # TanStack Query setup
│   ├── stores/                   # Zustand stores
│   │   ├── auth.store.ts         # Auth state
│   │   └── app.store.ts          # App settings (theme, language)
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.ts            # Authentication hook
│   │   ├── useSubscription.ts    # Subscription status hook
│   │   └── useColorScheme.ts     # Theme hook
│   ├── utils/                    # Utility functions
│   ├── constants/                # App constants
│   ├── i18n/                     # Translations
│   │   ├── index.ts              # i18next configuration
│   │   └── locales/              # Language files (en.json, es.json)
│   └── types/                    # TypeScript types
├── assets/                       # Images and fonts
├── .github/workflows/            # CI/CD workflows
├── .env.example                  # Environment variables template
├── tailwind.config.js            # NativeWind/Tailwind configuration
├── eas.json                      # EAS Build configuration
└── package.json
```

---

## Configuration Guide

### 1. Supabase Setup

Supabase provides your backend: database, authentication, and real-time subscriptions.

#### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: Your app name (e.g., "my-awesome-app")
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"** and wait ~2 minutes

#### Step 2: Get Your API Keys

1. In your project dashboard, go to **Settings** (gear icon) → **API**
2. Copy these values to your `.env` file:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- **Project URL**: Your unique Supabase URL
- **anon/public key**: Safe to use in client-side code (protected by Row Level Security)

#### Step 3: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. **Email** should be enabled by default
3. Configure options:
   - ✅ Enable email confirmations (recommended for production)
   - ✅ Enable password recovery

#### Step 4: Setup Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services** → **Credentials**
4. Click **"Create Credentials"** → **"OAuth client ID"**
5. Configure consent screen if prompted
6. For **Application type**, choose:
   - **Web application** (for Supabase callback)
7. Add authorized redirect URI:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
8. Copy **Client ID** and **Client Secret**
9. In Supabase: **Authentication** → **Providers** → **Google**
   - Enable Google provider
   - Paste Client ID and Client Secret
   - Save

#### Step 5: Setup Apple OAuth (Required for iOS)

If your iOS app offers any third-party login (Google, Facebook, etc.), Apple requires you to also offer Sign in with Apple.

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. **Certificates, Identifiers & Profiles** → **Identifiers**
3. Create or select your App ID
4. Enable **Sign In with Apple** capability
5. Create a **Services ID** for web authentication:
   - Register a new Services ID
   - Enable Sign In with Apple
   - Configure domains and return URLs:
     ```
     Domain: YOUR_PROJECT_ID.supabase.co
     Return URL: https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
     ```
6. Create a **Key** for Sign In with Apple:
   - Download the `.p8` key file
   - Note the Key ID
7. In Supabase: **Authentication** → **Providers** → **Apple**
   - Enable Apple provider
   - Enter your Team ID, Key ID, and upload the `.p8` key
   - Save

#### Step 6: Create Database Tables (Optional)

If you need custom tables, go to **SQL Editor** and run your migrations:

```sql
-- Example: Create a profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
```

---

### 2. RevenueCat Setup

RevenueCat handles in-app purchases and subscriptions across iOS and Android.

#### Step 1: Create a RevenueCat Account

1. Go to [revenuecat.com](https://www.revenuecat.com) and sign up
2. Create a new **Project**

#### Step 2: Setup iOS App

1. In RevenueCat, go to your project → **Apps** → **+ New App**
2. Select **App Store** as the platform
3. Fill in:
   - **App name**: Your iOS app name
   - **Bundle ID**: Must match your `app.json` (e.g., `com.yourcompany.yourapp`)
4. Connect to App Store Connect:
   - You'll need your **App Store Connect API Key** (created in App Store Connect → Users and Access → Keys)
   - Upload the `.p8` key file
5. Copy the **Public API Key** for iOS

#### Step 3: Setup Android App

1. In RevenueCat → **Apps** → **+ New App**
2. Select **Play Store** as the platform
3. Fill in:
   - **App name**: Your Android app name
   - **Package name**: Must match your `app.json` (e.g., `com.yourcompany.yourapp`)
4. Connect to Google Play Console:
   - Create a service account in Google Cloud Console
   - Grant it access in Play Console → Users and permissions
   - Upload the service account JSON key
5. Copy the **Public API Key** for Android

#### Step 4: Create Products

**In App Store Connect (iOS):**
1. Go to your app → **In-App Purchases** → **Manage**
2. Create subscription products (e.g., `monthly_premium`, `yearly_premium`)
3. Set prices and descriptions

**In Google Play Console (Android):**
1. Go to your app → **Monetize** → **Subscriptions**
2. Create matching subscription products with same IDs

**In RevenueCat:**
1. Go to **Products** → **+ New Product**
2. Add each product with its store identifiers
3. Go to **Entitlements** → **+ New Entitlement**
   - Create an entitlement (e.g., `premium`)
   - Attach your products to this entitlement
4. Go to **Offerings** → **+ New Offering**
   - Create an offering (e.g., `default`)
   - Add packages (monthly, yearly) with your products

#### Step 5: Add Keys to .env

```env
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=appl_xxxxxxxxxxxxxxxx
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=goog_xxxxxxxxxxxxxxxx
```

---

### 3. Sentry Setup

Sentry tracks errors and crashes in your app so you can fix issues before users complain.

#### What Sentry Does

- **Crash Reporting**: Captures native iOS/Android crashes with full stack traces
- **Error Tracking**: Catches JavaScript errors with context
- **Performance Monitoring**: Tracks slow screens and API calls
- **Session Replay**: See what the user did before a crash
- **User Context**: Know which user experienced the error

#### Step 1: Create a Sentry Account

1. Go to [sentry.io](https://sentry.io) and sign up (free tier: 5,000 errors/month)
2. Create a new **Organization** (or use existing)
3. Create a new **Project**:
   - Select **React Native** as the platform
   - Name your project

#### Step 2: Get Your DSN

1. After creating the project, you'll see your **DSN** (Data Source Name)
2. It looks like: `https://xxxxx@xxx.ingest.sentry.io/xxxxx`
3. Copy this to your `.env`:

```env
EXPO_PUBLIC_SENTRY_DSN=https://xxxxx@xxx.ingest.sentry.io/xxxxx
```

#### Step 3: Configure Source Maps (For Production)

To see readable stack traces in production, configure source map uploads:

1. In Sentry, go to **Settings** → **Projects** → Your project → **Client Keys (DSN)**
2. Go to **Settings** → **Auth Tokens** → Create a new token with `project:releases` scope
3. Add to your EAS secrets:

```bash
eas secret:create --name SENTRY_AUTH_TOKEN --value your_auth_token
```

4. Update `app.json` to include Sentry plugin:

```json
{
  "expo": {
    "plugins": [
      ["@sentry/react-native/expo", {
        "organization": "your-org",
        "project": "your-project"
      }]
    ]
  }
}
```

#### How Sentry Works in This Template

The Sentry setup in `src/lib/sentry.ts` automatically:
- Initializes Sentry with your DSN
- Captures all unhandled errors
- Attaches user context when logged in
- Tracks navigation between screens

You can also manually capture errors:

```typescript
import { captureException, captureMessage } from "@/src/lib/sentry";

// Capture an error
try {
  await riskyOperation();
} catch (error) {
  captureException(error);
}

// Capture a message
captureMessage("User completed onboarding");
```

---

### 4. PostHog Setup

PostHog provides product analytics to understand how users interact with your app.

#### What PostHog Does

- **Event Tracking**: Track button clicks, form submissions, purchases
- **Screen Analytics**: See which screens users visit most
- **User Identification**: Link events to specific users
- **Funnels**: Analyze conversion rates (e.g., signup → purchase)
- **Feature Flags**: Gradually roll out features to subsets of users
- **Session Recording**: Watch replays of user sessions (web only)

#### Step 1: Create a PostHog Account

1. Go to [posthog.com](https://posthog.com) and sign up (free tier: 1M events/month)
2. Create a new **Organization** and **Project**

#### Step 2: Get Your API Key

1. Go to **Settings** (gear icon) → **Project Settings**
2. Copy your **Project API Key** (starts with `phc_`)
3. Note your **Host URL**:
   - US Cloud: `https://us.i.posthog.com`
   - EU Cloud: `https://eu.i.posthog.com`
   - Self-hosted: Your instance URL

4. Add to your `.env`:

```env
EXPO_PUBLIC_POSTHOG_API_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

#### How PostHog Works in This Template

The PostHog setup in `src/lib/posthog.ts` provides:

**Automatic Screen Tracking:**
Screens are automatically tracked via Expo Router integration.

**Custom Event Tracking:**

```typescript
import { trackEvent } from "@/src/lib/posthog";

// Track a button click
trackEvent("upgrade_button_clicked", {
  screen: "home",
  plan: "premium"
});

// Track a purchase
trackEvent("subscription_purchased", {
  plan: "monthly",
  price: 9.99
});
```

**User Identification:**

```typescript
import { identifyUser } from "@/src/lib/posthog";

// After login, identify the user
identifyUser(user.id, {
  email: user.email,
  plan: "free"
});
```

**Feature Flags:**

```typescript
import { useFeatureFlag } from "@/src/lib/posthog";

// Check if a feature is enabled for this user
const showNewOnboarding = useFeatureFlag("new_onboarding");

if (showNewOnboarding) {
  return <NewOnboarding />;
}
```

---

## Understanding the Architecture

### State Management

This template uses a dual-state approach:

#### Zustand (Client State)
For local app state that doesn't come from a server:
- User session and authentication state
- App settings (theme, language)
- UI state (modals, toasts)

Located in `src/stores/`:

```typescript
// Example: Using auth store
import { useAuthStore } from "@/src/stores/auth.store";

const { user, isAuthenticated } = useAuthStore();
```

#### TanStack Query (Server State)
For data that comes from APIs and needs caching:
- User profile data
- Lists and collections
- Any data fetched from Supabase

```typescript
// Example: Fetching user profile
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/lib/supabase";

const { data: profile, isLoading } = useQuery({
  queryKey: ["profile", userId],
  queryFn: async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    return data;
  }
});
```

### Authentication Flow

```
User opens app
       ↓
Check stored session (expo-secure-store)
       ↓
   ┌───────────────────┐
   │  Session exists?  │
   └───────────────────┘
      ↓ No          ↓ Yes
      ↓             ↓
Show (auth)     Validate with Supabase
screens              ↓
      ↓         ┌─────────────┐
      ↓         │   Valid?    │
      ↓         └─────────────┘
      ↓            ↓ No    ↓ Yes
      ↓            ↓       ↓
      └────────────┘   Show (tabs)
                       screens
```

The auth flow is handled in `app/_layout.tsx` and redirects users automatically.

### Payment Flow

```
User taps "Upgrade"
       ↓
Show Paywall modal (app/(modals)/paywall.tsx)
       ↓
Fetch offerings from RevenueCat
       ↓
Display subscription options
       ↓
User selects a plan
       ↓
RevenueCat handles native purchase UI
       ↓
   ┌─────────────────────┐
   │  Purchase success?  │
   └─────────────────────┘
      ↓ No          ↓ Yes
      ↓             ↓
Show error     Update subscription state
              (useSubscription hook)
                    ↓
              Grant premium features
              (check isPremium)
```

### Styling with NativeWind

NativeWind brings Tailwind CSS to React Native. Instead of:

```typescript
// Traditional StyleSheet approach
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  }
});

<View style={styles.container}>
  <Text style={styles.title}>Hello</Text>
</View>
```

You write:

```typescript
// NativeWind approach
<View className="flex-1 p-4 bg-gray-100">
  <Text className="text-2xl font-bold text-gray-900">Hello</Text>
</View>
```

**Key differences from web Tailwind:**
- Use `className` (compiled to `style` at build time)
- No hover states (use Pressable with pressed state)
- Some web-specific classes don't apply (like `cursor-pointer`)

**Dark Mode:**
```typescript
<Text className="text-black dark:text-white">
  Adapts to system theme
</Text>
```

**Custom Theme Colors:**
Defined in `tailwind.config.js`:
- `primary-*`: Your brand color (default: blue)
- `secondary-*`: Neutral grays

### Internationalization

Located in `src/i18n/`:

**Adding translations:**

1. Create/edit `src/i18n/locales/[language].json`:
```json
{
  "common": {
    "welcome": "Welcome",
    "save": "Save"
  },
  "auth": {
    "login": "Log In",
    "logout": "Log Out"
  }
}
```

2. Use in components:
```typescript
import { useTranslation } from "react-i18next";

function MyComponent() {
  const { t } = useTranslation();

  return <Text>{t("auth.login")}</Text>;
}
```

**Adding a new language:**

1. Create `src/i18n/locales/[lang].json`
2. Add to `src/i18n/index.ts`:
```typescript
import fr from "./locales/fr.json";

resources: {
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr }, // Add new language
}
```

---

## Development

### Running the App

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint errors
npm run lint:fix

# Format code with Prettier
npm run format

# Type check with TypeScript
npm run typecheck

# Run tests
npm run test
```

---

## Building & Deployment

### EAS Build Profiles

Defined in `eas.json`:

| Profile | Purpose | Distribution |
|---------|---------|--------------|
| `development` | Development builds with Expo Dev Client | Internal |
| `preview` | Test builds for QA | Internal |
| `production` | Store-ready builds | App Store / Play Store |

### Building

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS (development)
eas build --platform ios --profile development

# Build for Android (development)
eas build --platform android --profile development

# Build for production
eas build --platform all --profile production
```

### Submitting to Stores

```bash
# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

### CI/CD with GitHub Actions

Three workflows are included in `.github/workflows/`:

1. **ci.yml**: Runs on every PR
   - Linting
   - Type checking
   - Tests

2. **eas-build.yml**: Runs on push to main
   - Builds preview version
   - Can be configured for automatic OTA updates

3. **eas-submit.yml**: Manual trigger
   - Submits builds to App Store / Play Store

**Required GitHub Secrets:**

| Secret | Description |
|--------|-------------|
| `EXPO_TOKEN` | Expo access token (expo.dev → Settings → Access Tokens) |
| `EXPO_APPLE_ID` | Your Apple ID email |
| `EXPO_APPLE_APP_SPECIFIC_PASSWORD` | App-specific password from appleid.apple.com |

---

## Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
npx expo start --clear
```

**Native module issues:**
```bash
npx expo prebuild --clean
```

**TypeScript errors:**
```bash
npm run typecheck
```

**NativeWind styles not applying:**
- Ensure `global.css` is imported in `app/_layout.tsx`
- Check that `className` is spelled correctly
- Restart Metro bundler with cache clear

**Supabase auth not persisting:**
- Check that `expo-secure-store` is properly installed
- Verify your Supabase URL and anon key are correct

**RevenueCat not loading products:**
- Ensure products are created in both App Store Connect and Play Console
- Products must be in "Ready to Submit" status
- Check that RevenueCat API keys match the platform

---

## Removing Optional Services

### Remove Sentry

If you don't need error tracking:

1. Uninstall package:
   ```bash
   npm uninstall @sentry/react-native
   ```

2. Delete `src/lib/sentry.ts`

3. Remove Sentry initialization from `app/_layout.tsx`:
   ```typescript
   // Remove this line
   import { initSentry } from "@/src/lib/sentry";

   // Remove this call
   initSentry();
   ```

4. Remove from `.env`:
   ```
   EXPO_PUBLIC_SENTRY_DSN=
   ```

### Remove PostHog

If you don't need analytics:

1. Uninstall package:
   ```bash
   npm uninstall posthog-react-native
   ```

2. Delete `src/lib/posthog.ts`

3. Remove PostHog provider from `app/_layout.tsx`:
   ```typescript
   // Remove this import
   import { PostHogProvider } from "@/src/lib/posthog";

   // Remove the provider wrapper
   ```

4. Remove from `.env`:
   ```
   EXPO_PUBLIC_POSTHOG_API_KEY=
   EXPO_PUBLIC_POSTHOG_HOST=
   ```

---

## License

MIT License - feel free to use this for personal and commercial projects.

## Support

- [GitHub Issues](https://github.com/your-username/react-native-jumpstart/issues)
- [Expo Documentation](https://docs.expo.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [RevenueCat Documentation](https://docs.revenuecat.com)
