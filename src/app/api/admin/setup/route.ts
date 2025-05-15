import { NextResponse } from "next/server";
import { connectToDatabase } from "@/services/Connection";
import AdminModel from "@/services/schema/Admin";

export async function POST(req: Request) {
  try {
    // Get the setup key from environment variables
    const setupKey = process.env.ADMIN_SETUP_KEY;

    // If setup key is not defined, reject the request
    if (!setupKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin setup is not configured on this server.",
        },
        { status: 403 }
      );
    }

    // Parse request body
    const { username, password, email, key } = await req.json();

    // Verify setup key
    if (key !== setupKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid setup key.",
        },
        { status: 403 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Check if admin already exists
    const adminCount = await AdminModel.countDocuments();
    const isFirstAdmin = adminCount === 0;

    // Create new admin
    const newAdmin = new AdminModel({
      username,
      password, // Will be hashed by pre-save hook
      email,
      role: isFirstAdmin ? "super_admin" : "admin",
    });

    await newAdmin.save();

    return NextResponse.json({
      success: true,
      message: `Admin ${username} created successfully with role: ${
        isFirstAdmin ? "super_admin" : "admin"
      }`,
    });
  } catch (error: any) {
    console.error("Admin setup error:", error);

    // Handle duplicate key errors (username or email already exists)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        {
          success: false,
          message: `An admin with this ${field} already exists.`,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create admin user",
      },
      { status: 500 }
    );
  }
}
