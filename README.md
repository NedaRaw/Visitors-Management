# Najran Central Laboratory — Visitor Management System

A production-ready visitor management web app for **Najran Central
Laboratory**, operated by the **National Water Company**.
Visitors register online, receive a unique Visitor ID and QR code, and
can print or download a professional visitor badge. An admin dashboard
lets staff manage visitors, update statuses, and export data.

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Google Apps Script Web App
- **Database:** Google Sheets (the only database — no Firebase, no SQL)
- **QR / PDF:** automatic, generated in the browser
- **Deployment:** Netlify

---

## 1. Set up the Google Sheets backend

1. Create a new Google Sheet.
2. Open **Extensions → Apps Script** and paste the contents of
   [`apps-script/Code.gs`](./apps-script/Code.gs) into `Code.gs`.
3. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Authorize the script when prompted.
5. Copy the deployment URL (it ends with `/exec`).

## 2. Configure the web app

Open [`src/config/app.config.ts`](./src/config/app.config.ts) and set:

```ts
export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/XXXXXXXXXXXX/exec";

// Domain where this site is hosted (used inside QR codes)
export const PUBLIC_DOMAIN = "https://your-domain.com";

// Admin dashboard credentials — change before going live
export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "lab2026",
};
```

## 3. Run / build

```bash
npm install
npm run dev      # local development
npm run build    # production build → dist/
```

## 4. Deploy to Netlify

- Build command: `npm run build`
- Publish directory: `dist`

A `netlify.toml` is included with these settings and an SPA fallback.

---

## How it works

| Route                    | Purpose                                              |
| ------------------------ | ---------------------------------------------------- |
| `#/`                     | Public visitor registration form                     |
| `#/success`              | Success page with the generated visitor badge        |
| `#/visitor/LAB-2026-000001` | Visitor lookup page (the URL inside the QR code)  |
| `#/admin`                | Admin login + dashboard                              |

- The **QR code** contains only the visitor lookup URL, e.g.
  `https://your-domain.com/#/visitor/LAB-2026-000001`.
- The **Visitor ID** is generated as `LAB-YYYY-NNNNNN` and auto-increments
  per year, managed by the Apps Script.
- Every registration is POSTed to the Google Apps Script endpoint, which
  appends a row to the **Visitors** sheet.
- The admin dashboard reads, updates, and deletes rows through the same
  endpoint.

## Project structure

```
src/
  components/   reusable UI (Button, Card, Modal, Badge, Logo, …)
  config/       app configuration (Apps Script URL, branding, …)
  context/      Theme + Auth providers
  lib/          utilities (API client, QR, PDF, exporters, validation)
  pages/        RegistrationForm, SuccessPage, VisitorLookup, Admin*
  types/        shared TypeScript types
apps-script/    Google Apps Script backend (paste into Google Sheets)
```
