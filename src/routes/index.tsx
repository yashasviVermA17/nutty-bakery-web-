import { createFileRoute } from "@tanstack/react-router";
import {
  Hero,
  Marquee,
  Categories,
  Menu,
  BestSellers,
  About,
  Gallery,
  Testimonials,
  HappyCustomers,
  Process,
  Offer,
  InstagramFeed,
  Contact,
} from "../components/site/sections";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <Categories />
      <Menu />
      <BestSellers />
      <About />
      <Gallery />
      <Testimonials />
      <HappyCustomers />
      <Process />
      <Offer />
      <InstagramFeed />
      <Contact />
    </>
  );
}
