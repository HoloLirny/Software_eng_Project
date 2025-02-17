import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password, user_role } = await req.json();

    // Check if the user already exists by email
    const existingEmailUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmailUser) {
      return new Response(JSON.stringify({ error: 'Email is already registered.' }), { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        user_role: user_role || 'STUDENT', 
      },
    });

    return new Response(JSON.stringify({ message: 'User registered successfully.', user: newUser }), {
      status: 201,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), { status: 500 });
  }
}
