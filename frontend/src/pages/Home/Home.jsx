import Navbar from "../../components/common/Navbar";
import HeroSection from "../../components/home/HeroSection";
import TrustedCompanies from "../../components/home/TrustedCompanies";
import FeaturesSection from "../../components/home/FeaturesSection";
import HowItWorks from "../../components/home/HowItWorks";
import BenefitsSection from "../../components/home/BenefitsSection";
import CTASection from "../../components/home/CTASection";
import Footer from "../../components/common/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <TrustedCompanies />
      <FeaturesSection />
      <HowItWorks />
      <BenefitsSection />
      <CTASection />
      <Footer />
    </>
  );
}

export default Home;