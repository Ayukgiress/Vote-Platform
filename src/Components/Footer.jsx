import React from 'react'
import { useTranslation } from 'react-i18next';
import { MdLocationOn } from "react-icons/md";
import { MdMarkEmailRead } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa6";
import { BsFacebook } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";

const Footer = () => {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <section className="relative flex flex-col md:flex-row items-center justify-around bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8 min-h-[20rem] shadow-lg">
        <div className="flex flex-col justify-center gap-6 items-start max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold 3xl:text-5xl drop-shadow-md">{t('footer.title')}</h1>
          <p className="text-sm md:text-base 3xl:text-2xl leading-relaxed">
            {t('footer.description')}
          </p>
        </div>
        <div className="flex flex-col items-start justify-center gap-6">
          <h2 className="text-xl md:text-2xl font-semibold 3xl:text-4xl">{t('footer.contacts')}</h2>
          <div className="flex items-center gap-3 hover:text-blue-200 transition-colors cursor-pointer">
            <MdLocationOn className="text-lg" />
            <span className="text-sm md:text-base">{t('footer.location')}</span>
          </div>
          <a href="mailto:VoteHub@gmail.com" className="flex items-center gap-3 hover:text-blue-200 transition-colors">
            <MdMarkEmailRead className="text-lg" />
            <span className="text-sm md:text-base">{t('footer.email')}</span>
          </a>
          <a href="tel:+237676184440" className="flex items-center gap-3 hover:text-blue-200 transition-colors">
            <FaPhoneVolume className="text-lg" />
            <span className="text-sm md:text-base">{t('footer.phone')}</span>
          </a>
        </div>
        <div className="flex flex-col items-center justify-center gap-6">
          <h2 className="text-xl md:text-2xl font-semibold 3xl:text-4xl">{t('footer.followUs')}</h2>
          <div className="flex items-center gap-4">
            <a href="https://facebook.com/votehub" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <BsFacebook className="w-8 h-8 md:w-10 md:h-10 3xl:w-14 3xl:h-14" />
            </a>
            <a href="https://linkedin.com/company/votehub" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <FaLinkedin className="w-8 h-8 md:w-10 md:h-10 3xl:w-14 3xl:h-14" />
            </a>
            <a href="https://twitter.com/votehub" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
              <FaTwitter className="w-8 h-8 md:w-10 md:h-10 3xl:w-14 3xl:h-14" />
            </a>
          </div>
        </div>
        <button
          onClick={scrollToTop}
          className="absolute bottom-4 right-4 bg-white text-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
          aria-label="Back to top"
        >
          <FiArrowUp className="text-xl" />
        </button>
      </section> 
      <section className="w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center border-t border-blue-700">
        <div className="text-center text-white text-sm md:text-base">
          {t('footer.copyright')}
        </div>
      </section>
    </>
  )
}

export default Footer
