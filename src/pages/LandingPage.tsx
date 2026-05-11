import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { SupportSection } from '../components/SupportSection';
import { MembershipSection } from '../components/MembershipSection';
import { ShopSection } from '../components/ShopSection';
import { StatsSection } from '../components/StatsSection';
import { Testimonials } from '../components/Testimonials';
import { WallOfLove } from '../components/WallOfLove';
import { FeaturesSection } from '../components/FeaturesSection';
import { FAQ } from '../components/FAQ';
import { Footer } from '../components/Footer';
import { FinalCTA } from '../components/FinalCTA';
export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <SupportSection />
        <MembershipSection />
        <ShopSection />
        <StatsSection />
        <Testimonials />
        <WallOfLove />
        <FeaturesSection />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>);

}