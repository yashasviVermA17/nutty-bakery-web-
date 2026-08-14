import { createFileRoute } from "@tanstack/react-router";
import {
  Hero,
  Marquee,
  Categories,
  Menu,
  About,
  Gallery,
  Testimonials,
  HappyCustomers,
  Process,
  Offer,
  InstagramFeed,
  Contact,
} from "../components/site/sections";
import { InstagramReels } from "../components/site/instagram-reels";

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
      <About />
      <Gallery />
      <Testimonials />
      <HappyCustomers />
      <Process />
      <Offer />
      <InstagramFeed />
      <InstagramReels />
      <Contact />
    </>
  );
}
