import React from "react";
import Banner from "../Banner/Banner";
import ServiceSection from "../ServiceSection/ServiceSection";
import HowItWorks from "../HowItWorks/HowItWorks";
import CompanySlider from "../CompanySlider/CompanySlider";
import FeaturedSection from "../FeaturedSection/FeaturedSection";
import MerchantSection from "../MerchantSection/MerchantSection";
import TestimonialSlider from "../TestimonialSlider/TestimonialSlider";
import FAQSection from "../FAQSection/FAQSection";

const Home = () => {
  return (
    <>
      <Banner></Banner>
      <HowItWorks></HowItWorks>
      <ServiceSection></ServiceSection>
      <CompanySlider></CompanySlider>
      <FeaturedSection></FeaturedSection>
      <MerchantSection></MerchantSection>
      <TestimonialSlider></TestimonialSlider>
      <FAQSection></FAQSection>
    </>
  );
};

export default Home;
