import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ReduxProvider from '../app/providers'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Typing battle",
  description: "Typing battle web game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
