import { Facebook, Twitter, Share2, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface SocialShareProps {
  url: string;
  title: string;
}

const SocialShare = ({ url, title }: SocialShareProps) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`Check out ${title} from Breathin!`);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      <span className="text-sm font-medium text-gray-700">Share:</span>
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600" aria-label="Share on Facebook">
        <Facebook className="h-5 w-5" />
      </a>
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-sky-500" aria-label="Share on Twitter">
        <Twitter className="h-5 w-5" />
      </a>
      <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-500" aria-label="Share on WhatsApp">
        <Share2 className="h-5 w-5" />
      </a>
      <button onClick={copyToClipboard} className="text-gray-500 hover:text-sageGreen" aria-label="Copy link">
        <LinkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SocialShare;