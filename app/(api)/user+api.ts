/**
 * Neon: ensure a `users` table exists, e.g.
 *
 * CREATE TABLE users (
 *   id SERIAL PRIMARY KEY,
 *   name TEXT NOT NULL,
 *   email TEXT NOT NULL,
 *   clerk_id TEXT NOT NULL UNIQUE
 * );
 */
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return Response.json(
        { error: "DATABASE_URL is not configured" },
        { status: 500 },
      );
    }

    const sql = neon(databaseUrl);
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const response = await sql`
      INSERT INTO users (
        name,
        email,
        clerk_id
      )
      VALUES (
        ${name},
        ${email},
        ${clerkId}
      );`;

    return new Response(JSON.stringify({ data: response }), {
      status: 201,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
