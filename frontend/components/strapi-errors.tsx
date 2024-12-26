"use client";

import '@/app/i18n';
import { useTranslation } from 'react-i18next';

interface StrapiErrorsProps {
  message: string | null;
  name: string;
  status: string | null;
}

export function StrapiErrors({ error }: { readonly error: StrapiErrorsProps }) {
  const { t } = useTranslation();
  
  if (!error?.message) return null;

  const translatedMessage = t(error.message, error.message);
  
  return (
    <div className="text-red-800 dark:text-pink-600 text-md italic py-2">
      {translatedMessage}
    </div>
  );
}