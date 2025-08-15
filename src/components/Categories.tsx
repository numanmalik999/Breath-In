import { Flower, Home, BookOpen, Coffee } from 'lucide-react';

const categories = [
  {
    name: 'Starter Kit',
    description: 'Complete magnetic nasal strip system',
    icon: Flower,
    color: 'bg-sageGreen',
    image: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg'
  },
  {
    name: 'Refills',
    description: 'Replacement strips for continued use',
    icon: Home,
    color: 'bg-dustyBlue',
    image: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg'
  },
  {
    name: 'Better Sleep',
    description: 'Natural solutions for improved rest',
    icon: BookOpen,
    color: 'bg-terracotta',
    image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg'
  },
  {
    name: 'Breathing Health',
    description: 'Products for respiratory wellness',
    icon: Coffee,
    color: 'bg-sageGreen',
    image: 'https://images.pexels.com/photos/6975474/pexels-photo-6975474.jpeg'
  }
];

const Categories = () => {
  return (
    <section className="py-20 bg-offWhite">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our thoughtfully curated collections designed to enhance every aspect of your wellness journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div 
              key={index}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative overflow-hidden rounded-2xl h-80 mb-4">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <div className={`${category.color} p-3 rounded-full w-fit mb-3 bg-opacity-80`}>
                    <category.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm opacity-90">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;