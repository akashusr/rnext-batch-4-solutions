import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { ToastProvider } from "@/components/Toast";
import { CartProvider } from "@/components/CartContext";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = {
  title: "Gadgets BD - Your One-Stop Tech Shop",
  description: "Shop the latest gadgets, laptops, phones, and accessories at Gadgets BD",
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ToastProvider>
            <CartProvider>
              {children}
              {modal}
              <ScrollToTop />
            </CartProvider>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
