"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { siteSettings } from '@/db/schema';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

type Setting = typeof siteSettings.$inferSelect;

const settingsSchema = z.object({
  settings: z.array(z.object({
    id: z.number(),
    settingName: z.string(),
    settingValue: z.string().nullable(),
    settingType: z.string(),
  }))
});

type SettingsFormData = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  settings: Setting[];
}

export const SettingsForm = ({ settings: initialSettings }: SettingsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, register, handleSubmit, setValue, formState: { errors, isDirty, dirtyFields } } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      settings: initialSettings.map(s => ({...s}))
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "settings",
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsSubmitting(true);
    const dirtySettings = data.settings.filter((_, index) => dirtyFields.settings?.[index]);

    if (dirtySettings.length === 0) {
      toast.info("No changes to save.");
      setIsSubmitting(false);
      return;
    }

    const promises = dirtySettings.map(setting => {
      return fetch(`/api/admin/settings/${setting.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settingValue: setting.settingValue }),
      });
    });

    try {
      const results = await Promise.all(promises);
      const hasError = results.some(res => !res.ok);

      if (hasError) {
        throw new Error("Some settings failed to update.");
      }

      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInput = (index: number) => {
    const setting = fields[index];
    switch (setting.settingType) {
      case 'boolean':
        return (
            <Switch
                id={`settings.${index}.settingValue`}
                checked={JSON.parse(setting.settingValue || 'false')}
                onCheckedChange={(checked) => {
                    setValue(`settings.${index}.settingValue`, JSON.stringify(checked), { shouldDirty: true });
                }}
            />
        );
      case 'color':
        return (
            <Input
                type="color"
                id={`settings.${index}.settingValue`}
                {...register(`settings.${index}.settingValue`)}
                className="w-16 h-10 p-1"
            />
        );
      case 'textarea':
      case 'json':
        return (
            <Textarea
                id={`settings.${index}.settingValue`}
                {...register(`settings.${index}.settingValue`)}
                rows={4}
            />
        );
      case 'number':
        return (
            <Input
                type="number"
                id={`settings.${index}.settingValue`}
                {...register(`settings.${index}.settingValue`)}
            />
        );
      default: // 'text' and others
        return (
            <Input
                id={`settings.${index}.settingValue`}
                {...register(`settings.${index}.settingValue`)}
            />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Manage Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-1">
                    <Label htmlFor={`settings.${index}.settingValue`} className="font-semibold">{field.settingName}</Label>
                    <p className="text-xs text-muted-foreground">{initialSettings[index].description}</p>
                </div>
                <div className="md:col-span-2">
                    {renderInput(index)}
                </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-end mt-6">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};
