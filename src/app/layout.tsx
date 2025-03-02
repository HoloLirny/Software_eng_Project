'use client'
import { SessionProvider } from 'next-auth/react';
import './globals.css'; // Optional: Your global styles
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
