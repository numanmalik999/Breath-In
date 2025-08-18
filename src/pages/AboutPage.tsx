import { Leaf, Heart, Users, Target } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const AboutPage = () => {
  const { settings } = useSettings();

  return (
    <div className="bg-offWhite">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-charcoal mb-4">
            {settings?.about_page_title || 'About Breathin'}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {settings?.about_page_subtitle || 'We believe that better breathing leads to a better life. Discover the story and the mission behind our innovative wellness solutions.'}
          </p>
        </section>

        {/* Story Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif text-charcoal">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              {settings?.about_page_story_p1 || "At Breathin, we started with a simple observation: the quality of our breath has a profound impact on our overall well-being, especially our sleep. Frustrated by the lack of comfortable and effective solutions for nasal congestion, we set out to create something revolutionary."}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {settings?.about_page_story_p2 || "Our journey led us to develop innovative magnetic nasal strips that gently open nasal passages without harsh adhesives or discomfort. It’s a simple idea powered by smart technology, designed to help you experience the transformative difference that effortless breathing can make."}
            </p>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full bg-sageGreen rounded-2xl opacity-10"></div>
            <img 
              src="https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg" 
              alt="Person sleeping peacefully"
              className="relative w-full rounded-2xl shadow-xl"
            />
          </div>
        </section>

        {/* Mission Section */}
        <section className="text-center mb-20">
          <Target className="mx-auto h-10 w-10 text-terracotta mb-4" />
          <h2 className="text-3xl font-serif text-charcoal mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our mission is to empower individuals to take control of their respiratory wellness through innovative, user-friendly products. We are committed to enhancing sleep quality and daily vitality by making better breathing accessible to everyone.
          </p>
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-3xl font-serif text-charcoal text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
              <div className="bg-sageGreen p-3 rounded-full inline-block mb-4">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2 text-lg">Innovation</h3>
              <p className="text-gray-600 text-sm">We pioneer revolutionary designs that are both comfortable and highly effective.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
              <div className="bg-dustyBlue p-3 rounded-full inline-block mb-4">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2 text-lg">Wellness-Focused</h3>
              <p className="text-gray-600 text-sm">Every product is clinically tested and proven to improve breathing and sleep quality.</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-sm">
              <div className="bg-terracotta p-3 rounded-full inline-block mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-charcoal mb-2 text-lg">Customer Dedication</h3>
              <p className="text-gray-600 text-sm">We are dedicated to helping you achieve better breathing and more restful sleep.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;