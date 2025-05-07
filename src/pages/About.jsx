import React from 'react';
import { useData } from '../context/DataContext';

const About = () => {
  const { aboutContent } = useData();
  
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-16 h-80 md:h-96">
        <img 
          src={aboutContent.heroImage} 
          alt="Wolke Carwash" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{aboutContent.welcomeMessage}</h1>
          <p className="text-white/90 text-lg max-w-2xl">{aboutContent.mainDescription}</p>
        </div>
      </div>
      
      {/* Content Sections */}
      <div className="max-w-5xl mx-auto">
        {aboutContent.sections.map((section, index) => (
          <div 
            key={section.id} 
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 mb-20 items-center`}
          >
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden h-64 md:h-96">
                <img 
                  src={section.image} 
                  alt={section.title} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-primary">{section.title}</h2>
              <p className="text-base-content/80 leading-relaxed">{section.content}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Stats Section */}
      <div className="bg-base-200 rounded-xl p-8 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Wolke Carwash in Zahlen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {aboutContent.stats.map(stat => (
            <div key={stat.id} className="flex flex-col items-center text-center p-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                {stat.icon === 'users' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                )}
                {stat.icon === 'car' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"></path>
                    <circle cx="6.5" cy="16.5" r="2.5"></circle>
                    <circle cx="16.5" cy="16.5" r="2.5"></circle>
                  </svg>
                )}
                {stat.icon === 'calendar' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                )}
                {stat.icon === 'bottle' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 2h8M9 2v3H6l1 3h10l1-3h-3V2M8 8v13a1 1 0 001 1h6a1 1 0 001-1V8"></path>
                  </svg>
                )}
              </div>
              <span className="text-4xl font-bold text-primary mb-2">{stat.value}</span>
              <span className="text-base-content/70">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-center mb-12">Kontaktinformationen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-base-content mb-1">Adresse</h3>
              <p className="text-base-content/70">{aboutContent.contactInfo.address}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-base-content mb-1">Telefon</h3>
              <p className="text-base-content/70">{aboutContent.contactInfo.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-base-content mb-1">E-Mail</h3>
              <p className="text-base-content/70">{aboutContent.contactInfo.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-base-content mb-1">Öffnungszeiten</h3>
              <p className="text-base-content/70">{aboutContent.contactInfo.workingHours}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 