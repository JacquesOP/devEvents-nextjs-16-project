"use client";

import React, { useState } from 'react'

/**
 * Renders an email signup form and, after submission, displays a confirmation message.
 *
 * Shows a controlled email input and a submit button. After the form is submitted, the component
 * replaces the form with the message "Thank you for signing up!" following a short delay.
 *
 * @returns The component's rendered JSX: either the signup form or the confirmation message.
 */
export default function BookEvent() {

   const [email, setEmail] = useState('');
   const [submitted, setSubmitted] = useState(false);


   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      setTimeout(() => {
         setSubmitted(true);
      }, 1000)
   }


   return (
      <div id='book-event'>
         {
            submitted ? (
               <p className='text-sm'>
                  Thank you for signing up!
               </p>
            ): (
               <form onSubmit={handleSubmit}>
                  <div>
                     <label htmlFor="email">
                        Email Address
                     </label>
                     <input 
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                     />
                  </div>

                  <button type="submit" className='button-submit'
                  >
                     Submit
                  </button>
               </form>
            )
         }
      </div>
   )
}