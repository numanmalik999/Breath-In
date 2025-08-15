import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    rating: 5,
    text: 'Breathin strips have completely transformed my sleep. I can breathe so much better at night and wake up feeling refreshed for the first time in years.',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
  },
  {
    name: 'David Chen',
    rating: 5,
    text: 'I was skeptical about magnetic nasal strips, but these actually work! No more mouth breathing at night and my partner says I snore less.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
  },
  {
    name: 'Emma Rodriguez',
    rating: 5,
    text: 'As someone with chronic congestion, these strips are a game-changer. They\'re comfortable to wear and actually help me breathe better.',
    image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg'
  },
  {
    name: 'Michael Thompson',
    rating: 5,
    text: 'The refill system is so convenient and the strips last longer than I expected. Great value and they really improve my sleep quality.',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg'
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-offWhite">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-4">
            What Our Community Says
          </h2>
          <p className="text-lg text-gray-600">
            Real stories from people who've found their calm with Breathe.
          </p>
        </div>
        
        <div className="relative">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="flex items-center justify-center mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <blockquote className="text-lg md:text-xl text-gray-700 text-center mb-8 leading-relaxed">
              "{testimonials[currentIndex].text}"
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4">
              <img 
                src={testimonials[currentIndex].image} 
                alt={testimonials[currentIndex].name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-center">
                <h4 className="font-semibold text-charcoal">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-sm text-gray-600">Verified Customer</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-charcoal" />
          </button>
          
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <ChevronRight className="h-5 w-5 text-charcoal" />
          </button>
        </div>
        
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-sageGreen' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;