import React from 'react';
import facebookImg from '../../src/assets/facebook.png';
import wattsAppImg from '../../src/assets/wattsapp.png';
import { Link } from 'react-router-dom';

function FooterApp() {
    const phoneNumber = '+201143915234';
    return (
        <footer className="bg-neutral-800 text-white p-4 text-center">

            <div className='flex justify-center items-center space-x-5'>
                <Link className="" to="https://www.facebook.com/TheKnightWithMrAhmed" target="_blank">
                    <img src={facebookImg} className="w-10 h-10" alt="facebook site" loading="lazy" />
                </Link>
                <Link to={`https://wa.me/${phoneNumber}`} target="_blank" >
                    <img src={wattsAppImg} className="w-10 h-12 mt-2.5" alt="WattsApp site" loading="lazy" />
                </Link>
            </div>

             <div className="mb-4">
       
        <ul className="flex justify-center flex-wrap gap-4 text-sm text-stone-300">
          <li><Link to="/terms-and-conditions" className="hover:text-amber-400">Terms & Conditions</Link></li>
          <li><Link to="/privacy-policy" className="hover:text-amber-400">Privacy Policy</Link></li>
          <li><Link to="/refund-policy" className="hover:text-amber-400">Refund Policy</Link></li>
          <li><Link to="/shipping-policy" className="hover:text-amber-400">Shipping Policy</Link></li>
          <li><Link to="/about-us" className="hover:text-amber-400">About Us</Link></li>
        </ul>
      </div>
            <div className="text-center text-stone-300 text-xs font-bold leading-normal">
                هذه المنصة لمساعدة الطالب في مادة اللغة الإنجليزية خلال فترة التعليم.
            </div>
              <div className="text-stone-400 text-sm leading-relaxed font-medium mt-2">
        <p>📍 العنوان: بني سويف شرق النيل أمام كلية الدراسات</p>
        <p>📧 البريد الإلكتروني: <a href="mailto:theknightahmedgaber@gmail.com" className="text-amber-400 hover:text-amber-300">theknightahmedgaber@gmail.com</a></p>
      </div>
            <Link className="mt-1 text-center text-stone-300 text-sm font-bold leading-normal" to="https://www.facebook.com/vfidigital?mibextid=ZbWKwL" target="_blank" >
                Developed By: <span className=' text-sky-400  hover:text-sky-500'>VFI Digital Services</span>
            </Link>
            <div className="mt-1 pb-1 text-center text-amber-400 text-xs font-bold leading-normal">
                All Copy Rights Reserved 2025 &copy;
            </div>
        </footer>
    );
}

export default FooterApp;