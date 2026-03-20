import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/privatnost',
  '/uslovi-koriscenja',
  '/api/webhook/clerk',
]);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware((auth, request) => {
  const { sessionClaims } = auth();
  
  // Standardize role detection
  const metadata = sessionClaims?.metadata as { role?: string } | undefined;
  const publicMetadata = sessionClaims?.publicMetadata as { role?: string } | undefined;
  const directRole = (sessionClaims as unknown as { role?: string })?.role;
  const role = metadata?.role || publicMetadata?.role || directRole;

  if (isAdminRoute(request)) {
    if (role !== "ADMIN" && role !== "REDAKCIJA") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (!isPublicRoute(request)) {
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
