import { Suspense } from 'react'
import ExploreBtn from '@/components/ExploreBtn'
import EventsList from '@/components/EventsList'

/**
 * Root page component that renders the homepage hero section and a featured events area.
 *
 * Renders a centered heading and subheading, an explore CTA, and a "Featured Events" section that loads the events list inside a Suspense boundary.
 *
 * @returns The page's JSX element containing the homepage layout
 */
export default function Page() {
   return (
      <section>
         <h1 className='text-center'>
            The Hub for Every Dev <br /> Event You Can&apos;t Miss
         </h1>

         <p className='text-center mt-5'>
            Hackatons, Meetups, and Conferences, All in One Place
         </p>

         <ExploreBtn />

         <div className='mt-20 space-y-7'>
            <h3>Featured Events</h3>
            <Suspense fallback={<p>Loading events...</p>}>
               <EventsList />
            </Suspense>
         </div>
      </section>
   )
}
