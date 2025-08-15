import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Categories from '../components/Categories';
import BrandStory from '../components/BrandStory';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const HomePage = () => {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Categories />
      <BrandStory />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default HomePage;