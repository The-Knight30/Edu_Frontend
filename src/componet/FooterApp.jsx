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
            <div className="text-center text-stone-300 text-xs font-bold leading-normal">
                هذه المنصة لمساعدة الطالب في مادة اللغة الإنجليزية خلال فترة التعليم.
            </div>
            <Link className="mt-1 text-center text-stone-300 text-sm font-bold leading-normal" to="https://www.facebook.com/vfidigital?mibextid=ZbWKwL" target="_blank" >
                Developed By: <span className=' text-sky-400  hover:text-sky-500'>VFI Digital Services</span>
            </Link>
            <div className="mt-1 pb-1 text-center text-amber-400 text-xs font-bold leading-normal">
                All Copy Rights Reserved 2024 &copy;
            </div>
        </footer>
    );
}

export default FooterApp;