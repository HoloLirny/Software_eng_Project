"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // To redirect after successful registration
import { signIn } from "next-auth/react"; // Import signIn function

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState(null); // Corrected line (no TypeScript annotations here)
  const router = useRouter(); // To redirect after successful registration

  const onSubmit = async (data) => {
    setError(null); // Reset error message before submitting

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      // Automatically sign in the user after successful registration
      const signInResponse = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false, // Don't redirect automatically after sign-in
      });

      if (signInResponse.error) {
        setError("Error signing in. Please try again.");
      } else {
        // Redirect to the profile page of the current user
        router.push("/login/profile");
      }
    } else {
      setError(result.error || "User could not be created.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="user_role">Role</label>
          <select id="user_role" {...register("user_role")}>
            <option value="TEACHER">Teacher</option>
            <option value="STUDENT">Student</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
