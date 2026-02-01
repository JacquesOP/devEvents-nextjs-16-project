import React, { Suspense } from 'react';
import { EventContent } from '@/components/EventContent';



type PageParams = {
  params: Promise<{ slug: string }>;
};


/**
 * Render the event details page for the provided event slug.
 *
 * @param params - An object containing the route parameters; must include `slug` (the event identifier).
 * @returns The React element tree for the page, wrapping event content in a Suspense boundary with a loading fallback.
 */
export default function EventDetailsPage({ params }: PageParams) {


  return (
    <Suspense fallback={<div>Loading event...</div>}>
      <EventContent params={params} />
    </Suspense>
  );
}