export default function About({ content }) {
  const title = content?.title || 'About Rahman & Associates';
  const description = content?.description || 'With over two decades of combined experience, our team of dedicated attorneys provides exceptional legal representation. We believe in a client-first approach, ensuring open communication and aggressive advocacy.';
  const yearsExperience = content?.yearsExperience || '20+';

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <div className="mb-10 lg:mb-0">
            <div className="aspect-w-3 aspect-h-2 rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center h-80">
              <span className="text-gray-400 text-5xl">🏢</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-6">
              {title}
            </h2>
            <div className="prose prose-lg text-gray-500 mb-8 whitespace-pre-wrap">
              <p>{description}</p>
            </div>
            
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-4xl font-extrabold text-indigo-600">{yearsExperience}</p>
                  <p className="mt-2 text-base font-medium text-gray-500">Years of Experience</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-indigo-600">5k+</p>
                  <p className="mt-2 text-base font-medium text-gray-500">Cases Won</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
