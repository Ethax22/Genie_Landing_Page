import React from 'react';
import Hero3D from '@/components/Hero3D/Hero3D';
import WorkflowSection from '@/components/WorkflowSection';
import IndiaSection from '@/components/IndiaSection';
import MonetizationSection from '@/components/MonetizationSection';
import SecuritySection from '@/components/SecuritySection';
import CollaborationSection from '@/components/CollaborationSection';
import MobileSection from '@/components/MobileSection';
import DemoFlow from '@/components/DemoFlow';
import TechStackSection from '@/components/TechStackSection';
import FinalCTA from '@/components/FinalCTA';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-navy selection:bg-brand-glow/30">
      <Hero3D />
      <WorkflowSection />
      <IndiaSection />
      <MonetizationSection />
      <SecuritySection />
      <CollaborationSection />
      <MobileSection />
      <DemoFlow />
      <TechStackSection />
      <FinalCTA />
    </main>
  );
}
