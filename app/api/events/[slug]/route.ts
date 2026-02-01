import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";

// Route params type for Next.js 16 dynamic routes
type RouteParams = {
  params: Promise<{ slug: string }>;
};

/**
 * Retrieve a single event by its slug and return a JSON HTTP response.
 *
 * Validates the slug, ensures a database connection, and looks up the event by its indexed slug.
 *
 * @param params - An object with a `slug` string (provided as a Promise-resolved route parameter)
 * @returns A NextResponse with a JSON body:
 * - 200: `{ message: "Event fetched successfully", event }`
 * - 400: `{ message: "Invalid slug parameter" }` when the slug is missing or empty
 * - 404: `{ message: "Event not found" }` when no event matches the slug
 * - 500: `{ message: "Error fetching event", error }` on unexpected failures
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    // Validate slug parameter
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { message: "Invalid slug parameter" },
        { status: 400 }
      );
    }

    await connectDB();

    // Query by indexed slug field
    const event = await Event.findOne({ slug: slug.trim() }).lean();

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error fetching event by slug:", e);
    return NextResponse.json(
      {
        message: "Error fetching event",
        error: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}