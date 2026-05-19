import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import ContactForm from '@/components/ContactForm';

// Fetch content server-side
async function getContent() {
  try {
    // In server components, it's better to talk to the DB directly rather than calling our own API
    // but for simplicity and following the project structure, we use the API
    // We need to use an absolute URL for fetch in Server Components
    const url = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${url}/api/content`, { next: { revalidate: 60 } }); // revalidate every minute
    
    if (!res.ok) throw new Error('Failed to fetch content');
    
    const json = await res.json();
    return json.data || {};
  } catch (error) {
    console.error('Error fetching content:', error);
    return {};
  }
}

export default async function Home() {
  const contentMap = await getContent();

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero content={contentMap['hero']} />
      <Services content={contentMap['services']} />
      <About content={contentMap['about']} />
      <ContactForm />
      
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-400">
              &copy; {new Date().getFullYear()} Rahman & Associates. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
