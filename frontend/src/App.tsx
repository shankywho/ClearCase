import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useLenis } from '@/hooks/useLenis';
import { initScrollTriggers } from '@/lib/scrollTriggers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Preloader } from '@/components/common/Preloader';

// Top-Level Pages
import { Home } from '@/routes/Home';
import { Work } from '@/routes/Work';
import { About } from '@/routes/About';
import { Approach } from '@/routes/Approach';
import { Faq } from '@/routes/Faq';
import { Contact } from '@/routes/Contact';
import { Benchmark } from '@/routes/Benchmark';

// Live Dispute Resolution & Cadastral Operations
import { Resolve } from '@/routes/Resolve';
import { LandRecords } from '@/routes/LandRecords';
import { Mediator } from '@/routes/Mediator';
import { Verify } from '@/routes/Verify';

// Case Studies
import { LandDemarcation } from '@/routes/work/LandDemarcation';
import { HarvestWages } from '@/routes/work/HarvestWages';
import { CartTrackObstruction } from '@/routes/work/CartTrackObstruction';
import { TubewellWatercourse } from '@/routes/work/TubewellWatercourse';
import { SharecroppingDivision } from '@/routes/work/SharecroppingDivision';
import { CommercialShopTenancy } from '@/routes/work/CommercialShopTenancy';
import { PastureEncroachment } from '@/routes/work/PastureEncroachment';
import { UsuriousDebtEscalation } from '@/routes/work/UsuriousDebtEscalation';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const AppContent: React.FC = () => {
  useLenis();

  useEffect(() => {
    initScrollTriggers();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Preloader />
      <ScrollToTop />
      <Header />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/resolve" element={<Resolve />} />
          <Route path="/land-records" element={<LandRecords />} />
          <Route path="/mediator" element={<Mediator />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/approach" element={<Approach />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/benchmark" element={<Benchmark />} />

          {/* 8 ClearCase Dispute Accords */}
          <Route path="/work/land-demarcation" element={<LandDemarcation />} />
          <Route path="/work/harvest-wages" element={<HarvestWages />} />
          <Route path="/work/cart-track-obstruction" element={<CartTrackObstruction />} />
          <Route path="/work/tubewell-watercourse" element={<TubewellWatercourse />} />
          <Route path="/work/sharecropping-division" element={<SharecroppingDivision />} />
          <Route path="/work/commercial-shop-tenancy" element={<CommercialShopTenancy />} />
          <Route path="/work/pasture-encroachment" element={<PastureEncroachment />} />
          <Route path="/work/usurious-debt-escalation" element={<UsuriousDebtEscalation />} />

          {/* Backward compatibility aliases */}
          <Route path="/work/mountain-dew" element={<LandDemarcation />} />
          <Route path="/work/play-it" element={<HarvestWages />} />
          <Route path="/work/namaha" element={<CartTrackObstruction />} />
          <Route path="/work/zerocircle" element={<TubewellWatercourse />} />
          <Route path="/work/google-japan" element={<SharecroppingDivision />} />
          <Route path="/work/lore" element={<CommercialShopTenancy />} />
          <Route path="/work/greed" element={<PastureEncroachment />} />
          <Route path="/work/zamazama" element={<UsuriousDebtEscalation />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
