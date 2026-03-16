# Implementation Plan

## Architecture Overview
- **Web**: Next.js 14 App Router with server components; Clerk for auth; Prisma + Neon Postgres for data; Tailwind for UI; UploadThing for file uploads; Nodemailer for email.
- **API**: Route handlers under `src/app/api` exposing REST/JSON for posts, polls, Q&A, notifications, and media. Shared validation and RBAC middleware enforce policies.
- **Mobile**: Expo React Native using Clerk Expo SDK; consumes the same APIs; React Navigation for flows.
- **Data**: Prisma models for User (Clerk linkage), Role, Profile, Post, MediaAsset, Comment/Reaction (optional), Poll, PollOption, Ballot, Question, Answer/StatusHistory, Notification.
- **Notifications**: Event-based creation of in-app notifications plus email dispatch via Nodemailer; notifications stored for read/unread tracking.

## Modules & Responsibilities
- **Auth & Roles**: Clerk session + middleware; roles table with admin/student; helper to inject role into requests; guard components/hooks for UI.
- **Shared UI**: Global layout, navigation, theme toggles, typography, buttons/forms, toast system, loading/empty/error states; localization strings (Serbian).
- **Feed**: CRUD for posts with attachments; optional comments/reactions; pagination; moderation flags; SEO metadata per post.
- **Voting**: Poll creation/edit/close; options management; vote casting limited to one per user; deadline enforcement; results aggregation; audit logs.
- **Q&A**: Question submission; admin responses; status transitions (U obradi → Odgovoreno → Rešeno) with timestamps; filtering by status.
- **Notifications**: Hooks/helpers to emit events on replies, votes, admin actions; persistence; email templates for key events; in-app badge/read state.
- **Admin Dashboard**: Tables/cards for posts, polls, Q&A, and users; bulk actions and role-restricted controls.
- **Public/Static Pages**: Content for about/rules/privacy/terms/map; ensure accessible routing and metadata.
- **Mobile Client**: Auth screens, feed list/detail, poll list/detail with voting, Q&A list/detail with submit, notifications view; error/offline handling; shared types matching API responses.

## Data Flow
- **Auth**: Client requests -> Clerk session validated in middleware -> role resolved -> handler executes -> response includes user context for UI state.
- **Feed**: Post create/edit triggers media upload (UploadThing) -> Prisma persist -> invalidate/revalidate pages -> notification emit to subscribers/admins.
- **Voting**: Poll list fetched (server components or API) -> user casts vote -> handler checks deadline + prior ballot -> stores ballot -> returns updated tallies.
- **Q&A**: Student submits question -> stored as “U obradi” -> admin updates status/answer -> event triggers notifications/email -> client refetches.
- **Notifications**: Event helper writes notification row -> optional email via Nodemailer -> client fetches unread counts; mark-as-read updates state.
- **Mobile**: Uses same endpoints with bearer token from Clerk; receives JSON payloads; navigation updates from fetch results; offline errors surfaced to user.

## Design Decisions
- Use Prisma for schema-first modeling and migrations; keep relations explicit and add indexes for lookup fields (userId, status, deadlines).
- Keep business logic in server actions/route handlers with small, testable utilities for validation and RBAC.
- Prefer server components for data-heavy pages; use client components only for interactivity (forms, voting buttons).
- Keep dependencies minimal; only add real-time transport (e.g., Pusher/Ably/Next WebSockets) if required for live updates—otherwise rely on revalidation/polling.
- Align API response shapes across web/mobile to share types; co-locate zod schemas or TS types for validation.

## Step Sequence
1. Finalize Prisma schema and migrations; add seeds for roles/sample data.
2. Implement auth middleware and role resolution helpers; update protected routes.
3. Build shared UI shell and components (navigation, theming, feedback states).
4. Implement feed APIs + UploadThing + feed UI flows.
5. Implement voting APIs + UI (create/close, vote submission, results).
6. Implement Q&A APIs + UI with status transitions and filters.
7. Add notification service (in-app + email) and integrate with feed/voting/Q&A events.
8. Build admin dashboard surfaces for moderation/metrics.
9. Expose documented mobile-friendly endpoints; wire Expo app for auth + feed/poll/Q&A/notifications flows.
10. Add tests for critical handlers; run lint/build; document deploy steps and env vars.

