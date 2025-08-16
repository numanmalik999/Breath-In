import React from 'react';
import { Wrench } from 'lucide-react';

interface PlaceholderContentProps {
  title: string;
  message: string;
}

const PlaceholderContent: React.FC<PlaceholderContentProps> = ({ title, message }) => {
  return (
    <div className="text-center p-8 border-2 border-dashed rounded-lg">
      <Wrench className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-gray-600">{message}</p>
    </div>
  );
};

export default PlaceholderContent;