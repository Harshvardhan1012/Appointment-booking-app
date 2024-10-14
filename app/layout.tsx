import type { Metadata } from "next";
import {Plus_Jakarta_Sans} from 'next/font/google'
import "./globals.css";
import {cn} from '@/lib/utils'
import { ThemeProvider } from "@/components/theme-provider"
import Navigation from "@/components/forms/Navigation";


const fontSans=Plus_Jakarta_Sans({
  subsets:["latin"],
  weight:["300","400","500","600","700"],
  variable:'--font-sans',
  display:'swap'
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn('bg-dark-300 font-sans antialiased',fontSans.variable)}
      >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <Navigation />
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

