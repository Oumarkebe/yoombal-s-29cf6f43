
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';

interface TProps {
  children: string;
}

const T: React.FC<TProps> = ({ children }) => {
  const { translatedText, isLoading } = useTranslation(children);

  if (isLoading) {
    const width = Math.min(Math.max(children.length * 8, 50), 300);
    return <Skeleton className="h-5 w-full inline-block" style={{ maxWidth: `${width}px` }} />;
  }

  return <>{translatedText}</>;
};

export default T;
