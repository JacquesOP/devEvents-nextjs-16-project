'use client';

import Link from 'next/link'
import React from 'react';
import Image from 'next/image';
import posthog from 'posthog-js';

export default function Navbar() {
  const handleNavClick = (linkName: string, href: string) => {
    posthog.capture('navigation_link_clicked', {
      link_name: linkName,
      link_href: href,
      navigation_location: 'header',
    });
  };

  return (
    <header>

      <nav>
         <Link href={"/"} className='logo' onClick={() => handleNavClick('Logo', '/')}>
            <Image src="/icons/logo.png" alt="logo" width={24} height={24} />

            <p>
               DevEvent
            </p>

         </Link>

         <ul>
            <Link href={"/"} onClick={() => handleNavClick('Home', '/')}>Home</Link>
            <Link href={"/"} onClick={() => handleNavClick('Events', '/')}>Events</Link>
            <Link href={"/"} onClick={() => handleNavClick('Create Event', '/')}>Create Event</Link>
         </ul>
      </nav>

    </header>
  )
}
