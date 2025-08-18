const ProductVideo = () => {
  return (
    <div className="max-w-4xl mx-auto mb-16">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="aspect-video relative">
          <iframe
            src="https://www.youtube.com/embed/wzYSozVzZrM?si=RQ1Y2-VwJepyu0ih"
            title="Breathin Magnetic Nasal Strips - How They Work"
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-serif font-semibold text-charcoal mb-2">
            How Breathin Works
          </h3>
          <p className="text-gray-600">
            Discover the science behind our revolutionary magnetic nasal strips and how they can transform your breathing and sleep quality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductVideo;