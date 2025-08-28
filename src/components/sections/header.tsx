import { db } from '@/db';
import { navigationItems } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import React from 'react';
import { cn } from '@/lib/utils';

// Define the hierarchical type
type NavItem = typeof navigationItems.$inferSelect;
type HierarchicalNavItem = NavItem & { children: HierarchicalNavItem[] };

// Data fetching and processing function
async function getHierarchicalNavItems(): Promise<HierarchicalNavItem[]> {
  try {
    const items = await db
      .select()
      .from(navigationItems)
      .where(eq(navigationItems.isActive, true))
      .orderBy(asc(navigationItems.parentId), asc(navigationItems.orderIndex));

    const itemMap: { [id: number]: HierarchicalNavItem } = {};
    const roots: HierarchicalNavItem[] = [];

    // Initialize map and add children array to each item
    items.forEach(item => {
      itemMap[item.id] = { ...item, children: [] };
    });

    // Populate children arrays and identify root nodes
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
    return []; // Return empty array on error
  }
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"


const Header = async () => {
  const navItems = await getHierarchicalNavItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">GC3</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.id}>
                  {item.children.length > 0 ? (
                    <>
                      <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                          {item.children.map((child) => (
                            <ListItem
                              key={child.id}
                              href={child.href}
                              title={child.label}
                            >
                              {/* You can add a description here if the schema supports it */}
                            </ListItem>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Mobile Menu */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:hidden">
           <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold">GC3</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-6">
                {navItems.map((item) => (
                  <div key={item.id}>
                    <Link
                      href={item.href}
                      className="text-lg font-medium"
                    >
                      {item.label}
                    </Link>
                    {item.children.length > 0 && (
                      <div className="pl-4 mt-2 space-y-2">
                        {item.children.map((child) => (
                           <Link
                            key={child.id}
                            href={child.href}
                            className="text-md font-normal text-muted-foreground block"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
             <Link href="/login">
                <Button variant="ghost">Login</Button>
             </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
