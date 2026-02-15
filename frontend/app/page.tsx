'use client';

import { BentoSection } from '@/components/landing-page/bento-section';
import { CTASection } from '@/components/landing-page/cta-section';
import { FeaturesSection } from '@/components/landing-page/features-section';
import { Footer } from '@/components/landing-page/footer';
import { Header } from '@/components/landing-page/header';
import { HeroSection } from '@/components/landing-page/hero-section';
import { HowItWorks } from '@/components/landing-page/how-it-works';
import { SocialProof } from '@/components/landing-page/social-proof';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const Home = () => {
  const { status } = useSession()

  if (status === 'authenticated') {
    redirect('/dashboard')
  }
  // else if (status === 'unauthenticated') {
  //   redirect('/auth/signin')
  // }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <BentoSection />
      <HowItWorks />
      <SocialProof />
      <CTASection />
      <Footer />
    </main>

  )
}

export default Home;