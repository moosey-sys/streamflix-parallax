import React from 'react'
import Navigation from '../components/navigation/Navigation'
import Footers from '../components/Footer'

const Contact = () => {
  return (
    <div className='w-screen  bg-gray-900 '>
         <Navigation />
    <div className=' flex  justify-center items-center mx-16'>
      
<section className=" w-full h-full">
  <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
      <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-white">Contact Us</h2>
      <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.</p>
      <form action="#" className="space-y-8">
          <div>
              <label for="email" className="block mb-2 text-sm font-medium text-gray-900">Your email</label>
              <input type="email" id="email" className="shadow-sm bg-black border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="name@flowbite.com" required></input>
          </div>
          <div>
              <label for="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Subject</label>
              <input type="text" id="subject" className="block p-3 w-full text-sm text-gray-900 bg-black rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Let us know how we can help you" required></input>
          </div>
          <div class="sm:col-span-2">
              <label for="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Your message</label>
              <textarea id="message" rows="6" className="block p-2.5 w-full text-sm text-gray-900 bg-black rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..."></textarea>
          </div>
          <button type="submit" className="py-3 px-5 text-sm font-medium text-center rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 bg-white text-black hover:bg-blue-500">Send message</button>
      </form>
  </div>
</section>
<div className='w-full h-full flex justify-center items-center'>
<iframe
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7605820576857!2d103.84176791476938!3d1.2931081621049593!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31da19babbb81d39%3A0xad0170a73a9571d0!2sBugis%20Junction!5e0!3m2!1sen!2ssg!4v1649133913205!5m2!1sen!2ssg"
  width="600"
  height="450"

  allowfullscreen=""
  loading="lazy"
  className=' rounded-lg'
></iframe>


</div>
    </div>
    <Footers />
    </div>
   
    
  )
}

export default Contact
