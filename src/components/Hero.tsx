import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.pexels.com/photos/6692928/pexels-photo-6692928.jpeg" 
          alt="Serene wellness environment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-6 animate-fade-in">
          Breathe Better.
          <br />
          <span className="text-warmBeige">Sleep Better.</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 animate-slide-up opacity-90 font-light">
          Revolutionary magnetic nasal strips for natural breathing enhancement.
        </p>
        <Link 
          to="/shop"
          className="inline-block bg-sageGreen text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 animate-slide-up shadow-lg"
        >
          Shop Breathin
        </Link>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;