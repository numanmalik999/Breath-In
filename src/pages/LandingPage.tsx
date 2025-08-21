import { Link } from 'react-router-dom';
import { Star, Check, Zap, Moon, Wind } from 'lucide-react';
import Testimonials from '../components/Testimonials';
import FaqAccordion from '../components/FaqAccordion';
import Newsletter from '../components/Newsletter';
import { useSettings } from '../context/SettingsContext';

const LandingPage = () => {
  const { settings } = useSettings();

  return (
    <>
      {/* --- Hero Section --- */}
      <section className="bg-warmBeige">
        <div className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-1 text-yellow-500 mb-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
            </div>
            <p className="text-sm text-charcoal mb-4">Over 10,000+ Happy Sleepers</p>
            <h1 className="text-4xl md:text-5xl font-serif text-charcoal mb-6">
              {settings?.homepage_hero_title || "The Last Nasal Strip You'll Ever Need."}
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              {settings?.homepage_hero_subtitle || "Experience instant, drug-free relief from nasal congestion and snoring with our revolutionary magnetic strips. Breathe freely all night, every night."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/product/breathin-magnetic-nasal-strip-starter-kit" className="w-full sm:w-auto bg-sageGreen text-white px-8 py-4 rounded-lg font-medium hover:bg-opacity-90 transform hover:scale-105 transition-all duration-200 shadow-lg">
                Shop The Starter Kit
              </Link>
            </div>
          </div>
          <div>
            <img 
              src="/sleepin-women.webp" 
              alt="Woman sleeping peacefully with a nasal dilator, saying goodbye to nasal congestion and snoring"
              className="rounded-2xl shadow-xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* --- How It Works Section --- */}
      <section className="py-20 px-4">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal mb-4">{settings?.homepage_howto_title || "How To Use Breathin"}</h2>
          <p className="text-lg text-gray-600 mb-16">
            {settings?.homepage_howto_subtitle || "Traditional nasal strips use sticky, irritating adhesives. Breathin uses a revolutionary magnetic system that's comfortable, reusable, and more effective. Watch the video to see it in action."}
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-video">
              <iframe 
                src={settings?.homepage_video_url || "https://www.youtube.com/embed/wzYSozVzZrM?si=RQ1Y2-VwJepyu0ih"}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <div className="bg-sageGreen bg-opacity-10 p-4 rounded-full"><Zap className="h-8 w-8 text-sageGreen" /></div>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">1. Magnetic Attraction</h3>
            <p className="text-gray-600">Two small, powerful magnets create a gentle outward pull on your nasal passages.</p>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <div className="bg-dustyBlue bg-opacity-10 p-4 rounded-full"><Wind className="h-8 w-8 text-dustyBlue" /></div>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">2. Open Airways</h3>
            <p className="text-gray-600">This pull instantly opens your airways, allowing for maximum airflow and effortless breathing.</p>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-4">
              <div className="bg-terracotta bg-opacity-10 p-4 rounded-full"><Moon className="h-8 w-8 text-terracotta" /></div>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">3. Better Sleep</h3>
            <p className="text-gray-600">Enjoy deep, uninterrupted sleep without snoring or mouth-breathing. Wake up refreshed.</p>
          </div>
        </div>
      </section>

      {/* --- Benefits Section --- */}
      <section className="bg-offWhite py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="/colage.avif" 
              alt="Collage of people using the nasal dilator for all activities"
              className="rounded-2xl shadow-lg w-full h-auto object-cover"
            />
          </div>
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif text-charcoal">{settings?.homepage_benefits_title || "Breathe Easy, Live Better."}</h2>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Check className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div><strong className="text-charcoal">Instant Relief:</strong> Immediately opens nasal passages for better breathing.</div>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div><strong className="text-charcoal">Reduces Snoring:</strong> Promotes nasal breathing to significantly reduce snoring.</div>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div><strong className="text-charcoal">Comfortable & Reusable:</strong> No sticky adhesives. Skin-safe and designed for nightly use.</div>
              </li>
              <li className="flex items-start space-x-3">
                <Check className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                <div><strong className="text-charcoal">Drug-Free Solution:</strong> A natural, safe, and effective alternative to sprays and pills.</div>
              </li>
            </ul>
            <Link to="/product/breathin-magnetic-nasal-strip-starter-kit" className="inline-block bg-sageGreen text-white px-8 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200">
              Try Breathin Today
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* --- FAQ Section --- */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-charcoal text-center mb-12">
            Frequently Asked Questions
          </h2>
          <FaqAccordion title="How do the magnetic strips work?">
            Our strips use a patented system of micro-magnets. One part is a reusable magnetic band, and the other is a small, disposable magnetic strip. The attraction between them gently opens your nasal passages from the outside, without any skin-pulling adhesives.
          </FaqAccordion>
          <FaqAccordion title="Is it comfortable to wear all night?">
            Absolutely. They are designed with ultra-soft, medical-grade materials. Most users report they forget they're even wearing it within minutes.
          </FaqAccordion>
          <FaqAccordion title="Can I reuse the strips?">
            The main nasal band is fully reusable. The small magnetic strips are disposable and should be replaced daily for hygiene and best performance. Our refill packs make it easy and affordable.
          </FaqAccordion>
          <FaqAccordion title="What comes in the Starter Kit?">
            The Starter Kit includes everything you need to get started: one reusable magnetic band and a 30-day supply of disposable magnetic strips.
          </FaqAccordion>
        </div>
      </section>

      <Newsletter />
    </>
  );
};

export default LandingPage;