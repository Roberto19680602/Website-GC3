import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { sessions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      return NextResponse.json({ 
        error: "Authorization header is required",
        code: "MISSING_AUTHORIZATION" 
      }, { status: 401 });
    }

    // Extract Bearer token
    const token = authHeader.replace('Bearer ', '');
    
    if (!token || token === authHeader) {
      return NextResponse.json({ 
        error: "Valid Bearer token is required",
        code: "INVALID_TOKEN_FORMAT" 
      }, { status: 401 });
    }

    // Find and delete the session
    const deletedSession = await db.delete(sessions)
      .where(eq(sessions.token, token))
      .returning();

    if (deletedSession.length === 0) {
      return NextResponse.json({ 
        error: "Invalid or expired session token",
        code: "SESSION_NOT_FOUND" 
      }, { status: 401 });
    }

    return NextResponse.json({
      message: "Successfully logged out",
      sessionId: deletedSession[0].id
    }, { status: 200 });

  } catch (error) {
    console.error('POST logout error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}