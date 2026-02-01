'use cache'

import EventCard from '@/components/EventCard'
import { IEvent } from '@/database'
import { cacheLife } from 'next/cache';



const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export default async function EventsList() {
   cacheLife('hours');
   const response = await fetch(`${BASE_URL}/api/events`)
   
   if (!response.ok) {
      console.error('Failed to fetch events:', response.status);
      return <p>Failed to load events.</p>;
   }
   
   const { events } = await response.json()

   return (
      <ul className='events list-none'>
         {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.slug}>
               <EventCard
                  title={event.title}
                  image={event.image}
                  slug={event.slug}
                  location={event.location}
                  date={event.date}
                  time={event.time}
               />
            </li>
         ))}
      </ul>
   )
}
