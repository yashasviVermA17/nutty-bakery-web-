import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import { CartProvider } from "./lib/cart";
import { OrderNowProvider } from "./components/site/order-now";
import "./index.css";

const router = getRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;

createRoot(rootElement).render(
  <StrictMode>
    <CartProvider>
      <OrderNowProvider>
        <RouterProvider router={router} />
      </OrderNowProvider>
    </CartProvider>
  </StrictMode>,
);
