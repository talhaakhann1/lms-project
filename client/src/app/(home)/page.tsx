import Hero from "../../components/landing/Hero";
import Footer from "../../components/layout/Footer";
import { FeaturedCourses } from "../../components/landing/FeaturedCourses";
import TestimonialsPage from "../../components/pages/TestimonialPage";
import FaqsPage from "../../components/pages/FaqsPage";
import InstructorsPage from "../../components/pages/InstructorPage";


export default function Home() {

  return (
    <>
      <Hero />
      <FeaturedCourses />
      <InstructorsPage />
      <TestimonialsPage />
      <FaqsPage />
      <Footer />
    </>
  )
}