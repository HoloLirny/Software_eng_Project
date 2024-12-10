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