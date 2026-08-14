import { createFileRoute } from "@tanstack/react-router";
import {
  Hero,
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
      <Categories />
      <Menu />
      <BestSellers />
      <About />
      <HappyCustomers />
      <Gallery />
      <Testimonials />
      <Process />
      <Offer />
      <InstagramFeed />
      <Contact />
    </>
  );
}
