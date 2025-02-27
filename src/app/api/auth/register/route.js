import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { email, password, user_role } = await request.json();

    // Check if the email already exists in the database
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      // If user with that email already exists, return an error response
      return Response.json(
        {
          error: "Email already exists",
        },
        { status: 400 }
      );
    }

    // Hash the password before saving it to the database
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create the user
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          user_role,
        },
      });

      // Return just the user if not a student
      return {
        user: newUser,
      };
    });

    // If successful, return the result
    return Response.json({
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating user:", error); // Log the error for debugging
    return Response.json(
      {
        error: "User could not be created",
      },
      { status: 500 }
    );
  }
}
