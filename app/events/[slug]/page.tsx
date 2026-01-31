import React, { Suspense } from 'react';
import { EventContent } from '@/components/EventContent';



type PageParams = {
  params: Promise<{ slug: string }>;
};


export default function EventDetailsPage({ params }: PageParams) {


  return (
    <Suspense fallback={<div>Loading event...</div>}>
      <EventContent params={params} />
    </Suspense>
  );
}
