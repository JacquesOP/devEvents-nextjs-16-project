'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import posthog from 'posthog-js';

interface Props {
   title: string;
   image: string;
   slug?: string | null;
   location: string;
   date: string;
   time: string;
}

export default function EventCard({ title, image, slug, location, date, time }: Props) {
  const handleClick = () => {
    posthog.capture('event_card_clicked', {
      event_title: title,
      event_slug: slug,
      event_location: location,
      event_date: date,
    });
  };

  const imageUrl = image.startsWith('http')
    ? image
    : `${process.env.NEXT_PUBLIC_BASE_URL}/${image}`;

  const cardContent = (
    <>
      <Image src={imageUrl} alt={title} width={410} height={300} className='poster' />

      <div className='flex flex-row gap-2'>
         <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
         <p>{location}</p>
      </div>

      <p className='title'>
         {title}
      </p>

      <div className='datetime'>
         <div>
            <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
            <p>{date}</p>
         </div>

         <div>
            <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
            <p>{time}</p>
         </div>
      </div>
    </>
  );

  if (slug != null && slug !== '') {
    return (
      <Link href={`/events/${slug}`} id='event-card' onClick={handleClick}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div id='event-card'>
      {cardContent}
    </div>
  );
}
