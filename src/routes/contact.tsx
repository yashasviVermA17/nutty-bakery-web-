import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "../components/site/sections";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <div className="pt-24 md:pt-32">
        <Contact />
      </div>
    </>
  );
}
