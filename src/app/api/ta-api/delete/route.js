import { NextResponse } from "next/server";
import prisma from "../../../../../prisma/prisma";

// http://localhost:3000/api/ta-api/delete?id=3
export async function DELETE(req) {
  try {
    // const { searchParams } = new URL(req.url);
    const id = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    // Parse the `id` to an integer
    const parsedId = parseInt(id, 10);

    ///////////////////////////////////////////////////////
    // Mock teacher_id for now (replace with actual session logic later)
    const teacher_id = 1; // Replace with actual logic when auth is implemented

    const teacher = await prisma.user.findUnique({
      where: { id: teacher_id },
      select: { user_role: true },
    });

    if (!teacher) {
      return NextResponse.json(
        { error: `User with ID ${teacher_id} not found` },
        { status: 404 }
      );
    }

    if (teacher.user_role !== "TEACHER") {
      return NextResponse.json(
        { error: `User with ID ${teacher_id} is not a TEACHER` },
        { status: 403 }
      );
    }
    ///////////////////////////////////////////////////////

    // Check if the TA exists
    const ta = await prisma.user.findUnique({
      where: { id: parsedId },
    });

    if (!ta) {
      return NextResponse.json(
        { error: `TA with ID ${parsedId} does not exist` },
        { status: 404 }
      );
    }

    if (ta.user_role !== "TA") {
      return NextResponse.json(
        { error: `User with ID ${parsedId} is not a TA` },
        { status: 400 }
      );
    }

    // Delete the TA
    const deletedTA = await prisma.user.delete({
      where: { id: parsedId },
    });

    return NextResponse.json(
      { message: "TA deleted successfully",
        deletedTA,
      },
      { status: 200 });
  } catch (error) {
    console.error("Error deleting TA:", error);
    return NextResponse.json(
      { error: "Error deleting TA" },
      { status: 500 }
    );
  }
}
