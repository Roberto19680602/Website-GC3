import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contentBlocks } from '@/db/schema';
import { eq, and, not } from 'drizzle-orm';

const VALID_BLOCK_TYPES = ['html', 'markdown', 'text'];

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

    const record = await db.select()
      .from(contentBlocks)
      .where(eq(contentBlocks.id, parseInt(id)))
      .limit(1);

    if (record.length === 0) {
      return NextResponse.json({ 
        error: 'Content block not found' 
      }, { status: 404 });
    }

    return NextResponse.json(record[0]);
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
    const existingRecord = await db.select()
      .from(contentBlocks)
      .where(eq(contentBlocks.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Content block not found' 
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and process blockName
    if (body.blockName !== undefined) {
      const trimmedBlockName = body.blockName?.trim();
      if (trimmedBlockName) {
        // Check for uniqueness (excluding current record)
        const existingName = await db.select()
          .from(contentBlocks)
          .where(
            and(
              eq(contentBlocks.blockName, trimmedBlockName),
              not(eq(contentBlocks.id, parseInt(id)))
            )
          )
          .limit(1);
        
        if (existingName.length > 0) {
          return NextResponse.json({ 
            error: "Block name already exists",
            code: "DUPLICATE_BLOCK_NAME" 
          }, { status: 409 });
        }
        
        updates.blockName = trimmedBlockName;
      }
    }

    // Validate and process blockType
    if (body.blockType !== undefined) {
      if (!VALID_BLOCK_TYPES.includes(body.blockType)) {
        return NextResponse.json({ 
          error: `Block type must be one of: ${VALID_BLOCK_TYPES.join(', ')}`,
          code: "INVALID_BLOCK_TYPE" 
        }, { status: 400 });
      }
      updates.blockType = body.blockType;
    }

    // Process blockContent
    if (body.blockContent !== undefined) {
      updates.blockContent = body.blockContent?.trim() || null;
    }

    // Process pageLocation
    if (body.pageLocation !== undefined) {
      updates.pageLocation = body.pageLocation?.trim() || null;
    }

    // Process isActive
    if (body.isActive !== undefined) {
      updates.isActive = Boolean(body.isActive);
    }

    // Always update timestamp
    updates.updatedAt = new Date().toISOString();

    const updated = await db.update(contentBlocks)
      .set(updates)
      .where(eq(contentBlocks.id, parseInt(id)))
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
    const existingRecord = await db.select()
      .from(contentBlocks)
      .where(eq(contentBlocks.id, parseInt(id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Content block not found' 
      }, { status: 404 });
    }

    const deleted = await db.delete(contentBlocks)
      .where(eq(contentBlocks.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Content block deleted successfully',
      deletedRecord: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}