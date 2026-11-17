import React from 'react';
import { Loader2 } from 'lucide-react';

const PageLoader = ({ message = 'Loading FinConnect...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <Loader2 className="w-10 h-10 animate-spin text-sky-600 mb-4" />
      <p className="text-gray-600 font-medium text-sm">{message}</p>
    </div>
  );
};

export default PageLoader;

