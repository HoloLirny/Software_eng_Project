import prisma from "../../../../../prisma/prisma";

export async function POST(req) {
    const { description, date } = await req.json();
    if (!date) {
        return new Response(
          JSON.stringify({
            message: "date is required",
          }),
          { status: 400 }
        );
    }

    const exitdate = await prisma.attendance_detail.findUnique({
        where: {date:date}
    });

    if(exitdate){
        return new Response(
            JSON.stringify({
              message: date + "is already assign",
            }),
            { status: 400 }
        );
    }

    const add_date = await prisma.attendance_detail.create({
        data:{
            date:date,
            description:description
        }
    })

    return new Response(
        JSON.stringify({
            message: `${date} has been added.`,
            attendance_detail: add_date
        }),
        { status: 201 }
    );
}