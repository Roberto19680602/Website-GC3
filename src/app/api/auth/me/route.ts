import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, sessions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Extract Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: "Authorization token is required",
        code: "MISSING_TOKEN" 
      }, { status: 401 });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return NextResponse.json({ 
        error: "Authorization token is required",
        code: "MISSING_TOKEN" 
      }, { status: 401 });
    }

    // Verify JWT token
    let decoded: any;
    try {
      decoded = jwt.verify(token, 'your-secret-key');
    } catch (jwtError) {
      return NextResponse.json({ 
        error: "Invalid or expired token",
        code: "INVALID_TOKEN" 
      }, { status: 401 });
    }

    // Extract user ID from JWT payload
    const userId = decoded.userId || decoded.id;
    
    if (!userId) {
      return NextResponse.json({ 
        error: "Invalid token payload",
        code: "INVALID_TOKEN_PAYLOAD" 
      }, { status: 401 });
    }

    // Check if session exists and is not expired
    const sessionRecord = await db.select()
      .from(sessions)
      .where(
        and(
          eq(sessions.token, token),
          eq(sessions.userId, userId)
        )
      )
      .limit(1);

    if (sessionRecord.length === 0) {
      return NextResponse.json({ 
        error: "Session not found",
        code: "SESSION_NOT_FOUND" 
      }, { status: 401 });
    }

    const session = sessionRecord[0];
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);

    if (now > expiresAt) {
      return NextResponse.json({ 
        error: "Session has expired",
        code: "SESSION_EXPIRED" 
      }, { status: 403 });
    }

    // Find user by ID
    const userRecord = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userRecord.length === 0) {
      return NextResponse.json({ 
        error: "User not found",
        code: "USER_NOT_FOUND" 
      }, { status: 401 });
    }

    const user = userRecord[0];

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}