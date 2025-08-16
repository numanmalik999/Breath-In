import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqAccordionProps {
  title: string;
  children: React.ReactNode;
}

const FaqAccordion = ({ title, children }: FaqAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <h3 className="text-lg font-medium text-charcoal">{title}</h3>
        <ChevronDown
          className={`h-5 w-5 text-sageGreen transition-transform duration-300 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-4 text-gray-600">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqAccordion;