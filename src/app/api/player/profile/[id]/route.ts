import { NextResponse } from "next/server";
import { connectToDatabase } from "@/services/Connection";
import PlayerModel from "@/services/schema/Player";

interface Params {
  id: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to database
    await connectToDatabase();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Player ID is required",
        },
        { status: 400 }
      );
    }

    // Find player by ID
    const player = await PlayerModel.findById(id);

    if (!player) {
      return NextResponse.json(
        {
          success: false,
          message: "Player not found",
        },
        { status: 404 }
      );
    }

    // Return player data
    return NextResponse.json({
      success: true,
      player: {
        fullName: player.fullName,
        fatherName: player.fatherName,
        motherName: player.motherName,
        dob: player.dob,
        gender: player.gender,
        phone: player.phone,
        addhaar: player.addhaar,
        email: player.email,
        profileimg: player.profileimg,
        addharImg: player.addharImg,
        region: player.region,
        state: player.state,
        district: player.district,
        status: player.status,
        registrationDate: player.registrationDate,
      },
    });
  } catch (error: any) {
    console.error("Player profile fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "An error occurred while fetching player data",
      },
      { status: 500 }
    );
  }
}
