import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contentBlocks } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    // Single record fetch
    if (id) {
      if (isNaN(parseInt(id))) {
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
        return NextResponse.json({ error: 'Content block not found' }, { status: 404 });
      }

      return NextResponse.json(record[0]);
    }

    // List with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const active = searchParams.get('active');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    let query = db.select().from(contentBlocks);
    
    const conditions = [];

    // Search functionality
    if (search) {
      conditions.push(
        or(
          like(contentBlocks.blockName, `%${search}%`),
          like(contentBlocks.pageLocation, `%${search}%`)
        )
      );
    }

    // Filter by active status
    if (active !== null && active !== undefined) {
      const isActive = active === 'true';
      conditions.push(eq(contentBlocks.isActive, isActive));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Sorting
    const orderBy = order === 'asc' ? asc : desc;
    if (sort === 'blockName') {
      query = query.orderBy(orderBy(contentBlocks.blockName));
    } else if (sort === 'blockType') {
      query = query.orderBy(orderBy(contentBlocks.blockType));
    } else if (sort === 'updatedAt') {
      query = query.orderBy(orderBy(contentBlocks.updatedAt));
    } else {
      query = query.orderBy(orderBy(contentBlocks.createdAt));
    }

    const results = await query.limit(limit).offset(offset);
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
    if (!body.blockName || typeof body.blockName !== 'string') {
      return NextResponse.json({ 
        error: "blockName is required and must be a string",
        code: "MISSING_BLOCK_NAME" 
      }, { status: 400 });
    }

    if (!body.blockType || typeof body.blockType !== 'string') {
      return NextResponse.json({ 
        error: "blockType is required and must be a string",
        code: "MISSING_BLOCK_TYPE" 
      }, { status: 400 });
    }

    // Validate blockType enum
    const validBlockTypes = ['html', 'markdown', 'text'];
    if (!validBlockTypes.includes(body.blockType)) {
      return NextResponse.json({ 
        error: "blockType must be one of: html, markdown, text",
        code: "INVALID_BLOCK_TYPE" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const blockName = body.blockName.trim();
    const blockContent = body.blockContent ? body.blockContent.trim() : null;
    const pageLocation = body.pageLocation ? body.pageLocation.trim() : null;
    const isActive = body.isActive !== undefined ? Boolean(body.isActive) : true;

    if (!blockName) {
      return NextResponse.json({ 
        error: "blockName cannot be empty",
        code: "EMPTY_BLOCK_NAME" 
      }, { status: 400 });
    }

    // Check for unique blockName
    const existing = await db.select()
      .from(contentBlocks)
      .where(eq(contentBlocks.blockName, blockName))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ 
        error: "Content block with this name already exists",
        code: "DUPLICATE_BLOCK_NAME" 
      }, { status: 409 });
    }

    // Create new content block
    const newContentBlock = await db.insert(contentBlocks)
      .values({
        blockName,
        blockContent,
        blockType: body.blockType,
        pageLocation,
        isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newContentBlock[0], { status: 201 });

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
      .from(contentBlocks)
      .where(eq(contentBlocks.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Content block not found' }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    // Validate and sanitize updates
    if (body.blockName !== undefined) {
      if (typeof body.blockName !== 'string') {
        return NextResponse.json({ 
          error: "blockName must be a string",
          code: "INVALID_BLOCK_NAME" 
        }, { status: 400 });
      }
      
      const trimmedName = body.blockName.trim();
      if (!trimmedName) {
        return NextResponse.json({ 
          error: "blockName cannot be empty",
          code: "EMPTY_BLOCK_NAME" 
        }, { status: 400 });
      }

      // Check for unique blockName (excluding current record)
      const duplicate = await db.select()
        .from(contentBlocks)
        .where(and(
          eq(contentBlocks.blockName, trimmedName),
          eq(contentBlocks.id, parseInt(id))
        ))
        .limit(1);

      if (duplicate.length === 0) {
        const otherDuplicate = await db.select()
          .from(contentBlocks)
          .where(eq(contentBlocks.blockName, trimmedName))
          .limit(1);
        
        if (otherDuplicate.length > 0) {
          return NextResponse.json({ 
            error: "Content block with this name already exists",
            code: "DUPLICATE_BLOCK_NAME" 
          }, { status: 409 });
        }
      }

      updates.blockName = trimmedName;
    }

    if (body.blockType !== undefined) {
      if (typeof body.blockType !== 'string') {
        return NextResponse.json({ 
          error: "blockType must be a string",
          code: "INVALID_BLOCK_TYPE" 
        }, { status: 400 });
      }

      const validBlockTypes = ['html', 'markdown', 'text'];
      if (!validBlockTypes.includes(body.blockType)) {
        return NextResponse.json({ 
          error: "blockType must be one of: html, markdown, text",
          code: "INVALID_BLOCK_TYPE" 
        }, { status: 400 });
      }

      updates.blockType = body.blockType;
    }

    if (body.blockContent !== undefined) {
      updates.blockContent = body.blockContent ? body.blockContent.trim() : null;
    }

    if (body.pageLocation !== undefined) {
      updates.pageLocation = body.pageLocation ? body.pageLocation.trim() : null;
    }

    if (body.isActive !== undefined) {
      updates.isActive = Boolean(body.isActive);
    }

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
      .from(contentBlocks)
      .where(eq(contentBlocks.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Content block not found' }, { status: 404 });
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