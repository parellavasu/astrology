import React, { useRef } from 'react';
import HeroSection from '../components/home/HeroSection';
import QuickKundliForm from '../components/home/QuickKundliForm';
import ZodiacGrid from '../components/home/ZodiacGrid';
import ServicesGrid from '../components/home/ServicesGrid';
import HoroscopePreview from '../components/home/HoroscopePreview';
import TrustSection from '../components/home/TrustSection';

export default function Home() {
  const formRef = useRef(null);

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <HeroSection onScrollToForm={handleScrollToForm} />
      <QuickKundliForm formRef={formRef} />
      <ServicesGrid />
      <HoroscopePreview />
      <ZodiacGrid />
      <TrustSection />
    </div>
  );
}
