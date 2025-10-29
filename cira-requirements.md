# Cira UI — Page Structure & CRUD Specs (summary)

**Source:** Cira UI Page Structure & CRUD Specs — V1. (uploaded). :contentReference[oaicite:1]{index=1}

## 0) Goals
- Provide page-by-page structure for dashboards, tables and CRUD screens.
- Define fields, sections and page states.
- Standardize routes, components, and UI patterns across roles.

## 1) Roles & Global App Shell
- Roles: Admin, Doctor, Patient (User), Company Admin.
- Shell: Header (logo, global search, quick actions, notifications, user menu, consent link), left collapsible sidebar (role-based), breadcrumbs, content area (title + meta chips), optional right rail, footer.
- Responsive breakpoints: Mobile ≤640px, Tablet 641–1024px, Desktop ≥1025px.

## 2) Shared Components & Patterns
- Data Table Template: header (title, count, primary CTA), toolbar (search debounced, filters drawer, export CSV), column picker, density, sorting, multi-select, pagination (10/25/50/100), row actions, empty/loading/error states.
- Record Header (View): title + status chip, metadata, primary/secondary actions, tabs.
- Form Template: multi-section form with sticky left nav, field validation, autosave (draft), file upload with preview.
- Confirmation modal for destructive actions; explicit confirm text for high-risk deletes.
- Status chips canonical set: Verification, Appointment, Payment, Payout, Report, Referral.

## 3) Entity CRUD & Page Specs (high-level)
- **Users (Admin)**: list columns (ID, Name, Email, Phone, Role, Status, Last Login, Created At). Filters: Role, Status, dates. Actions: Suspend/Activate, Reset password, Send magic link, Delete.
- **Doctors (Admin)**: list & filters (Specialty, Fee). Create/Edit fields: profile, credentials, consultation config, payouts. Actions: Approve/Reject, Trigger Payout.
- **Appointments**: routes `/appointments`, `/appointments/create`. Fields: patient, doctor, date/time/timezone, mode (online/offline), payment. Actions: Confirm, Reschedule, Cancel, Mark Completed, Refund.
- **AI Nurse Reports**: list & view: summary, vitals, transcript, charts, files. Actions: Finalize, Share, Download.
- **Payments** (Standard/Referral): list columns + view (commission, net). Actions: Refund, Mark Paid, Export.
- **Payouts to Doctors**: list columns, view line items, generate/reconcile/mark paid.
- **Referrals (Third-party)**: provider management, stats (clicks, conversions), enable/disable.
- **Subscriptions & Plans**: plan management, billing for patients, usage meters, invoices.
- **Patient Profile & History**: personal info, health (chips), history (AI sessions, images).
- **Doctor Workspace**: dashboard cards (schedule, unread messages, earnings), reports list, earnings view.

## 4) Dashboards (KPI)
- Admin: active users/doctors, appointments trend, revenue split, referral performance, pending approvals.
- Doctor: today's schedule, next 7 days, earnings MTD/YTD.
- Patient: last AI report, upcoming appointment, subscription usage.

## 5) AI Nurse (Patient)
- Chat + vitals flow; left panel = chat, right panel = camera/vitals widget; produce draft → finalize → share or book.

## 6) Company (Org Admin)
- Routes: `/company/dashboard`, `/company/users`, `/company/billing`, `/company/settings`.
- Manage company users, billing, reports; export PDF/CSV.

## 7) Compliance & Privacy
- Consent modal, consent log (timestamp/version/IP), data export/delete flows, PHI markers & role-based redaction.

## 8) Standard Page Anatomy Checklist
- List pages: title+count, search, filters, column picker, table, bulk actions, empty/loading/error states.
- View pages: record header, actions, tabs, right rail.
- Create/Edit pages: section nav, validation, autosave, save/cancel options.
- Show environment/version indicator & consent link on all pages.

## 9) Routes & Naming Conventions
- Plural, kebab-case: `/appointments`, `/doctors`, `/users`.
- CRUD: `GET /entity`, `POST /entity`, `GET /entity/:id`, `PUT /entity/:id`.

## 10) Design System Notes
- Type scale, spacing (8px grid), accessible colors (AA+), ARIA roles and focus states.

## 11) Analytics & Events (examples)
- Page views, create/edit/delete events, appointment booked, payment completed, report finalized.

## 12) Build Order (suggested)
1. App shell + navigation + data table primitives  
2. Admin: Doctors → Users → Appointments → Payments/Payouts → Referrals  
3. Doctor workspace: Dashboard, Appointments, Reports, Earnings  
4. Patient: AI Nurse, Reports, Appointments, Billing, Profile  
5. Compliance surfaces: consent log, export/delete
