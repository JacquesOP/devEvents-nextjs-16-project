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

/**
 * Render an event card displaying an image, location, title, date, and time; when `slug` is provided the card is a link to the event page.
 *
 * The card captures an analytics event named `event_card_clicked` (with `event_title`, `event_slug`, `event_location`, and `event_date`) when a linked card is clicked.
 *
 * @param title - The event title shown on the card
 * @param image - URL or relative path to the event image; if the value does not start with `http`, it is prefixed with `NEXT_PUBLIC_BASE_URL`
 * @param slug - Optional event slug; when non-empty the card becomes a Link to `/events/{slug}`
 * @param location - Human-readable location text displayed with a location icon
 * @param date - Date text displayed with a calendar icon
 * @param time - Time text displayed with a clock icon
 * @returns The rendered event card element
 */
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