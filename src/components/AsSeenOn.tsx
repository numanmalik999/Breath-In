const AsSeenOn = () => {
  const logos = [
    { name: 'Forbes', src: 'https://via.placeholder.com/100x40?text=Forbes' },
    { name: 'Healthline', src: 'https://via.placeholder.com/100x40?text=Healthline' },
    { name: 'Men\'s Health', src: 'https://via.placeholder.com/100x40?text=Men\'s+Health' },
    { name: 'The Sleep Foundation', src: 'https://via.placeholder.com/100x40?text=Sleep+Foundation' },
  ];

  return (
    <div className="bg-offWhite py-8">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
          As Featured In
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4">
          {logos.map((logo) => (
            <img key={logo.name} src={logo.src} alt={logo.name} className="h-8 opacity-60" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AsSeenOn;