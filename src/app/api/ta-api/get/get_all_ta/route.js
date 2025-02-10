import { NextResponse } from "next/server";
import prisma from "../../../../../../prisma/prisma";

// http://localhost:3000/api/ta-api/get/get_all_ta

export async function GET() {
  try {
    const TA = await prisma.user.findMany({
      where: { user_role: "TA" },
      select: {
        id: true, 
        email: true,
        user_role: true,
      },
    });
    return NextResponse.json(TA);
  } catch (error) {
    console.error("Error fetching ta:", error);
    return NextResponse.json(
      { error: "Failed to fetch ta" },
      { status: 500 }
    );
  }
}
