// src/db/seed.ts
import { main as seedUsers } from './seeds/users';
import { main as seedSiteSettings } from './seeds/site_settings';
import { main as seedNavigationItems } from './seeds/navigation_items';
import { main as seedContentBlocks } from './seeds/content_blocks';

async function runSeeders() {
  console.log('🌱 Starting database seeding...');
  try {
    // It's often important to seed in a specific order
    await seedUsers();
    await seedSiteSettings();
    await seedNavigationItems();
    await seedContentBlocks();

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

runSeeders();
