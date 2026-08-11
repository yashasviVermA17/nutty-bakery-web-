import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Navbar, Footer } from "../components/site/nav";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}
