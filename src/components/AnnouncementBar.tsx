import { useSettings } from '../context/SettingsContext';

const AnnouncementBar = () => {
  const { settings, loading } = useSettings();
  const announcementText = settings?.announcement_text;

  if (loading || !announcementText) {
    return null; // Don't render anything if loading or text is not set
  }

  return (
    <div className="bg-sageGreen text-white text-sm font-medium">
      <div className="relative flex overflow-x-hidden">
        <div className="py-2 animate-marquee whitespace-nowrap">
          <span className="mx-4">{announcementText}</span>
          <span className="mx-4">{announcementText}</span>
          <span className="mx-4">{announcementText}</span>
          <span className="mx-4">{announcementText}</span>
        </div>
        <div className="absolute top-0 py-2 animate-marquee2 whitespace-nowrap">
          <span className="mx-4">{announcementText}</span>
          <span className="mx-4">{announcementText}</span>
          <span className="mx-4">{announcementText}</span>
          <span className="mx-4">{announcementText}</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;