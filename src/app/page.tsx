// app/users/page.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function UsersPage() {
  const users = await prisma.user.findMany(); 

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>Name : {user.user_name} email : {user.email} Role : {user.user_role}</li>
        ))}
      </ul>
    </div>
  );
}

// 'use client';

// import { signIn } from 'next-auth/react';
// import { useState, FormEvent } from 'react';

// const SignIn: React.FC = () => {
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [error, setError] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const res = await signIn('credentials', {
//       redirect: false,
//       email,
//       password,
//     });

//     setIsLoading(false);

//     if (res?.error) {
//       setError(res.error || 'Invalid credentials');
//     } else {
//       window.location.href = '/Add-course'; // Redirect on successful login
//     }
//   };

//   return (
//     <div className="bg-white text-black">
//       <h1>Sign In</h1>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         {error && <p>{error}</p>}
//         <button type="submit" disabled={isLoading}>
//           {isLoading ? 'Signing In...' : 'Sign In'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignIn;
