
import React from 'react';
import Hero from '@/components/Hero';
import KeyFeatures from '@/components/KeyFeatures';
import Vision from '@/components/Vision';
import ForWho from '@/components/ForWho';
import CallToAction from '@/components/CallToAction';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <KeyFeatures />
        <Vision />
        <ForWho />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
