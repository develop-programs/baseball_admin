import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/services/Connection';
import PlayerModel from '@/services/schema/Player';

export async function POST(req: Request) {
  try {
    // Parse the request body
    const playerData = await req.json();
    
    // Connect to the database
    await connectToDatabase();
    
    // Check for existing player with same email or aadhaar
    const existingPlayer = await PlayerModel.findOne({
      $or: [
        { email: playerData.email },
        { addhaar: playerData.addhaar }
      ]
    });
    
    if (existingPlayer) {
      const isDuplicateEmail = existingPlayer.email === playerData.email;
      const isDuplicateAadhaar = existingPlayer.addhaar === playerData.addhaar;
      
      let message = 'Registration failed: ';
      if (isDuplicateEmail && isDuplicateAadhaar) {
        message += 'A player with this email and Aadhaar number already exists.';
      } else if (isDuplicateEmail) {
        message += 'A player with this email already exists.';
      } else {
        message += 'A player with this Aadhaar number already exists.';
      }
      
      return NextResponse.json({
        success: false,
        message
      }, { status: 409 });
    }
    
    // Create a new player record
    const newPlayer = new PlayerModel({
      ...playerData
    });
    
    // Save the player to the database
    await newPlayer.save();
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Player registration successful! Your application is now pending approval.',
      player: {
        id: newPlayer._id,
        fullName: newPlayer.fullName,
        status: newPlayer.status
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Player registration error:', error);
    
    // Handle duplicate key errors (email or Aadhaar already exists)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({
        success: false,
        message: `A player with this ${field} already exists.`
      }, { status: 409 });
    }
    
    // Return error response
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred during registration'
    }, { status: 500 });
  }
}
