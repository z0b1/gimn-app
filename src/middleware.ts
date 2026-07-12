import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
  '/privatnost',
  '/uslovi-koriscenja',
  '/api/webhook/clerk',
  '/67easter',
  '/ai',
]);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware((auth, request) => {
  const url = new URL(request.url);

  // Route 67 subdomain to the easter egg page
  if (url.hostname === '67.gimnapp.me') {
    return NextResponse.rewrite(new URL('/67easter', request.url));
  }

  // Route ai subdomain to the AI chat page
  if (url.hostname === 'ai.gimnapp.me') {
    return NextResponse.rewrite(new URL('/ai', request.url));
  }

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
