import Header from '@/components/sections/header'
import Footer from '@/components/sections/footer'
import { Search, Filter, Calendar, User, Clock } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: "Estrategias de Transformación Digital para Empresas Tradicionales",
    excerpt: "Cómo las empresas establecidas pueden adaptarse exitosamente a la era digital sin perder su identidad corporativa.",
    author: "María González",
    date: "15 de Enero, 2024",
    readTime: "8 min",
    category: "Transformación Digital",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
  },
  {
    id: 2,
    title: "Liderazgo Efectivo en Tiempos de Crisis: Lecciones Aprendidas",
    excerpt: "Análisis de las mejores prácticas de liderazgo que han demostrado ser efectivas durante períodos de incertidumbre.",
    author: "Carlos Rodríguez",
    date: "12 de Enero, 2024",
    readTime: "6 min",
    category: "Liderazgo",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
  },
  {
    id: 3,
    title: "Optimización de Procesos: Metodología Lean en Servicios",
    excerpt: "Implementación de principios Lean Manufacturing adaptados al sector servicios para mejorar la eficiencia operacional.",
    author: "Ana Martínez",
    date: "10 de Enero, 2024",
    readTime: "10 min",
    category: "Procesos",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop"
  },
  {
    id: 4,
    title: "Análisis de Mercado: Tendencias de Consumo Post-Pandemia",
    excerpt: "Estudio detallado de cómo han cambiado los hábitos de consumo y qué oportunidades esto presenta para las empresas.",
    author: "Luis Fernández",
    date: "8 de Enero, 2024",
    readTime: "12 min",
    category: "Análisis de Mercado",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop"
  },
  {
    id: 5,
    title: "Gestión del Talento Humano en la Era del Trabajo Remoto",
    excerpt: "Estrategias para mantener la productividad y el compromiso del equipo en entornos de trabajo híbrido y remoto.",
    author: "Patricia Silva",
    date: "5 de Enero, 2024",
    readTime: "7 min",
    category: "Recursos Humanos",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop"
  },
  {
    id: 6,
    title: "Sostenibilidad Corporativa: Más Allá del Marketing Verde",
    excerpt: "Cómo implementar prácticas sostenibles genuinas que generen valor tanto ambiental como económico.",
    author: "Roberto Jiménez",
    date: "2 de Enero, 2024",
    readTime: "9 min",
    category: "Sostenibilidad",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=250&fit=crop"
  }
]

const categories = [
  "Todos",
  "Transformación Digital",
  "Liderazgo",
  "Procesos",
  "Análisis de Mercado",
  "Recursos Humanos",
  "Sostenibilidad"
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1E5F99] to-[#55ACEE] py-20">
        <div className="container">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog de GC3 Consultoría
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Compartimos conocimiento y perspectivas sobre estrategia empresarial, 
              liderazgo e innovación para impulsar el crecimiento de tu organización
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-[#F5F5F5]">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B5B5B5] w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                className="w-full pl-10 pr-4 py-3 border border-[#ddd] rounded-lg focus:outline-none focus:border-[#1E5F99] transition-colors"
              />
            </div>

            {/* Categories Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-[#4A4A4A] w-5 h-5" />
              <select className="px-4 py-3 border border-[#ddd] rounded-lg focus:outline-none focus:border-[#1E5F99] bg-white">
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
              >
                {/* Blog Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#1E5F99] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-[#000000] group-hover:text-[#1E5F99] transition-colors duration-300 line-clamp-2">
                    <a href={`/blog/${post.id}`}>
                      {post.title}
                    </a>
                  </h3>
                  
                  <p className="text-[#4A4A4A] mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-[#B5B5B5]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="bg-[#1E5F99] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#154a7a] transition-colors duration-300 shadow-md hover:shadow-lg">
              Cargar Más Artículos
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1E5F99] to-[#55ACEE]">
        <div className="container">
          <div className="text-center text-white max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Mantente Actualizado
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Recibe nuestros últimos artículos y insights directamente en tu correo electrónico
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 rounded-lg text-[#000000] focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-[#1E5F99] px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}