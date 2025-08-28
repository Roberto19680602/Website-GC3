import { db } from '@/db';
import { contentBlocks } from '@/db/schema';
import { asc, desc } from 'drizzle-orm';
import { ContentManager } from '@/components/admin/content-manager';

async function getContentBlocks() {
  try {
    const blocks = await db.select().from(contentBlocks).orderBy(desc(contentBlocks.pageLocation), asc(contentBlocks.id));
    return blocks;
  } catch (error) {
    console.error("Failed to fetch content blocks:", error);
    return [];
  }
}

export default async function ContentPage() {
  const blocks = await getContentBlocks();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium">Content Management</h1>
        <p className="text-sm text-muted-foreground">
          Edit the content for the various pages on your site.
        </p>
      </div>
      <ContentManager initialBlocks={blocks} />
    </div>
  );
}
