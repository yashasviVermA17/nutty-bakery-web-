import { createFileRoute } from "@tanstack/react-router";
import { About, HappyCustomers, Process, Testimonials } from "../components/site/sections";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <About />
      <HappyCustomers />
      <Process />
      <Testimonials />
    </>
  );
}
