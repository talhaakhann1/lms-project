import Hero from "../../components/landing/Hero";
import Footer from "../../components/layout/Footer";
import { FeaturedCourses } from "../../components/landing/FeaturedCourses";
import TestimonialsPage from "../../components/pages/TestimonialPage";
import FaqsPage from "../../components/pages/FaqsPage";
import InstructorsPage from "../../components/pages/InstructorPage";
import { HowItWorks } from "@/src/components/landing/Howitworks";
import { CtaBanner } from "@/src/components/landing/Ctabanner";


export default function Home() {

  return (
    <>
      <Hero />
      <HowItWorks/>
      <FeaturedCourses />
      <InstructorsPage />
      <TestimonialsPage />
      <FaqsPage />
      <CtaBanner/>
      <Footer />
    </>
  )
}