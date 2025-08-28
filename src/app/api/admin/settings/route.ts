import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';

const VALID_SETTING_TYPES = ['text', 'color', 'boolean', 'number', 'json'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Single record fetch
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
      }

      return NextResponse.json(record[0]);
    }

    // List with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    let query = db.select().from(siteSettings);
    
    if (search) {
      query = query.where(
        or(
          like(siteSettings.settingName, `%${search}%`),
          like(siteSettings.category, `%${search}%`)
        )
      );
    }

    const results = await query
      .orderBy(desc(siteSettings.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.settingName) {
      return NextResponse.json({ 
        error: "settingName is required",
        code: "MISSING_SETTING_NAME" 
      }, { status: 400 });
    }

    if (!body.settingType) {
      return NextResponse.json({ 
        error: "settingType is required",
        code: "MISSING_SETTING_TYPE" 
      }, { status: 400 });
    }

    // Validate settingType enum
    if (!VALID_SETTING_TYPES.includes(body.settingType)) {
      return NextResponse.json({ 
        error: `settingType must be one of: ${VALID_SETTING_TYPES.join(', ')}`,
        code: "INVALID_SETTING_TYPE" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const settingName = body.settingName.trim();
    const settingValue = body.settingValue ? body.settingValue.trim() : null;
    const description = body.description ? body.description.trim() : null;
    const category = body.category ? body.category.trim() : null;

    // Check for duplicate settingName
    const existing = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.settingName, settingName))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ 
        error: "A setting with this name already exists",
        code: "DUPLICATE_SETTING_NAME" 
      }, { status: 409 });
    }

    // Insert new setting
    const newSetting = await db.insert(siteSettings)
      .values({
        settingName,
        settingValue,
        settingType: body.settingType,
        description,
        category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newSetting[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    // Validate settingType if provided
    if (body.settingType && !VALID_SETTING_TYPES.includes(body.settingType)) {
      return NextResponse.json({ 
        error: `settingType must be one of: ${VALID_SETTING_TYPES.join(', ')}`,
        code: "INVALID_SETTING_TYPE" 
      }, { status: 400 });
    }

    // Check for duplicate settingName if being updated
    if (body.settingName) {
      const settingName = body.settingName.trim();
      const duplicate = await db.select()
        .from(siteSettings)
        .where(eq(siteSettings.settingName, settingName))
        .limit(1);

      if (duplicate.length > 0 && duplicate[0].id !== parseInt(id)) {
        return NextResponse.json({ 
          error: "A setting with this name already exists",
          code: "DUPLICATE_SETTING_NAME" 
        }, { status: 409 });
      }
      updates.settingName = settingName;
    }

    // Sanitize and add other fields
    if (body.settingValue !== undefined) {
      updates.settingValue = body.settingValue ? body.settingValue.trim() : null;
    }
    if (body.settingType) {
      updates.settingType = body.settingType;
    }
    if (body.description !== undefined) {
      updates.description = body.description ? body.description.trim() : null;
    }
    if (body.category !== undefined) {
      updates.category = body.category ? body.category.trim() : null;
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(siteSettings)
      .where(eq(siteSettings.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    const deleted = await db.delete(siteSettings)
      .where(eq(siteSettings.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Setting deleted successfully',
      deleted: deleted[0]
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}