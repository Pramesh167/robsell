import React, { useEffect } from 'react';
import banner from '../../assets/images/registerui2.jpg';
import { GrSecure } from 'react-icons/gr';
import { GiGamepad, GiFoodTruck } from 'react-icons/gi'; // Import GiGamepad for the game controller icon
import AOS from 'aos';
import 'aos/dist/aos.css';

const Banner = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS with options
  }, []);

  return (
    <div className='min-h-[550px] flex justify-center items-center py-12 sm:py-0 bg-black'> {/* Optional: Added bg-black for better contrast with white text */}
      <div className='container'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 items-center'>
          {/* Image section */}
          <div data-aos='zoom-in'>
            <img
              src={banner}
              alt="Banner depicting summer sale on sunglasses"
              className='max-w-[400px] h-[350px] w-full mx-auto drop-shadow-[-10px_10px_12px_rgba(0,0,0,1)] object-cover'
            />
          </div>
          {/* Text details section */}
          <div className='flex flex-col justify-center gap-6 sm:pt-0'>
            <h1 className='text-3xl sm:text-4xl font-bold text-white'>
              Get premium bots on very good prices.
            </h1>
            <p className='text-sm text-gray-200 tracking-wide leading-5'>
              Discover our best Robots and fight the Tournament.
            </p>
            <div className='flex flex-col gap-4'>
              <div data-aos='fade-up' className='flex items-center gap-4'>
                <GrSecure className='text-4xl h-12 w-12 shadow-sm p-2 rounded-full bg-red-200' />
                <p className='text-lg text-white'>Quality Products</p>
              </div>
              <div data-aos='fade-up' className='flex items-center gap-4'>
                <GiGamepad className='text-4xl h-12 w-12 shadow-sm p-2 rounded-full bg-green-200' /> {/* Changed icon */}
                <p className='text-lg text-white'>Easy Control</p> {/* Updated text */}
              </div>
              <div data-aos='fade-up' className='flex items-center gap-4'>
                <GiFoodTruck className='text-4xl h-12 w-12 shadow-sm p-2 rounded-full bg-yellow-200' />
                <p className='text-lg text-white'>Trusted Service</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
