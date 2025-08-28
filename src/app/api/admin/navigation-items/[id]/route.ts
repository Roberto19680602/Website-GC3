import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { navigationItems } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: "Valid ID is required",
        code: "INVALID_ID"
      }, { status: 400 });
    }

    const record = await db.select()
      .from(navigationItems)
      .where(eq(navigationItems.id, parseInt(id)))
      .limit(1);

    if (record.length === 0) {
      return NextResponse.json({
        error: 'Navigation item not found'
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: "Valid ID is required",
        code: "INVALID_ID"
      }, { status: 400 });
    }

    const numericId = parseInt(id);

    // Check if record exists
    const existingRecord = await db.select()
      .from(navigationItems)
      .where(eq(navigationItems.id, numericId))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({
        error: 'Navigation item not found'
      }, { status: 404 });
    }

    const body = await request.json();
    const updates: any = {};

    // Validate and sanitize label
    if (body.label !== undefined) {
      if (typeof body.label === 'string') {
        updates.label = body.label.trim();
      } else if (body.label !== null) {
        return NextResponse.json({
          error: "Label must be a string",
          code: "INVALID_LABEL"
        }, { status: 400 });
      }
    }

    // Validate and sanitize href
    if (body.href !== undefined) {
      if (typeof body.href === 'string') {
        updates.href = body.href.trim();
      } else if (body.href !== null) {
        return NextResponse.json({
          error: "Href must be a string",
          code: "INVALID_HREF"
        }, { status: 400 });
      }
    }

    // Validate parentId
    if (body.parentId !== undefined) {
      if (body.parentId === null) {
        updates.parentId = null;
      } else if (typeof body.parentId === 'number' || typeof body.parentId === 'string') {
        const parentId = parseInt(body.parentId.toString());
        
        if (isNaN(parentId)) {
          return NextResponse.json({
            error: "Parent ID must be a valid integer",
            code: "INVALID_PARENT_ID"
          }, { status: 400 });
        }

        // Prevent self-reference
        if (parentId === numericId) {
          return NextResponse.json({
            error: "Navigation item cannot be its own parent",
            code: "SELF_REFERENCE"
          }, { status: 400 });
        }

        // Validate parent exists
        const parentExists = await db.select()
          .from(navigationItems)
          .where(eq(navigationItems.id, parentId))
          .limit(1);

        if (parentExists.length === 0) {
          return NextResponse.json({
            error: "Parent navigation item not found",
            code: "PARENT_NOT_FOUND"
          }, { status: 400 });
        }

        updates.parentId = parentId;
      } else {
        return NextResponse.json({
          error: "Parent ID must be a number or null",
          code: "INVALID_PARENT_ID"
        }, { status: 400 });
      }
    }

    // Validate orderIndex
    if (body.orderIndex !== undefined) {
      if (typeof body.orderIndex === 'number' || typeof body.orderIndex === 'string') {
        const orderIndex = parseInt(body.orderIndex.toString());
        if (isNaN(orderIndex)) {
          return NextResponse.json({
            error: "Order index must be a valid integer",
            code: "INVALID_ORDER_INDEX"
          }, { status: 400 });
        }
        updates.orderIndex = orderIndex;
      } else {
        return NextResponse.json({
          error: "Order index must be a number",
          code: "INVALID_ORDER_INDEX"
        }, { status: 400 });
      }
    }

    // Validate isActive
    if (body.isActive !== undefined) {
      if (typeof body.isActive === 'boolean') {
        updates.isActive = body.isActive;
      } else {
        return NextResponse.json({
          error: "isActive must be a boolean",
          code: "INVALID_IS_ACTIVE"
        }, { status: 400 });
      }
    }

    // Always update timestamp
    updates.updatedAt = new Date().toISOString();

    const updated = await db.update(navigationItems)
      .set(updates)
      .where(eq(navigationItems.id, numericId))
      .returning();

    if (!Array.isArray(updated) || updated.length === 0) {
      return NextResponse.json({
        error: 'Failed to update or retrieve the updated record'
      }, { status: 500 });
    }

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: "Valid ID is required",
        code: "INVALID_ID"
      }, { status: 400 });
    }

    const numericId = parseInt(id);

    // Check if record exists
    const existingRecord = await db.select()
      .from(navigationItems)
      .where(eq(navigationItems.id, numericId))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({
        error: 'Navigation item not found'
      }, { status: 404 });
    }

    // Check for children
    const children = await db.select()
      .from(navigationItems)
      .where(eq(navigationItems.parentId, numericId));

    const deleted = await db.delete(navigationItems)
      .where(eq(navigationItems.id, numericId))
      .returning();

    if (!Array.isArray(deleted) || deleted.length === 0) {
      return NextResponse.json({
        error: 'Failed to delete or retrieve the deleted record'
      }, { status: 500 });
    }

    const response: any = {
      message: 'Navigation item deleted successfully',
      deletedItem: deleted[0]
    };

    if (children.length > 0) {
      response.warning = `This item had ${children.length} child item(s) that are now orphaned`;
      response.orphanedChildren = children.map(child => ({
        id: child.id,
        label: child.label
      }));
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}