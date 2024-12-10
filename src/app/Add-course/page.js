'use client'; // Mark this file as a client-side component

import { useSession, signOut } from 'next-auth/react'; // Import signOut
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AddCoursePage() {
  const { data: session, status } = useSession(); // Always call hooks at the top
  const router = useRouter();

  // Redirect to login if no session and session isn't loading
  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.replace('../auth/Login');
    }
  }, [session, status, router]);

  // Handle sign-out
  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/Login' }); // Redirect to Login page after signing out
  };

  // UI based on session status
  if (status === 'loading') {
    return <p>Loading...</p>; // Still loading the session
  }

  if (!session) {
    return <p>Redirecting to login...</p>; // Redirecting
  }

  // Render main content when session is available
  return (
    <div>
      <h1>Welcome, {session.user?.user_name}</h1>
      <p>Email: {session.user?.email}</p>
      <p>Phone: {session.user?.phone}</p>
      <p>Role: {session.user?.role}</p>

      {/* Add your "Add Course" form or content here */}
      <button onClick={handleSignOut} style={{ marginTop: '20px', padding: '10px 20px', background: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Sign Out
      </button>
    </div>
  );
}
