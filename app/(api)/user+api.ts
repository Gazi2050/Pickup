/**
 * Schema is managed via Drizzle (`lib/db/schema.ts`).
 * Apply to Neon: `pnpm db:push` (requires DATABASE_URL in env).
 */
import { createDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "23505"
  );
}

export async function POST(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return Response.json(
        { error: "DATABASE_URL is not configured" },
        { status: 500 },
      );
    }

    const db = createDb(databaseUrl);
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    try {
      const [row] = await db
        .insert(users)
        .values({ name, email, clerkId })
        .returning();

      return new Response(JSON.stringify({ data: row }), {
        status: 201,
      });
    } catch (insertError) {
      if (isUniqueViolation(insertError)) {
        return Response.json(
          { error: "User with this clerk_id already exists" },
          { status: 409 },
        );
      }
      throw insertError;
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
