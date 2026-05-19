import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Rahman & Associates - Professional Legal Counsel',
  description: 'Expert legal counsel you can trust. We provide comprehensive legal solutions for businesses and individuals.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
