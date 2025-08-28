import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { navigationItems } from '@/db/schema';
import { eq, like, and, or, desc, asc, isNull } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const parentId = searchParams.get('parent_id');
    const active = searchParams.get('active');
    const sort = searchParams.get('sort') || 'orderIndex';
    const order = searchParams.get('order') || 'asc';

    // Build query
    let query = db.select().from(navigationItems);
    
    const conditions = [];

    // Search filter
    if (search) {
      conditions.push(
        or(
          like(navigationItems.label, `%${search}%`),
          like(navigationItems.href, `%${search}%`)
        )
      );
    }

    // Parent filter
    if (parentId !== null) {
      if (parentId === 'null' || parentId === '') {
        conditions.push(isNull(navigationItems.parentId));
      } else {
        const parentIdNum = parseInt(parentId);
        if (!isNaN(parentIdNum)) {
          conditions.push(eq(navigationItems.parentId, parentIdNum));
        }
      }
    }

    // Active filter
    if (active !== null) {
      const isActive = active === 'true';
      conditions.push(eq(navigationItems.isActive, isActive));
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortField = sort === 'label' ? navigationItems.label : 
                     sort === 'href' ? navigationItems.href :
                     sort === 'createdAt' ? navigationItems.createdAt :
                     sort === 'updatedAt' ? navigationItems.updatedAt :
                     navigationItems.orderIndex;

    if (order === 'desc') {
      query = query.orderBy(desc(sortField));
    } else {
      query = query.orderBy(asc(sortField));
    }

    // Default secondary sort by label if not sorting by label
    if (sort !== 'label') {
      query = query.orderBy(asc(navigationItems.label));
    }

    // Apply pagination
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
    if (!body.label || typeof body.label !== 'string') {
      return NextResponse.json({ 
        error: "Label is required and must be a string",
        code: "MISSING_LABEL" 
      }, { status: 400 });
    }

    if (!body.href || typeof body.href !== 'string') {
      return NextResponse.json({ 
        error: "Href is required and must be a string",
        code: "MISSING_HREF" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const label = body.label.trim();
    const href = body.href.trim();

    if (!label) {
      return NextResponse.json({ 
        error: "Label cannot be empty",
        code: "EMPTY_LABEL" 
      }, { status: 400 });
    }

    if (!href) {
      return NextResponse.json({ 
        error: "Href cannot be empty",
        code: "EMPTY_HREF" 
      }, { status: 400 });
    }

    // Validate parentId if provided
    if (body.parentId !== undefined && body.parentId !== null) {
      const parentIdNum = parseInt(body.parentId);
      if (isNaN(parentIdNum)) {
        return NextResponse.json({ 
          error: "Parent ID must be a valid integer",
          code: "INVALID_PARENT_ID" 
        }, { status: 400 });
      }

      // Check if parent exists
      const parentExists = await db.select()
        .from(navigationItems)
        .where(eq(navigationItems.id, parentIdNum))
        .limit(1);

      if (parentExists.length === 0) {
        return NextResponse.json({ 
          error: "Parent navigation item not found",
          code: "PARENT_NOT_FOUND" 
        }, { status: 400 });
      }
    }

    // Prepare data for insertion
    const insertData = {
      label,
      href,
      parentId: body.parentId !== undefined && body.parentId !== null ? parseInt(body.parentId) : null,
      orderIndex: typeof body.orderIndex === 'number' ? body.orderIndex : 0,
      isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Insert the new navigation item
    const newNavigationItem = await db.insert(navigationItems)
      .values(insertData)
      .returning();

    return NextResponse.json(newNavigationItem[0], { status: 201 });
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const navigationItemId = parseInt(id);

    // Check if record exists
    const existingRecord = await db.select()
      .from(navigationItems)
      .where(eq(navigationItems.id, navigationItemId))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Navigation item not found' 
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and update label if provided
    if (body.label !== undefined) {
      if (typeof body.label !== 'string') {
        return NextResponse.json({ 
          error: "Label must be a string",
          code: "INVALID_LABEL" 
        }, { status: 400 });
      }
      const trimmedLabel = body.label.trim();
      if (!trimmedLabel) {
        return NextResponse.json({ 
          error: "Label cannot be empty",
          code: "EMPTY_LABEL" 
        }, { status: 400 });
      }
      updates.label = trimmedLabel;
    }

    // Validate and update href if provided
    if (body.href !== undefined) {
      if (typeof body.href !== 'string') {
        return NextResponse.json({ 
          error: "Href must be a string",
          code: "INVALID_HREF" 
        }, { status: 400 });
      }
      const trimmedHref = body.href.trim();
      if (!trimmedHref) {
        return NextResponse.json({ 
          error: "Href cannot be empty",
          code: "EMPTY_HREF" 
        }, { status: 400 });
      }
      updates.href = trimmedHref;
    }

    // Validate parentId if provided
    if (body.parentId !== undefined) {
      if (body.parentId === null) {
        updates.parentId = null;
      } else {
        const parentIdNum = parseInt(body.parentId);
        if (isNaN(parentIdNum)) {
          return NextResponse.json({ 
            error: "Parent ID must be a valid integer or null",
            code: "INVALID_PARENT_ID" 
          }, { status: 400 });
        }

        // Prevent self-reference
        if (parentIdNum === navigationItemId) {
          return NextResponse.json({ 
            error: "Navigation item cannot be its own parent",
            code: "SELF_REFERENCE" 
          }, { status: 400 });
        }

        // Check if parent exists
        const parentExists = await db.select()
          .from(navigationItems)
          .where(eq(navigationItems.id, parentIdNum))
          .limit(1);

        if (parentExists.length === 0) {
          return NextResponse.json({ 
            error: "Parent navigation item not found",
            code: "PARENT_NOT_FOUND" 
          }, { status: 400 });
        }

        updates.parentId = parentIdNum;
      }
    }

    // Update orderIndex if provided
    if (body.orderIndex !== undefined) {
      if (typeof body.orderIndex !== 'number') {
        return NextResponse.json({ 
          error: "Order index must be a number",
          code: "INVALID_ORDER_INDEX" 
        }, { status: 400 });
      }
      updates.orderIndex = body.orderIndex;
    }

    // Update isActive if provided
    if (body.isActive !== undefined) {
      if (typeof body.isActive !== 'boolean') {
        return NextResponse.json({ 
          error: "isActive must be a boolean",
          code: "INVALID_IS_ACTIVE" 
        }, { status: 400 });
      }
      updates.isActive = body.isActive;
    }

    // Always update updatedAt
    updates.updatedAt = new Date().toISOString();

    // Perform update
    const updated = await db.update(navigationItems)
      .set(updates)
      .where(eq(navigationItems.id, navigationItemId))
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const navigationItemId = parseInt(id);

    // Check if record exists
    const existingRecord = await db.select()
      .from(navigationItems)
      .where(eq(navigationItems.id, navigationItemId))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Navigation item not found' 
      }, { status: 404 });
    }

    // Check if item has children
    const children = await db.select()
      .from(navigationItems)
      .where(eq(navigationItems.parentId, navigationItemId))
      .limit(1);

    if (children.length > 0) {
      return NextResponse.json({ 
        error: "Cannot delete navigation item with children. Please delete or reassign child items first.",
        code: "HAS_CHILDREN" 
      }, { status: 400 });
    }

    // Delete the navigation item
    const deleted = await db.delete(navigationItems)
      .where(eq(navigationItems.id, navigationItemId))
      .returning();

    return NextResponse.json({
      message: 'Navigation item deleted successfully',
      deletedItem: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}