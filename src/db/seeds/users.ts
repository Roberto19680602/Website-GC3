import { db } from '@/db';
import { users } from '@/db/schema';
import bcrypt from 'bcrypt';

export async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = [
        {
            email: 'admin@gc3consultoria.com',
            password: hashedPassword,
            name: 'Administrator',
            role: 'admin',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(users).values(adminUser);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});