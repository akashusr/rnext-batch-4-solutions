import "./globals.css";

export const metadata = {
  title: "Dev News",
  description: "Signals from the builders shaping tomorrow.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-zinc-100">
        {children}
        <div id="modal-root-content"></div>
      </body>
    </html>
  );
}
