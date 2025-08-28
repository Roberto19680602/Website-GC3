import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: "Valid ID is required",
        code: "INVALID_ID"
      }, { status: 400 });
    }

    const setting = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.id, parseInt(id)))
      .limit(1);

    if (setting.length === 0) {
      return NextResponse.json({
        error: 'Site setting not found'
      }, { status: 404 });
    }

    return NextResponse.json(setting[0]);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: "Valid ID is required",
        code: "INVALID_ID"
      }, { status: 400 });
    }

    // Check if record exists
    const existingSettings = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.id, parseInt(id)))
      .limit(1);

    if (existingSettings.length === 0) {
      return NextResponse.json({
        error: 'Site setting not found'
      }, { status: 404 });
    }

    const body = await request.json();
    
    // Prepare update data with only allowed fields
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    // Only allow updating specific fields
    if ('settingValue' in body) {
      updates.settingValue = body.settingValue?.toString().trim() || null;
    }

    if ('description' in body) {
      updates.description = body.description?.toString().trim() || null;
    }

    if ('category' in body) {
      updates.category = body.category?.toString().trim() || null;
    }

    // Prevent updating settingName and settingType
    if ('settingName' in body || 'settingType' in body) {
      return NextResponse.json({
        error: "settingName and settingType cannot be updated after creation",
        code: "FORBIDDEN_FIELD_UPDATE"
      }, { status: 400 });
    }

    const updated = await db.update(siteSettings)
      .set(updates)
      .where(eq(siteSettings.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: "Valid ID is required",
        code: "INVALID_ID"
      }, { status: 400 });
    }

    // Check if record exists
    const existingSettings = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.id, parseInt(id)))
      .limit(1);

    if (existingSettings.length === 0) {
      return NextResponse.json({
        error: 'Site setting not found'
      }, { status: 404 });
    }

    const deleted = await db.delete(siteSettings)
      .where(eq(siteSettings.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Site setting deleted successfully',
      deleted: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}