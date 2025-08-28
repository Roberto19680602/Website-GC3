import { db } from '@/db';
import { navigationItems } from '@/db/schema';

export async function main() {
    const sampleNavigationItems = [
        // Main Navigation Items
        {
            label: 'Inicio',
            href: '/',
            parentId: null,
            orderIndex: 1,
            isActive: true,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            label: 'Nosotros',
            href: '/nosotros',
            parentId: null,
            orderIndex: 2,
            isActive: true,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            label: 'Servicios',
            href: '/servicios',
            parentId: null,
            orderIndex: 3,
            isActive: true,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            label: 'Blog',
            href: '/blog',
            parentId: null,
            orderIndex: 4,
            isActive: true,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            label: 'Contacto',
            href: '/contacto',
            parentId: null,
            orderIndex: 5,
            isActive: true,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        // About Submenu Items (parent: Nosotros - id: 2)
        {
            label: 'Nuestro Equipo',
            href: '/nosotros/equipo',
            parentId: 2,
            orderIndex: 1,
            isActive: true,
            createdAt: new Date('2024-01-11').toISOString(),
            updatedAt: new Date('2024-01-11').toISOString(),
        },
        {
            label: 'Historia',
            href: '/nosotros/historia',
            parentId: 2,
            orderIndex: 2,
            isActive: true,
            createdAt: new Date('2024-01-11').toISOString(),
            updatedAt: new Date('2024-01-11').toISOString(),
        },
        {
            label: 'Valores',
            href: '/nosotros/valores',
            parentId: 2,
            orderIndex: 3,
            isActive: true,
            createdAt: new Date('2024-01-11').toISOString(),
            updatedAt: new Date('2024-01-11').toISOString(),
        },
        // Services Submenu Items (parent: Servicios - id: 3)
        {
            label: 'Derecho Corporativo',
            href: '/servicios/derecho-corporativo',
            parentId: 3,
            orderIndex: 1,
            isActive: true,
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            label: 'Derecho Laboral',
            href: '/servicios/derecho-laboral',
            parentId: 3,
            orderIndex: 2,
            isActive: true,
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            label: 'Derecho Civil',
            href: '/servicios/derecho-civil',
            parentId: 3,
            orderIndex: 3,
            isActive: true,
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            label: 'Derecho Fiscal',
            href: '/servicios/derecho-fiscal',
            parentId: 3,
            orderIndex: 4,
            isActive: true,
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            label: 'Propiedad Intelectual',
            href: '/servicios/propiedad-intelectual',
            parentId: 3,
            orderIndex: 5,
            isActive: true,
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        }
    ];

    await db.insert(navigationItems).values(sampleNavigationItems);
    
    console.log('✅ Navigation items seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});