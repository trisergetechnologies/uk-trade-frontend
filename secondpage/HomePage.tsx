
import Navbar from "@/components/headersection/Navbar";
import Hero from "@/components/herosection/Hero";
import Hero2 from "@/components/herosection/Hero2";
import Hero3 from "@/components/herosection/Hero3";
import Footer from "@/components/footer/Footer";
// import MLMNetwork3D from "@/components/herosection/MLMNetwork3D";
import Hero3D from "@/components/herosection/Hero3D";

export default function HomePage() {
  return (
    <>
     
      <Navbar/>
      <Hero3D/>
      <Hero />
      <Hero2/>
      <Hero3/>
      <Footer/>
    
    </>
  );
}