import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-indigo-600">Rahman & Associates</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <a href="#home" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="#services" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Services</a>
            <a href="#about" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
            <a href="#contact" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
            <Link href="/admin" className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
