import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { user_name, email, phone, user_role, password } = await req.json();

    const user = await prisma.user.create({
      data: {
        user_name,
        email,
        phone,
        password,
        user_role,
      },
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error creating user", details: error.message }),
      { status: 400 }
    );
  }
}
