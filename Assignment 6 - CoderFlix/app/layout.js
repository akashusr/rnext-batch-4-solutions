import "./globals.css";

export const metadata = {
  title: "CoderFlix - Watch Videos",
  description: "Watch and explore amazing coding videos on CoderFlix",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#141414] text-[#e5e5e5]">{children}</body>
    </html>
  );
}
