import { NextResponse } from "next/server";
import { connectToDatabase } from "@/services/Connection";
import PlayerModel from "@/services/schema/Player";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Connect to database
    await connectToDatabase();

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
        id: player._id,
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
    console.error("Error fetching player details:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch player details",
      },
      { status: 500 }
    );
  }
}

// Add PATCH endpoint to update player details
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Connect to database
    await connectToDatabase();

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

    // Update player data
    const updatedPlayer = await PlayerModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Player updated successfully",
      player: {
        id: updatedPlayer._id,
        fullName: updatedPlayer.fullName,
        email: updatedPlayer.email,
        status: updatedPlayer.status,
      },
    });
  } catch (error: any) {
    console.error("Error updating player:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update player",
      },
      { status: 500 }
    );
  }
}

// Add DELETE endpoint to remove a player
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Connect to database
    await connectToDatabase();

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

    // Delete player
    await PlayerModel.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Player deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting player:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete player",
      },
      { status: 500 }
    );
  }
}
