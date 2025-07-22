import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET)
  throw new Error("JWT_SECRET is not defined in environment variables.");

export const verifyToken = (token: string): { id: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
};
export const getUserFromRequest = (req: NextRequest): string | null => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("Authorization header missing or invalid:", authHeader);
    return null;
  }

  const token = authHeader.replace("Bearer ", "");
  const decoded = verifyToken(token);

  if (!decoded) {
    console.warn("Token verification failed");
  }

  return decoded?.id || null;
};
