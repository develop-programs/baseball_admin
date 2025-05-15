import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectToDatabase } from '@/services/Connection';
import PlayerModel from '@/services/schema/Player';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        // Check authentication
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user) {
            return NextResponse.json({ 
                success: false, 
                message: 'Unauthorized' 
            }, { status: 401 });
        }
        
        // Optional: Check if user has admin role
        if (session.user.role !== 'admin' && session.user.role !== 'super_admin') {
            return NextResponse.json({ 
                success: false, 
                message: 'Insufficient permissions' 
            }, { status: 403 });
        }
        
        // Connect to database
        await connectToDatabase();
        
        // Get player stats
        const [
            totalPlayers,
            pendingPlayers,
            approvedPlayers,
            rejectedPlayers,
            recentRegistrations
        ] = await Promise.all([
            PlayerModel.countDocuments({}),
            PlayerModel.countDocuments({ status: 'pending' }),
            PlayerModel.countDocuments({ status: 'approved' }),
            PlayerModel.countDocuments({ status: 'rejected' }),
            PlayerModel.find()
                .sort({ registrationDate: -1 })
                .limit(5)
                .select('fullName email status registrationDate')
        ]);
        
        // Format recent registrations
        const formattedRecentRegistrations = recentRegistrations.map(player => ({
            id: player._id,
            fullName: player.fullName,
            email: player.email,
            status: player.status,
            registrationDate: player.registrationDate
        }));
        
        return NextResponse.json({
            success: true,
            stats: {
                totalPlayers,
                pendingPlayers,
                approvedPlayers,
                rejectedPlayers,
                recentRegistrations: formattedRecentRegistrations
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard info:', error);
        return NextResponse.json({
            success: false, 
            message: error instanceof Error ? error.message : 'An error occurred'
        }, { status: 500 });
    }
}