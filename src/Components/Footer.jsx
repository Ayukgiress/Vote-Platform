import React from 'react'
import { useTranslation } from 'react-i18next';
import { MdLocationOn } from "react-icons/md";
import { MdMarkEmailRead } from "react-icons/md";
import { FaPhoneVolume } from "react-icons/fa6";
import { BsFacebook } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FiArrowUp } from "react-icons/fi";
import { Heart, Sparkles, ArrowUp, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const { t } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Main Footer Section */}
      <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {/* Brand & Description */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                {/*  */}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {t('footer.title')}
                </h1>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                {t('footer.description')}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <a 
                  href="https://facebook.com/Choosify" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group bg-white/10 hover:bg-blue-500 backdrop-blur-sm p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <BsFacebook className="w-5 h-5 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="https://linkedin.com/company/Choosify" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group bg-white/10 hover:bg-blue-600 backdrop-blur-sm p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <FaLinkedin className="w-5 h-5 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="https://twitter.com/Choosify" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group bg-white/10 hover:bg-blue-400 backdrop-blur-sm p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  <FaTwitter className="w-5 h-5 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {t('footer.contacts')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300">
                  <div className="bg-blue-500/20 group-hover:bg-blue-500/30 backdrop-blur-sm p-3 rounded-lg transition-all duration-300">
                    <MapPin className="h-5 w-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm uppercase tracking-wide">Location</p>
                    <p className="text-white font-medium">{t('footer.location')}</p>
                  </div>
                </div>
                
                <a 
                  href="mailto:Choosify@gmail.com" 
                  className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300"
                >
                  <div className="bg-green-500/20 group-hover:bg-green-500/30 backdrop-blur-sm p-3 rounded-lg transition-all duration-300">
                    <Mail className="h-5 w-5 text-green-300" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm uppercase tracking-wide">Email</p>
                    <p className="text-white font-medium group-hover:text-green-300 transition-colors">
                      {t('footer.email')}
                    </p>
                  </div>
                </a>
                
                <a 
                  href="tel:+237676184440" 
                  className="flex items-center gap-4 group hover:translate-x-2 transition-transform duration-300"
                >
                  <div className="bg-purple-500/20 group-hover:bg-purple-500/30 backdrop-blur-sm p-3 rounded-lg transition-all duration-300">
                    <Phone className="h-5 w-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm uppercase tracking-wide">Phone</p>
                    <p className="text-white font-medium group-hover:text-purple-300 transition-colors">
                      {t('footer.phone')}
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Links & Newsletter */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Stay Updated
              </h2>
              <div className="space-y-4">
                <p className="text-gray-300">
                  Subscribe to get updates on new features and contests.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="absolute bottom-6 right-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
        </button>
      </footer>

      {/* Copyright Section */}
      <section className="bg-gradient-to-br from-gray-950 to-slate-900 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <span>© {currentYear} Choosify. {t('footer.copyright')}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Footer