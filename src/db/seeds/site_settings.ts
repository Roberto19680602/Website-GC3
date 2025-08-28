import { db } from '@/db';
import { siteSettings } from '@/db/schema';

async function main() {
    const sampleSettings = [
        // Brand & Design Settings
        {
            settingName: 'primaryColor',
            settingValue: '#1E5F99',
            settingType: 'color',
            description: 'Primary brand color for the website',
            category: 'branding',
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            settingName: 'secondaryColor',
            settingValue: '#55ACEE',
            settingType: 'color',
            description: 'Secondary brand color for accents and highlights',
            category: 'branding',
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            settingName: 'accentColor',
            settingValue: '#F8B500',
            settingType: 'color',
            description: 'Accent color for buttons and call-to-action elements',
            category: 'branding',
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            settingName: 'fontFamily',
            settingValue: 'Inter',
            settingType: 'text',
            description: 'Primary font family for the website',
            category: 'branding',
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            settingName: 'logoUrl',
            settingValue: '/images/logo.svg',
            settingType: 'text',
            description: 'Company logo image URL',
            category: 'branding',
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        // Company Information
        {
            settingName: 'companyName',
            settingValue: 'GC3 Consultoría Legal',
            settingType: 'text',
            description: 'Official company name',
            category: 'company',
            createdAt: new Date('2024-01-11').toISOString(),
            updatedAt: new Date('2024-01-11').toISOString(),
        },
        {
            settingName: 'companyTagline',
            settingValue: 'Soluciones Legales Integrales',
            settingType: 'text',
            description: 'Company tagline or slogan',
            category: 'company',
            createdAt: new Date('2024-01-11').toISOString(),
            updatedAt: new Date('2024-01-11').toISOString(),
        },
        {
            settingName: 'companyAddress',
            settingValue: 'Av. Principal 123, Ciudad de México',
            settingType: 'text',
            description: 'Company physical address',
            category: 'company',
            createdAt: new Date('2024-01-11').toISOString(),
            updatedAt: new Date('2024-01-11').toISOString(),
        },
        {
            settingName: 'companyPhone',
            settingValue: '+52 55 1234 5678',
            settingType: 'text',
            description: 'Primary company phone number',
            category: 'company',
            createdAt: new Date('2024-01-11').toISOString(),
            updatedAt: new Date('2024-01-11').toISOString(),
        },
        {
            settingName: 'companyEmail',
            settingValue: 'contacto@gc3consultoria.com',
            settingType: 'text',
            description: 'Primary company email address',
            category: 'company',
            createdAt: new Date('2024-01-11').toISOString(),
            updatedAt: new Date('2024-01-11').toISOString(),
        },
        // Social Media Links
        {
            settingName: 'facebookUrl',
            settingValue: 'https://facebook.com/gc3consultoria',
            settingType: 'text',
            description: 'Company Facebook page URL',
            category: 'social',
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            settingName: 'linkedinUrl',
            settingValue: 'https://linkedin.com/company/gc3consultoria',
            settingType: 'text',
            description: 'Company LinkedIn page URL',
            category: 'social',
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            settingName: 'twitterUrl',
            settingValue: 'https://twitter.com/gc3consultoria',
            settingType: 'text',
            description: 'Company Twitter profile URL',
            category: 'social',
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        // Website Settings
        {
            settingName: 'siteTitle',
            settingValue: 'GC3 Consultoría Legal - Abogados Especializados',
            settingType: 'text',
            description: 'Main website title for SEO',
            category: 'website',
            createdAt: new Date('2024-01-13').toISOString(),
            updatedAt: new Date('2024-01-13').toISOString(),
        },
        {
            settingName: 'metaDescription',
            settingValue: 'Firma de abogados especializada en derecho corporativo, laboral y civil. Más de 15 años de experiencia.',
            settingType: 'text',
            description: 'Meta description for SEO',
            category: 'website',
            createdAt: new Date('2024-01-13').toISOString(),
            updatedAt: new Date('2024-01-13').toISOString(),
        },
        {
            settingName: 'showContactForm',
            settingValue: 'true',
            settingType: 'boolean',
            description: 'Display contact form on the website',
            category: 'website',
            createdAt: new Date('2024-01-13').toISOString(),
            updatedAt: new Date('2024-01-13').toISOString(),
        },
        {
            settingName: 'enableBlog',
            settingValue: 'true',
            settingType: 'boolean',
            description: 'Enable blog functionality',
            category: 'website',
            createdAt: new Date('2024-01-13').toISOString(),
            updatedAt: new Date('2024-01-13').toISOString(),
        },
        {
            settingName: 'maintenanceMode',
            settingValue: 'false',
            settingType: 'boolean',
            description: 'Enable maintenance mode to disable public access',
            category: 'website',
            createdAt: new Date('2024-01-13').toISOString(),
            updatedAt: new Date('2024-01-13').toISOString(),
        },
        // Business Settings
        {
            settingName: 'businessHours',
            settingValue: '{"monday": "9:00-18:00", "tuesday": "9:00-18:00", "wednesday": "9:00-18:00", "thursday": "9:00-18:00", "friday": "9:00-17:00", "saturday": "closed", "sunday": "closed"}',
            settingType: 'json',
            description: 'Business operating hours by day of the week',
            category: 'business',
            createdAt: new Date('2024-01-14').toISOString(),
            updatedAt: new Date('2024-01-14').toISOString(),
        },
        {
            settingName: 'yearsOfExperience',
            settingValue: '15',
            settingType: 'number',
            description: 'Years of experience in legal consulting',
            category: 'business',
            createdAt: new Date('2024-01-14').toISOString(),
            updatedAt: new Date('2024-01-14').toISOString(),
        }
    ];

    await db.insert(siteSettings).values(sampleSettings);
    
    console.log('✅ Site settings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});