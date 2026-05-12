import React from "react";
import { Navbar } from "../components/Navbar_light";
import { Hero } from "../components/Hero_light";
import { SupportSection } from "../components/SupportSection_light";
import { MembershipSection } from "../components/MembershipSection_light";
import { FeaturesSection } from "../components/FeaturesSection_light";
import { Testimonials } from "../components/Testimonials_light";
import { FAQ } from "../components/FAQ_light";
import { FinalCTA } from "../components/FinalCTA_light";
import { Footer } from "../components/Footer_light";

export function LandingPageLight() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <SupportSection />
        <MembershipSection />
        <FeaturesSection />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
