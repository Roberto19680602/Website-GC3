import { db } from '@/db';
import { siteSettings } from '@/db/schema';
import { SettingsForm } from '@/components/admin/settings-form';
import { asc } from 'drizzle-orm';

async function getSettings() {
  try {
    const settings = await db.select().from(siteSettings).orderBy(asc(siteSettings.id));
    return settings;
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return [];
  }
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-medium">Site Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your website's global settings here.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
