import React from 'react'
// import { assets, footer_data } from '../assets/assets'

const Footer = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3'>

      
      {/* <div className='flex flex-col md:flex-row items-start justify-between gap-x-10 gap-y-10 py-10 border-b border-gray-500/30 text-gray-500'>

       
        <div className='flex-shrink-0 w-full md:w-auto md:max-w-[400px] md:mr-auto'>
          <img src={assets.logo} alt="logo" className='w-12 sm:w-12' />
          <p className='mt-6 text-sm leading-relaxed'>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nostrum illum maiores praesentium? Natus quasi, odit error suscipit quis sequi culpa qui aut, quod, veniam deserunt eos nostrum. Ad, similique odit. Rerum unde quaerat eveniet cuque accusamus atque qui error quo enim fugiat?
          </p>
        </div>

        
        {footer_data.map((section, index) => (
          <div key={index} className='flex-shrink-0'>
            <h3 className='font-semibold text-base text-gray-900 md:mb-5 mb-2'>{section.title}</h3>
            <ul className='text-sm space-y-2'>
              {section.links.map((link, i) => (
                <li key={i}>
                  <a href='#' className='hover:underline transition duration-300'>{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div> */}

      
      <p className='py-4 text-center text-sm md:text-base text-gray-500/80'>Copyright 2025 Ovindu Pathiraja - All Right Reserved.</p>
    </div>
  )
}

export default Footer;