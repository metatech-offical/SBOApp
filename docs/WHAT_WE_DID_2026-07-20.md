# SBO — What we did (20 Jul 2026)

Production setup day: mobile app, API on Railway, MongoDB Atlas, Redis, Cloudflare R2, Firebase (`sboapp-987ec`), and Resend for email OTP.

---

## Repos

| Repo | Role |
|------|------|
| **SBOApp** | React Native mobile app |
| **SboServer** | Node/Express API (`/v1/api/...`) |
| **SBOAdmin** | Next.js admin (not set up this session) |

---

## Production stack (live)

| Piece | Value |
|-------|--------|
| API | `https://sboserver-production.up.railway.app` |
| API base path | `/v1/api/` |
| Hosting | Railway project **SBO** / service **SboServer** (US West) |
| Database | MongoDB Atlas (`sbo` DB) |
| Cache / OTP sessions | Railway Redis (`REDIS_URL`) |
| Media | Cloudflare R2 bucket `sbo-media` |
| Email OTP | **Resend** HTTPS API (Railway Hobby **blocks SMTP**) |
| Auth / SMS | Firebase project **`sboapp-987ec`** (sboAPP) |
| iOS Bundle ID | `ai.metastart.sbo` (kept as-is) |
| Android package | `com.sbo` |

---

## App → API

In `src/rtkServices/endpoints.ts`:

- `isStaging = true` → uses Railway URLs from `.env`
- `isStaging = false` → local `http://localhost:8080`

`.env` staging URLs:

```env
BASE_URL_STAGING=https://sboserver-production.up.railway.app/v1/api/
SOCKET_URL_STAGING=https://sboserver-production.up.railway.app
POST_UPLOAD_URL_STAGING=https://sboserver-production.up.railway.app/v1/api/stream/videos/upload
```

---

## Firebase switch

Disconnected old project **`ai-metastart-sbo`**. Now using:

- Project ID: **`sboapp-987ec`**
- iOS: `GoogleService-Info.plist` / `ios/GoogleService-Info.plist`
- Android: `android/app/google-services.json`
- Server: `FIREBASE_SERVICE_ACCOUNT` env (JSON) on Railway + local `src/config/serviceAccount.json`

Enable **Phone** sign-in in Firebase Console for real SMS OTP.

---

## Railway deploy notes

### Why early crashes happened

1. Missing `MONGODB_URI` / `JWT_SECRET` (`.env` is not deployed with Git)
2. Firebase loading `./src/config/serviceAccount.json` from disk → fixed to use `FIREBASE_SERVICE_ACCOUNT`
3. Broken `package-lock.json` → `npm ci` failed
4. App not listening on `0.0.0.0` → public URL 502
5. MongoDB Atlas IP allowlist → add `0.0.0.0/0` (Hobby has no static outbound IP)
6. No Redis → add Railway Redis + `REDIS_URL`
7. Gmail SMTP blocked on Hobby → switched to **Resend**

### Important Railway variables (SboServer)

- `NODE_ENV=production`
- `PORT=8080` (match public networking target port)
- `MONGODB_URI`, `JWT_SECRET`
- `REDIS_URL`
- `FIREBASE_SERVICE_ACCOUNT` (full JSON string)
- Email: `RESEND_API_KEY`, `RESEND_FROM` (e.g. `SBO <onboarding@resend.dev>`)
- R2: `AWS_*` + `AWS_S3_ENDPOINT` + `AWS_S3_PUBLIC_URL`
- Optional testing: `OTP_DEBUG=true`

Public networking: target port **8080**, domain `sboserver-production.up.railway.app`.

---

## OTP behaviour

### Email

- Production: Resend API (not Gmail SMTP).
- Without a verified Resend domain, emails only go to the Resend account email (`sbometatech@gmail.com`).
- To email any user: verify a domain in Resend and set `RESEND_FROM` to that domain.
- `OTP_DEBUG=true`: returns/shows OTP in the app if email fails (for testing).

### Phone

- Real flow: Firebase Phone Auth SMS → `idToken` verified on server.
- Simulator `__DEV__`: uses OTP **`123456`** and `idToken: "DEV"`.
- Server accepts DEV bypass when `OTP_DEBUG=true` or `NODE_ENV=development`.
- Turn `OTP_DEBUG` off before real production users.

---

## Local iOS notes

- Metro: `npm start -- --reset-cache`
- Simulator: iPhone 16 Pro
- Fixed Hermes build: `ios/.xcode.env.local` must point at current Node (`/opt/homebrew/bin/node`), not an old Cellar path
- Bundle ID remains `ai.metastart.sbo`

---

## Still optional / later

- [ ] Verify a Resend domain for OTP to any email
- [ ] Enable Firebase Phone + test on a real device; set `OTP_DEBUG=false`
- [ ] APNs key in Firebase for iOS push
- [x] Stripe Payment Sheet for merchandise checkout (21 Jul 2026)
- [ ] SBOAdmin pointed at Railway URL
- [ ] Rotate secrets that were shared in chat/logs

---

## Stripe checkout (21 Jul 2026)

**Flow:** Checkout → `order/checkout` creates order + Stripe PaymentIntent (AED) → app opens Payment Sheet → webhook `payment_intent.succeeded` marks order paid + clears cart + notifies.

**Railway (SboServer):**
```env
STRIPE_API_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...   # optional (returned to app; app still needs its own copy)
STRIPE_WEBHOOK_SECRET=whsec_...
```

**App `.env`:**
```env
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Webhook:** `https://sboserver-production.up.railway.app/webhook/stripe` — enable `payment_intent.succeeded` and `payment_intent.payment_failed`.

**Test card:** `4242 4242 4242 4242`, any future expiry, any CVC.

---

## Quick smoke test

1. Open app (staging → Railway)
2. Sign up with `sbometatech@gmail.com` (Resend-allowed)
3. Enter email OTP from inbox (or debug toast)
4. Phone step on simulator: OTP `123456`
5. Finish username / plan

Health check:

```bash
curl https://sboserver-production.up.railway.app/
# → Hello from App!
```
