# Task Breakdown (Execution Order)

1. **Validate environment**: Confirm required env vars (Clerk, Neon Postgres, UploadThing, SMTP) and run `npm install` for web and `npm install`/`npm audit fix` for mobile if needed.
2. **Domain modeling**: Define Prisma schema for users (Clerk linkage), roles, profiles, posts (news), media assets, comments/reactions if needed, polls (question, options, deadlines), ballots, Q&A items with status lifecycle, notifications, and audit fields.
3. **Prisma migration & seeding**: Run migrations to Neon locally and add minimal seed data for roles, sample users, and sample content for feed, polls, and Q&A.
4. **Authorization policy**: Implement role-based guards (admin/student) using Clerk session claims; centralize checks in middleware/lib and add helper hooks/components.
5. **Shared UI foundation**: Wire global layout, navigation, theming, toasts, and loading/empty/error states; ensure responsiveness and Serbian localization alignment.
6. **News feed backend**: Create Next.js route handlers for posts CRUD, media upload via UploadThing, pagination, and moderation flags.
7. **News feed UI**: Build feed listing, detail modals/pages, create/edit forms (admin only), attachments preview, and reactions/comments if modeled.
8. **Voting backend**: Implement poll APIs (create/update/close), options, one-vote-per-user enforcement, deadline handling, and result aggregation.
9. **Voting UI**: Render poll list/detail, cast vote flow, closed-state results, and admin controls to publish/close polls.
10. **Q&A backend**: Add APIs for submitting questions, admin responses, status transitions (U obradi → Odgovoreno → Rešeno), and visibility rules.
11. **Q&A UI**: Build submission form, list with filters by status, detail view with answer history, and admin panel for triage/updates.
12. **Notifications service**: Add event emitters/hooks to create in-app notifications and send emails via Nodemailer for replies, votes, and admin actions; include read/unread tracking.
13. **Admin dashboard**: Provide consolidated moderation (posts, polls, Q&A, users), metrics snapshots, and bulk status/actions with role checks.
14. **Public pages & static content**: Ensure “o-nama”, “pravila”, “mapa”, “privatnost”, “uslovi-koriscenja”, etc. are wired with CMS-friendly content sources or static data.
15. **Mobile API surface**: Expose mobile-friendly JSON endpoints (auth-protected) for feed, polls, Q&A, and notifications; document shapes and pagination.
16. **Expo mobile flows**: Implement Clerk auth, navigation shell, feed/poll/Q&A screens, vote submission, notifications view, and basic offline/error states.
17. **Testing & QA**: Add unit/integration coverage for critical APIs (vote counting, status transitions, notification triggers) and perform manual end-to-end smoke tests on web and mobile.
18. **Deployment readiness**: Verify `npm run build`/`lint`, align env var templates (.env.example), and document deploy steps for Vercel (web) and EAS build/test (mobile).

