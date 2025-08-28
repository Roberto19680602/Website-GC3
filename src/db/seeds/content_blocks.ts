import { db } from '@/db';
import { contentBlocks } from '@/db/schema';

async function main() {
    const sampleContentBlocks = [
        {
            blockName: 'footer_contact_info',
            blockContent: `
                <div class="footer-contact">
                    <h4>Información de Contacto</h4>
                    <div class="contact-item">
                        <strong>Dirección:</strong><br>
                        Av. Paseo de la Reforma 250, Piso 15<br>
                        Col. Juárez, 06600 Ciudad de México, CDMX
                    </div>
                    <div class="contact-item">
                        <strong>Teléfono:</strong><br>
                        +52 (55) 5123-4567
                    </div>
                    <div class="contact-item">
                        <strong>Email:</strong><br>
                        contacto@gc3consultoria.com
                    </div>
                </div>
            `,
            blockType: 'html',
            pageLocation: 'footer',
            isActive: true,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            blockName: 'footer_copyright',
            blockContent: '© 2024 GC3 Consultoría Legal. Todos los derechos reservados. | Aviso de Privacidad | Términos y Condiciones',
            blockType: 'text',
            pageLocation: 'footer',
            isActive: true,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            blockName: 'footer_social_links',
            blockContent: `
                <div class="social-links">
                    <a href="https://linkedin.com/company/gc3-consultoria" target="_blank" class="social-link">
                        <i class="fab fa-linkedin"></i> LinkedIn
                    </a>
                    <a href="https://twitter.com/gc3consultoria" target="_blank" class="social-link">
                        <i class="fab fa-twitter"></i> Twitter
                    </a>
                    <a href="mailto:contacto@gc3consultoria.com" class="social-link">
                        <i class="fas fa-envelope"></i> Email
                    </a>
                </div>
            `,
            blockType: 'html',
            pageLocation: 'footer',
            isActive: true,
            createdAt: new Date('2024-01-10').toISOString(),
            updatedAt: new Date('2024-01-10').toISOString(),
        },
        {
            blockName: 'hero_section',
            blockContent: `
                <section class="hero-section">
                    <div class="hero-content">
                        <h1>GC3 Consultoría Legal</h1>
                        <h2>Excelencia Jurídica al Servicio de su Empresa</h2>
                        <p class="hero-description">
                            Brindamos asesoría legal integral con más de 15 años de experiencia en derecho corporativo, 
                            fiscal y laboral. Protegemos los intereses de nuestros clientes con soluciones jurídicas 
                            innovadoras y estratégicas.
                        </p>
                        <div class="hero-actions">
                            <a href="/contacto" class="btn btn-primary">Consulta Gratuita</a>
                            <a href="/servicios" class="btn btn-secondary">Nuestros Servicios</a>
                        </div>
                    </div>
                </section>
            `,
            blockType: 'html',
            pageLocation: 'homepage',
            isActive: true,
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            blockName: 'about_section',
            blockContent: `## Sobre GC3 Consultoría Legal

**GC3 Consultoría Legal** es un despacho jurídico especializado en brindar asesoría legal integral a empresas y particulares. Con más de **15 años de experiencia** en el mercado mexicano, nos hemos consolidado como un referente en servicios legales de alta calidad.

### Nuestra Experiencia

Nuestro equipo está conformado por abogados especialistas en diversas ramas del derecho, incluyendo:

- **Derecho Corporativo y Mercantil**
- **Derecho Fiscal y Tributario**
- **Derecho Laboral**
- **Derecho Civil y Familiar**
- **Propiedad Intelectual**

### Compromiso con la Excelencia

En GC3, entendemos que cada cliente es único y requiere soluciones jurídicas personalizadas. Por eso, trabajamos de cerca con nuestros clientes para entender sus necesidades específicas y ofrecer estrategias legales efectivas.`,
            blockType: 'markdown',
            pageLocation: 'homepage',
            isActive: true,
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            blockName: 'services_overview',
            blockContent: `
                <section class="services-overview">
                    <h2>Nuestros Servicios Principales</h2>
                    <div class="services-grid">
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-building"></i>
                            </div>
                            <h3>Derecho Corporativo</h3>
                            <p>Constitución de empresas, fusiones, adquisiciones y reestructuraciones corporativas.</p>
                        </div>
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-calculator"></i>
                            </div>
                            <h3>Derecho Fiscal</h3>
                            <p>Planeación fiscal, defensa ante auditorías y optimización de cargas tributarias.</p>
                        </div>
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-users"></i>
                            </div>
                            <h3>Derecho Laboral</h3>
                            <p>Relaciones laborales, contratos de trabajo y defensa en juicios laborales.</p>
                        </div>
                        <div class="service-card">
                            <div class="service-icon">
                                <i class="fas fa-gavel"></i>
                            </div>
                            <h3>Litigio Civil</h3>
                            <p>Representación en controversias civiles y mercantiles de alta complejidad.</p>
                        </div>
                    </div>
                </section>
            `,
            blockType: 'html',
            pageLocation: 'homepage',
            isActive: true,
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            blockName: 'testimonials_section',
            blockContent: `
                <section class="testimonials">
                    <h2>Lo que Dicen Nuestros Clientes</h2>
                    <div class="testimonials-grid">
                        <div class="testimonial-card">
                            <div class="testimonial-content">
                                <p>"GC3 nos ayudó a reestructurar nuestra empresa de manera eficiente. Su conocimiento en derecho corporativo es excepcional."</p>
                            </div>
                            <div class="testimonial-author">
                                <strong>María González</strong>
                                <span>Directora General, Innovatech Solutions</span>
                            </div>
                        </div>
                        <div class="testimonial-card">
                            <div class="testimonial-content">
                                <p>"La asesoría fiscal que recibimos nos permitió optimizar significativamente nuestras obligaciones tributarias."</p>
                            </div>
                            <div class="testimonial-author">
                                <strong>Carlos Mendoza</strong>
                                <span>CFO, Grupo Industrial del Norte</span>
                            </div>
                        </div>
                        <div class="testimonial-card">
                            <div class="testimonial-content">
                                <p>"Profesionales altamente capacitados que resolvieron nuestro conflicto laboral de manera ética y eficaz."</p>
                            </div>
                            <div class="testimonial-author">
                                <strong>Ana Rodríguez</strong>
                                <span>Directora de Recursos Humanos, Comercializadora México</span>
                            </div>
                        </div>
                    </div>
                </section>
            `,
            blockType: 'html',
            pageLocation: 'homepage',
            isActive: true,
            createdAt: new Date('2024-01-12').toISOString(),
            updatedAt: new Date('2024-01-12').toISOString(),
        },
        {
            blockName: 'about_full_content',
            blockContent: `# Sobre GC3 Consultoría Legal

## Nuestra Historia

**GC3 Consultoría Legal** fue fundada en 2009 con la visión de brindar servicios jurídicos de excelencia a empresas y particulares en México. Durante más de 15 años, hemos construido una reputación sólida basada en la calidad de nuestros servicios, la ética profesional y el compromiso con nuestros clientes.

## Misión

Brindar asesoría legal integral y especializada, ofreciendo soluciones jurídicas innovadoras que protejan los intereses de nuestros clientes y contribuyan al crecimiento sostenible de sus negocios.

## Visión

Ser reconocidos como el despacho jurídico líder en México, distinguiéndonos por nuestra excelencia técnica, innovación en servicios legales y compromiso con la ética profesional.

## Valores Fundamentales

### Excelencia Profesional
Nos comprometemos a mantener los más altos estándares de calidad en todos nuestros servicios, actualizándonos constantemente en las mejores prácticas legales.

### Integridad y Ética
Actuamos con honestidad, transparencia y respeto en todas nuestras relaciones profesionales, manteniendo la confidencialidad absoluta de la información de nuestros clientes.

### Innovación
Adoptamos tecnologías y metodologías innovadoras para optimizar nuestros procesos y brindar mejores resultados a nuestros clientes.

### Compromiso con el Cliente
Trabajamos como socios estratégicos de nuestros clientes, entendiendo sus necesidades específicas y adaptando nuestras soluciones a sus objetivos empresariales.

## Nuestra Experiencia

Con más de 500 casos exitosos y clientes satisfechos en diversos sectores industriales, GC3 Consultoría Legal ha demostrado su capacidad para manejar asuntos legales de alta complejidad en:

- **Sector Financiero y Bancario**
- **Industria Manufacturera**
- **Tecnología y Telecomunicaciones**
- **Energía y Recursos Naturales**
- **Sector Inmobiliario**
- **Comercio y Distribución**

## Certificaciones y Reconocimientos

Nuestro despacho mantiene las siguientes certificaciones:

- Colegio Nacional de Abogados de México
- Barra Mexicana de Abogados
- International Bar Association (IBA)
- Certificación ISO 9001:2015 en Gestión de Calidad`,
            blockType: 'markdown',
            pageLocation: 'about-page',
            isActive: true,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            blockName: 'team_section',
            blockContent: `
                <section class="team-section">
                    <h2>Nuestro Equipo Directivo</h2>
                    <div class="team-grid">
                        <div class="team-member">
                            <div class="member-photo">
                                <img src="/images/team/garcia.jpg" alt="Lic. Roberto García Castillo">
                            </div>
                            <div class="member-info">
                                <h3>Lic. Roberto García Castillo</h3>
                                <h4>Socio Fundador y Director General</h4>
                                <p>Licenciado en Derecho por la UNAM con Maestría en Derecho Corporativo por el ITAM. Más de 20 años de experiencia en derecho mercantil y corporativo.</p>
                                <div class="member-specialties">
                                    <span>Derecho Corporativo</span>
                                    <span>Fusiones y Adquisiciones</span>
                                </div>
                            </div>
                        </div>
                        <div class="team-member">
                            <div class="member-photo">
                                <img src="/images/team/chavez.jpg" alt="Lic. Carmen Chávez Morales">
                            </div>
                            <div class="member-info">
                                <h3>Lic. Carmen Chávez Morales</h3>
                                <h4>Socia Directora de Derecho Fiscal</h4>
                                <p>Egresada de la Escuela Libre de Derecho con especialidad en Derecho Fiscal. Experta en planeación fiscal y defensa ante autoridades tributarias.</p>
                                <div class="member-specialties">
                                    <span>Derecho Fiscal</span>
                                    <span>Planeación Tributaria</span>
                                </div>
                            </div>
                        </div>
                        <div class="team-member">
                            <div class="member-photo">
                                <img src="/images/team/contreras.jpg" alt="Lic. Miguel Contreras Ruiz">
                            </div>
                            <div class="member-info">
                                <h3>Lic. Miguel Contreras Ruiz</h3>
                                <h4>Socio Director de Derecho Laboral</h4>
                                <p>Licenciado en Derecho por la Universidad Panamericana con Maestría en Derecho del Trabajo. Especialista en relaciones laborales y seguridad social.</p>
                                <div class="member-specialties">
                                    <span>Derecho Laboral</span>
                                    <span>Seguridad Social</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            `,
            blockType: 'html',
            pageLocation: 'about-page',
            isActive: true,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            blockName: 'mission_statement',
            blockContent: 'En GC3 Consultoría Legal, nuestra misión es ser el socio jurídico de confianza que impulse el crecimiento y proteja los intereses de nuestros clientes. Nos comprometemos a ofrecer servicios legales de la más alta calidad, basados en la innovación, la ética profesional y el conocimiento profundo del entorno jurídico mexicano. Trabajamos incansablemente para superar las expectativas de nuestros clientes, construyendo relaciones duraderas basadas en la confianza mutua y los resultados excepcionales.',
            blockType: 'text',
            pageLocation: 'about-page',
            isActive: true,
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            blockName: 'contact_form_intro',
            blockContent: 'Estamos aquí para ayudarle con todas sus necesidades legales. Complete el siguiente formulario y uno de nuestros abogados especialistas se pondrá en contacto con usted dentro de las próximas 24 horas. Toda consulta inicial es completamente confidencial y sin costo alguno.',
            blockType: 'text',
            pageLocation: 'contact-page',
            isActive: true,
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-01-18').toISOString(),
        },
        {
            blockName: 'office_hours',
            blockContent: `
                <div class="office-hours">
                    <h3>Horarios de Atención</h3>
                    <div class="schedule">
                        <div class="schedule-item">
                            <strong>Lunes a Viernes:</strong>
                            <span>9:00 AM - 7:00 PM</span>
                        </div>
                        <div class="schedule-item">
                            <strong>Sábados:</strong>
                            <span>9:00 AM - 2:00 PM</span>
                        </div>
                        <div class="schedule-item">
                            <strong>Domingos:</strong>
                            <span>Cerrado</span>
                        </div>
                    </div>
                    <div class="emergency-contact">
                        <h4>Atención de Emergencias</h4>
                        <p>Para asuntos urgentes fuera del horario de oficina, contáctenos al:</p>
                        <strong>+52 (55) 1234-5678</strong>
                        <p><small>*Aplican tarifas especiales para atención fuera de horario</small></p>
                    </div>
                </div>
            `,
            blockType: 'html',
            pageLocation: 'contact-page',
            isActive: true,
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-01-18').toISOString(),
        }
    ];

    await db.insert(contentBlocks).values(sampleContentBlocks);
    
    console.log('✅ Content blocks seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});