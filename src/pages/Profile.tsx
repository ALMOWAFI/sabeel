import React from 'react';
import SabeelUserProfile from '@/components/profile/SabeelUserProfile';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const ProfilePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <SabeelUserProfile />
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
