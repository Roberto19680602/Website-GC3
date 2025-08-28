import { db } from '@/db';
import { navigationItems } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { NavigationManager } from '@/components/admin/navigation-manager';

// This is the same data fetching and processing logic from the Header.
// In a real app, this should be refactored into a shared utility function.
type NavItem = typeof navigationItems.$inferSelect;
type HierarchicalNavItem = NavItem & { children: HierarchicalNavItem[] };

async function getHierarchicalNavItems(): Promise<HierarchicalNavItem[]> {
  try {
    const items = await db
      .select()
      .from(navigationItems)
      .orderBy(asc(navigationItems.parentId), asc(navigationItems.orderIndex));

    const itemMap: { [id: number]: HierarchicalNavItem } = {};
    const roots: HierarchicalNavItem[] = [];

    items.forEach(item => {
      itemMap[item.id] = { ...item, children: [] };
    });

    Object.values(itemMap).forEach(item => {
      if (item.parentId !== null && itemMap[item.parentId]) {
        itemMap[item.parentId].children.push(item);
      } else {
        roots.push(item);
      }
    });

    return roots;
  } catch (error) {
    console.error("Failed to fetch navigation items:", error);
    return [];
  }
}

export default async function NavigationPage() {
  const navItems = await getHierarchicalNavItems();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium">Navigation Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage your website's main navigation menu.
        </p>
      </div>
      <NavigationManager initialItems={navItems} />
    </div>
  );
}
