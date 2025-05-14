import {NextRequest, NextResponse} from "next/server";

export async function GET() {
    try {

    } catch (error) {
        return await NextResponse.json({error: error});
    }
}