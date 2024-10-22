import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// FORMAT DATE TIME
export const IstDate=(newdate:Date)=>{
  const date = new Date(newdate);

  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  };
  const formattedDate = date.toLocaleDateString('en-GB', options).replace(',', '');
  return formattedDate;
}

