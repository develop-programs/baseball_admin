import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from "@/services/Connection";
import PlayerModel from "@/services/schema/Player";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Optional: Check if user has admin role
    if (session.user.role !== "admin" && session.user.role !== "super_admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Insufficient permissions",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Parse request body to get new status
    const { status } = await req.json();

    // Validate status
    if (!status || !["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid status value. Must be one of: pending, approved, rejected",
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Update player status
    const updatedPlayer = await PlayerModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedPlayer) {
      return NextResponse.json(
        {
          success: false,
          message: "Player not found",
        },
        { status: 404 }
      );
    }

    // Return updated player data
    return NextResponse.json({
      success: true,
      message: `Player status updated to ${status}`,
      player: {
        id: updatedPlayer._id,
        fullName: updatedPlayer.fullName,
        status: updatedPlayer.status,
      },
    });
  } catch (error: any) {
    console.error("Error updating player status:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update player status",
      },
      { status: 500 }
    );
  }
}
