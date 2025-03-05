import { NextResponse } from "next/server";
import prisma from "../../../../prisma/prisma";

// http://localhost:3000/api/get_role?email=teacher@example.com

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "email is required" },
        { status: 400 }
      );
    }

    let role = await prisma.user.findUnique({
        where: { email: email }, 
        select: {
            user_role: true
        }
    });
    
    if (!role) {   
        let student = await prisma.student.findUnique({
            where: { student_email: email }
        });
        if(student){
          return NextResponse.json("STUDENT");
        }else{
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
        }
       
    }

    console.log("role", role.user_role)
   
        return NextResponse.json(role.user_role);
    

  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}
