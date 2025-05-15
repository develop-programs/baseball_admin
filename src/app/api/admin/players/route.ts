import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/services/Connection';
import PlayerModel from '@/services/schema/Player';

export async function GET(req: Request) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    
    // Build query
    const query: Record<string, any> = {};
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }
    
    // Fetch players with pagination
    const [players, total] = await Promise.all([
      PlayerModel.find(query)
        .select('fullName email phone region state district status registrationDate')
        .sort({ registrationDate: -1 })
        .skip(skip)
        .limit(limit),
      PlayerModel.countDocuments(query)
    ]);
    
    // Format player data
    const formattedPlayers = players.map(player => ({
      id: player._id,
      fullName: player.fullName,
      email: player.email,
      phone: player.phone,
      location: `${player.district}, ${player.state}, ${player.region}`,
      status: player.status,
      registrationDate: player.registrationDate
    }));
    
    // Return response with pagination data
    return NextResponse.json({
      success: true,
      players: formattedPlayers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching players:', error);
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to fetch players'
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Connect to database
    await connectToDatabase();
    
    // Parse request body
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'region', 'state', 'district'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }
    
    // Check if player with email already exists
    const existingPlayer = await PlayerModel.findOne({ email: body.email });
    if (existingPlayer) {
      return NextResponse.json({
        success: false,
        message: 'A player with this email already exists'
      }, { status: 409 });
    }
    
    // Set default status as pending for new registrations
    const playerData = {
      ...body,
      status: 'pending',
      registrationDate: new Date()
    };
    
    // Create new player
    const newPlayer = new PlayerModel(playerData);
    await newPlayer.save();
    
    return NextResponse.json({
      success: true,
      message: 'Player registered successfully',
      player: {
        id: newPlayer._id,
        fullName: newPlayer.fullName,
        email: newPlayer.email,
        status: newPlayer.status
      }
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error registering player:', error);
    
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to register player'
    }, { status: 500 });
  }
}
