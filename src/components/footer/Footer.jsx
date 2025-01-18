import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import footer2 from '../../assets/images/loginui.png';

const Footer = () => {
  return (
    <footer className="bg-gray-100 bg-opacity-90 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={footer2}
          alt="Background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-red-500">Robsell</h2>
            <p className="text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing.</p>
            <div className="rounded-lg overflow-hidden">
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Learn More</h3>
            <ul className="space-y-2">
              {['About Us', 'Latest Items', 'Hot Offers', 'Popular designs', 'FAQ', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-red-500 transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Our Community</h3>
            <ul className="space-y-2">
              {['Terms and Conditions', 'Special Offers', 'Customer Reviews'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-600 hover:text-red-500 transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Us</h3>
            <p className="text-gray-600 mb-2">Contact Number: 123-456-7890</p>
            <p className="text-gray-600 mb-4">Email Address: info@robsell.com</p>
            <h4 className="text-lg font-semibold mb-2 text-gray-800">Social</h4>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Youtube, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-600 hover:text-red-500 transition-colors duration-200"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between items-center">
          <p className="text-gray-600">&copy; 2024 Robsell</p>
          <p className="text-gray-600">All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;