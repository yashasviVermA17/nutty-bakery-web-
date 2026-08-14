import { createFileRoute } from "@tanstack/react-router";
import { Hero, About, HappyCustomers, Process, Testimonials } from "../components/site/sections";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <Hero />
      <About />
      <HappyCustomers />
      <Process />
      <Testimonials />
    </>
  );
}
