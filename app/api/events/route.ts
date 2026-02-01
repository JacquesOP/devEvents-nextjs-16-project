import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { uploadToBunnyStorage } from '@/lib/bunny'
import Event from "@/database/event.model";


/**
 * Handle POST requests to create a new Event with an uploaded image and persist it to the database.
 *
 * Expects multipart form data containing an `image` File, `tags` and `agenda` as JSON strings, and any of the permitted event fields: `title`, `description`, `overview`, `venue`, `location`, `date`, `time`, `mode`, `audience`, `organizer`. Validates image MIME type (image/jpeg, image/png, image/webp), uploads the image to Bunny storage, constructs a sanitized event payload, creates the Event document, and returns the created event.
 *
 * @param req - Incoming POST request with multipart/form-data containing the image and event fields described above.
 * @returns A JSON HTTP response:
 * - On success (201): `{ message: 'Event created successfully', event: createdEvent }`
 * - On client error (400): `{ message: 'Image file is required' }` or `{ message: 'Invalid file type' }`
 * - On server error (500): `{ message: 'Event Creation failed', error: <error message> }`
 */
export async function POST(req: NextRequest) {

   try {
      await connectDB();

      const formData = await req.formData();
      const file = formData.get('image') as File;

      if(!file) {
         return NextResponse.json({ message: 'Image file is required'}, { status: 400 })
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


/**
 * Handle GET requests by fetching all Event records and returning them sorted newest first.
 *
 * @returns A JSON response with `message` and `events` (array of Event objects) on success; on failure a JSON response with `message` and `error` (error message).
 */
export async function GET() {

   try {
      await connectDB();

      const events = await Event.find().sort({ createdAt: -1 }).lean();

      return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 })

   } catch (e) {

      return NextResponse.json({ message: 'Event fetching failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 })
   }
}
