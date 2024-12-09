"use client";

import { useState } from "react";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    user_name: "",
    email: "",
    phone: "",
    password: "",
    user_role: "TEACHER",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("User created successfully!");
        setFormData({ user_name: "", email: "", phone: "", user_role: "TEACHER", password: "" });
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.details}`);
      }
    } catch (err) {
      setMessage("Error: Unable to create user.1");
    }
  };

  return (
    <div className="text-black bg-white">
      <h1>Create User</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Phone:
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Role:
          <select name="user_role" value={formData.user_role} onChange={handleChange}>
            <option value="TA">TA</option>
            <option value="TEACHER">Teacher</option>
          </select>
        </label>
        <br/>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <button type="submit">Create User</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
