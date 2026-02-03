import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Event from "@/database/event.model";

// Configure route segment caching
export const revalidate = 3600; // Revalidate every 1 hour (ISR)
export const fetchCache = 'default-cache';

// Route params type for Next.js 16 dynamic routes
type RouteParams = {
  params: Promise<{ slug: string }>;
};

/**
 * GET /api/events/[slug]
 * Fetches a single event by its unique slug
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
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
        }
      }
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
