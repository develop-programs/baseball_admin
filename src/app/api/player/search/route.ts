import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/services/Connection';
import PlayerModel from '@/services/schema/Player';

export async function GET(req: Request) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get aadhar from query parameters
    const { searchParams } = new URL(req.url);
    const aadhar = searchParams.get('aadhar');
    
    if (!aadhar) {
      return NextResponse.json({
        success: false,
        message: 'Aadhar number is required'
      }, { status: 400 });
    }
    
    // Find player by aadhar number
    const player = await PlayerModel.findOne({ addhaar: aadhar });
    
    if (!player) {
      return NextResponse.json({
        success: false,
        message: 'No player found with this Aadhar number'
      }, { status: 404 });
    }
    
    // Return basic player information
    return NextResponse.json({
      success: true,
      player: {
        id: player._id,
        fullName: player.fullName,
        status: player.status
      }
    });
    
  } catch (error: any) {
    console.error('Player search error:', error);
    
    return NextResponse.json({
      success: false,
      message: error.message || 'An error occurred while searching'
    }, { status: 500 });
  }
}
