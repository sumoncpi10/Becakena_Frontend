import Navbar from "../components/Navbar";
import "./globals.css";


export const metadata = {
  icons: {
    icon: "/favicon.svg",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        
        {/* Navbar */}
        <header className="sticky top-0 z-50">
          <Navbar />
        </header>

        {/* Page Content */}
        <main className="pt-4">
          {children}
        </main>

        {/* Footer (optional) */}
        <footer className="mt-8 p-4 text-center text-sm text-gray-500">
          © 2026 BecaKena. All rights reserved.
        </footer>

      </body>
    </html>
  );
}