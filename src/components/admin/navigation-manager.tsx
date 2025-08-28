"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Edit, Trash2, GripVertical } from 'lucide-react';
import { navigationItems } from '@/db/schema';

type NavItem = typeof navigationItems.$inferSelect;
type HierarchicalNavItem = NavItem & { children: HierarchicalNavItem[] };

const navItemSchema = z.object({
  label: z.string().min(1, "Label is required"),
  href: z.string().min(1, "URL is required"),
  parentId: z.number().nullable(),
});

type NavItemFormData = z.infer<typeof navItemSchema>;

interface NavigationManagerProps {
  initialItems: HierarchicalNavItem[];
}

interface NavItemComponentProps {
  item: HierarchicalNavItem;
  level: number;
  onEdit: (item: NavItem) => void;
  onDelete: (id: number) => void;
  onAddChild: (parentId: number) => void;
}

const NavItemRow = ({ item, level, onEdit, onDelete, onAddChild }: NavItemComponentProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center bg-gray-50 p-2 rounded-md" style={{ marginLeft: `${level * 2}rem` }}>
        <GripVertical className="h-5 w-5 text-gray-400 mr-2" />
        <div className="flex-1">
          <p className="font-medium">{item.label}</p>
          <p className="text-sm text-gray-500">{item.href}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onAddChild(item.id)}>
            <PlusCircle className="h-4 w-4 mr-1" /> Add Child
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {item.children.length > 0 && (
        <div className="mt-2 space-y-2">
          {item.children.map(child => (
            <NavItemRow key={child.id} item={child} level={level + 1} onEdit={onEdit} onDelete={onDelete} onAddChild={onAddChild} />
          ))}
        </div>
      )}
    </div>
  );
};

export const NavigationManager = ({ initialItems }: NavigationManagerProps) => {
  const [items, setItems] = useState(initialItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavItem | null>(null);
  const [parentId, setParentId] = useState<number | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NavItemFormData>({
    resolver: zodResolver(navItemSchema),
  });

  const handleOpenDialog = (item: NavItem | null = null, parentId: number | null = null) => {
    setEditingItem(item);
    setParentId(parentId);
    reset(item ? { label: item.label, href: item.href, parentId: item.parentId } : { label: '', href: '/', parentId });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item? This cannot be undone.')) {
      return;
    }

    const res = await fetch(`/api/admin/navigation-items/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success("Navigation item deleted.");
      // Refresh data by reloading the page. A more advanced implementation would update state.
      window.location.reload();
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to delete item.");
    }
  };

  const onSubmit = async (data: NavItemFormData) => {
    const url = editingItem ? `/api/admin/navigation-items/${editingItem.id}` : '/api/admin/navigation-items';
    const method = editingItem ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success(`Navigation item ${editingItem ? 'updated' : 'created'}.`);
      setIsDialogOpen(false);
      // Refresh data
      window.location.reload();
    } else {
      const errorData = await res.json();
      toast.error(errorData.error || "An error occurred.");
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={() => handleOpenDialog(null, null)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Top-Level Item
        </Button>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <NavItemRow key={item.id} item={item} level={0} onEdit={handleOpenDialog} onDelete={handleDelete} onAddChild={(parentId) => handleOpenDialog(null, parentId)} />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Edit' : 'Create'} Navigation Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="label">Label</Label>
              <Input id="label" {...register('label')} />
              {errors.label && <p className="text-red-500 text-sm">{errors.label.message}</p>}
            </div>
            <div>
              <Label htmlFor="href">URL</Label>
              <Input id="href" {...register('href')} />
              {errors.href && <p className="text-red-500 text-sm">{errors.href.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
