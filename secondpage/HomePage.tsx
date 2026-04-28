import Navbar from "@/components/headersection/Navbar";
import LandingHero from "@/components/landing/LandingHero";
import HomeSections from "@/components/landing/HomeSections";
import Footer from "@/components/footer/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <LandingHero />
      <HomeSections />
      <Footer />
    </>
  );
}
