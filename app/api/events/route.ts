import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { uploadToBunnyStorage } from '@/lib/bunny'
import Event from "@/database/event.model";

// Configure caching for GET requests
export const revalidate = 1800; // Revalidate every 30 minutes
export const dynamic = 'force-dynamic'; // POST needs to be dynamic
export const fetchCache = 'default-cache';


// POST Event and UPLOAD image
export async function POST(req: NextRequest) {

   try {
      await connectDB();

      const formData = await req.formData();
      const file = formData.get('image') as File;

      if (!file) {
         return NextResponse.json({ message: 'Image file is required' }, { status: 400 })
      }

      const tags = JSON.parse(formData.get('tags') as string);
      const agenda = JSON.parse(formData.get('agenda') as string);

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
         return NextResponse.json({ message: 'Invalid file type' }, { status: 400 });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/\s/g, '-')}`;
      const filePath = `${fileName}`;

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Bunny Storage
      const imageURL = await uploadToBunnyStorage(buffer, filePath, 'events');


      // Allowlist of permitted event fields
      const allowedFields = [
         'title',
         'description',
         'overview',
         'venue',
         'location',
         'date',
         'time',
         'mode',
         'audience',
         'organizer',
      ] as const;

      // Build sanitized payload from only permitted fields
      const sanitizedPayload: Record<string, unknown> = {};
      for (const field of allowedFields) {
         const value = formData.get(field);
         if (value !== null) {
            sanitizedPayload[field] = value;
         }
      }

      const createdEvent = await Event.create({
         ...sanitizedPayload,
         image: imageURL,
         agenda: agenda,
         tags: tags
      });



      return NextResponse.json({
         message: 'Event created successfully',
         event: createdEvent
      }, { status: 201 });


   } catch (e) {
      console.error(e);
      return NextResponse.json({ message: 'Event Creation failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
   }
}


// GET Event from DB
export async function GET() {

   try {
      await connectDB();

      const events = await Event.find().sort({ createdAt: -1 }).lean();

      return NextResponse.json(
         { message: 'Events fetched successfully', events },
         {
            status: 200,
            headers: {
               'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
            }
         }
      )

   } catch (e) {

      return NextResponse.json({ message: 'Event fetching failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 })
   }
}

