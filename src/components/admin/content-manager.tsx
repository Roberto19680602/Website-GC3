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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import { contentBlocks } from '@/db/schema';

type ContentBlock = typeof contentBlocks.$inferSelect;

const contentBlockSchema = z.object({
  blockContent: z.string().nullable(),
});

type ContentBlockFormData = z.infer<typeof contentBlockSchema>;

interface ContentManagerProps {
  initialBlocks: ContentBlock[];
}

export const ContentManager = ({ initialBlocks }: ContentManagerProps) => {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContentBlockFormData>({
    resolver: zodResolver(contentBlockSchema),
  });

  const handleOpenDialog = (block: ContentBlock) => {
    setEditingBlock(block);
    reset({ blockContent: block.blockContent });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ContentBlockFormData) => {
    if (!editingBlock) return;

    const res = await fetch(`/api/admin/content-blocks/${editingBlock.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blockContent: data.blockContent }),
    });

    if (res.ok) {
      toast.success("Content block updated successfully.");
      setIsDialogOpen(false);
      // Optimistically update the local state
      setBlocks(blocks.map(b => b.id === editingBlock.id ? { ...b, blockContent: data.blockContent } : b));
    } else {
      const errorData = await res.json();
      toast.error(errorData.error || "Failed to update content block.");
    }
  };

  const groupedBlocks = blocks.reduce((acc, block) => {
    const page = block.pageLocation || 'uncategorized';
    if (!acc[page]) {
      acc[page] = [];
    }
    acc[page].push(block);
    return acc;
  }, {} as Record<string, ContentBlock[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedBlocks).map(([pageLocation, blocks]) => (
        <Card key={pageLocation}>
          <CardHeader>
            <CardTitle className="capitalize">{pageLocation.replace('-', ' ')}</CardTitle>
            <CardDescription>Content blocks for the {pageLocation} page.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {blocks.map(block => (
                <div key={block.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-semibold">{block.blockName}</p>
                    <p className="text-sm text-muted-foreground">Type: {block.blockType}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(block)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Content Block: {editingBlock?.blockName}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="blockContent">Content</Label>
              <Textarea
                id="blockContent"
                {...register('blockContent')}
                rows={15}
                className="font-mono text-xs"
              />
              {errors.blockContent && <p className="text-red-500 text-sm">{errors.blockContent.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Content</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
