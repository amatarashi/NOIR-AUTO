import { SiteHeader } from "@/components/SiteHeader";
import { Hero } from "@/components/Hero";
import { CatalogSection } from "@/components/catalog/CatalogSection";
import { About } from "@/components/About";
import { Reviews } from "@/components/Reviews";
import { Faq } from "@/components/Faq";
import { Calculator } from "@/components/calculator/Calculator";
import { ContactSection } from "@/components/contact/ContactSection";
import { Footer } from "@/components/Footer";
import { BRAND_NAME } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <SiteHeader brandName={BRAND_NAME} />
      <main>
        <Hero brandName={BRAND_NAME} />
        <CatalogSection />
        <About />
        <Reviews />
        <Faq />
        <Calculator />
        <ContactSection />
      </main>
      <Footer brandName={BRAND_NAME} />
    </>
  );
}
