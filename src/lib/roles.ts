import { auth } from "@clerk/nextjs/server";

export type Roles = "ADMIN" | "STUDENT";

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth();
  
  // Check common paths where the role might be mapped in Clerk
  const metadata = sessionClaims?.metadata as { role?: string } | undefined;
  const publicMetadata = sessionClaims?.publicMetadata as { role?: string } | undefined;
  const directRole = (sessionClaims as unknown as { role?: string })?.role;

  return metadata?.role === role || 
         publicMetadata?.role === role || 
         directRole === role;
};

export const isAdmin = () => {
  return checkRole("ADMIN");
};
