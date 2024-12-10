'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation

export default function Register() {
  const [form, setForm] = useState({
    user_name: '',
    email: '',
    phone: '',
    password: '',
    user_role: 'TEACHER', // Default role
  });

  const [error, setError] = useState(null);
  const router = useRouter(); // Correct import from next/navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('../../api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        router.push('/'); 
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className='bg-white text-black'>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="user_name"
            value={form.user_name}
            onChange={handleChange}
            required
          />
        </label>
        <br/>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <br/>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </label>
        <br/>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <br/>
        <label>
          Role:
          <select name="user_role" value={form.user_role} onChange={handleChange}>
            {/* <option value="ADMIN">Admin</option> */}
            <option value="TEACHER">Teacher</option>
            <option value="TA">TA</option>
          </select>
        </label>
        <br/>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
