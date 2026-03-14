import { auth } from "@clerk/nextjs/server";

export type Roles = "ADMIN" | "STUDENT";

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth();
  return (sessionClaims?.metadata as { role?: string })?.role === role;
};

export const isAdmin = () => {
  return checkRole("ADMIN");
};
