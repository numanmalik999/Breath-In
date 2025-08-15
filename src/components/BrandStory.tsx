import { Leaf, Heart, Users } from 'lucide-react';

const BrandStory = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-6">
                The Breathin Story
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                At Breathin, we believe that better breathing leads to better living. 
                Our revolutionary magnetic nasal strips are designed to naturally enhance your breathing and improve your sleep quality.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Using innovative magnetic technology, our strips gently open nasal passages without adhesives or discomfort. 
                Experience the difference that effortless breathing can make in your daily life and nightly rest.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-sageGreen p-2 rounded-full">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">Innovative Technology</h3>
                  <p className="text-gray-600 text-sm">Revolutionary magnetic design that's comfortable and effective.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-dustyBlue p-2 rounded-full">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">Clinically Tested</h3>
                  <p className="text-gray-600 text-sm">Proven to improve breathing and sleep quality in clinical studies.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-terracotta p-2 rounded-full">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">Customer Focused</h3>
                  <p className="text-gray-600 text-sm">Dedicated to helping you achieve better breathing and restful sleep.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full bg-sageGreen rounded-2xl opacity-10"></div>
            <img 
              src="https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg" 
              alt="Person sleeping peacefully"
              className="relative w-full rounded-2xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;