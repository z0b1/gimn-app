# Prompts for Coding Agent (Planner → Executor)

Use these sequentially; keep changes minimal, follow existing patterns, and run `npm run lint`/`npm run build` on web plus Expo checks as needed.

1. **Model & migrate data**
   - Define Prisma models: User (Clerk linkage + role), Role, Profile, Post, MediaAsset, Poll, PollOption, Ballot, Question, Answer/StatusHistory, Notification (+ optional Comment/Reaction if you implement comments).
   - Add indexes and relations; generate and run migrations; add seed script for roles/sample content.
2. **Auth & RBAC**
   - Implement Clerk middleware/session validation; expose helper to read role from DB by Clerk user id.
   - Add server-side guards for admin-only routes/actions and client-side guard components/hooks.
3. **Shared UI shell**
   - Build navigation, layout wrappers, theme toggle, toast/loading/empty/error states; align typography and localization (Serbian).
4. **Feed**
   - Implement API route handlers for posts CRUD with pagination and UploadThing media; enforce admin create/edit permissions.
   - Build UI for feed list/detail, create/edit forms, attachments preview; optionally add comments/reactions if modeled.
5. **Voting**
   - Implement poll APIs (create/update/close, options, vote submission with one-vote-per-user and deadlines) and result aggregation.
   - Build UI for poll list/detail, vote flow, closed-state results, and admin controls.
6. **Q&A**
   - Add APIs for submitting questions, admin replies, and status transitions (U obradi → Odgovoreno → Rešeno); include filtering.
   - Build UI for submission form, list with status filters, detail/answer view, and admin triage tools.
7. **Notifications**
   - Create notification service to write in-app notifications and send emails via Nodemailer on replies, votes, and admin actions; support read/unread.
   - Surface notification badge/list UI; ensure events are fired from feed/voting/Q&A handlers.
8. **Admin dashboard**
   - Build consolidated admin pages for moderating posts/polls/Q&A/users with bulk actions and metrics cards.
9. **Mobile API & client**
   - Expose mobile-friendly JSON endpoints for feed/polls/Q&A/notifications secured via Clerk bearer tokens; document response shapes.
   - Update Expo app: Clerk auth, navigation, screens for feed, polls (with vote submission), Q&A (list/submit/view), notifications view; handle loading/errors/offline gracefully.
10. **Testing & readiness**
   - Add tests for critical handlers (vote counting, status transitions, notification triggers); run lint/build; update `.env.example` and deployment notes (Vercel + EAS).

General rules: avoid new dependencies unless required; reuse existing components/helpers; keep edits scoped; never reset user changes; prefer server components for data fetching and client components only for interactivity.
