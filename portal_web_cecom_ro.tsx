import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Mail, 
  GraduationCap, 
  Compass, 
  Coffee, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  Menu, 
  X, 
  Briefcase, 
  ShoppingCart, 
  Sprout, 
  Building2, 
  Users, 
  FileText, 
  Phone, 
  Clock, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Globe, 
  ExternalLink,
  Layers,
  Landmark,
  ShieldCheck,
  TrendingUp,
  Download
} from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('inicio');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeNestedDropdown, setActiveNestedDropdown] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Slides del Hero
  const slides = [
    {
      title: 'Impulsando la posición competitiva y el desarrollo sostenible',
      desc: 'Articulamos los esfuerzos de empresarios, gremios, academia y gobiernos locales para generar ventajas sostenibles, atraer inversiones y potenciar a Chiriquí, Bocas del Toro y la Comarca Ngäbe-Buglé.',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1920&q=80',
      badge: 'Alianza Público-Privada para el Desarrollo • Región Occidental',
      highlight: 'competitiva'
    },
    {
      title: 'Potenciando la Agroindustria y el Circuito del Café',
      desc: 'Posicionamos el café especial de Tierras Altas y Boquete junto con la producción agropecuaria de alto valor en los principales mercados internacionales.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1920&q=80',
      badge: 'Vocación Productiva y Turística de Chiriquí',
      highlight: 'Agroindustria'
    },
    {
      title: 'Infraestructura Estratégica para la Región Occidental',
      desc: 'Promovemos proyectos clave de conectividad logística, puerto multimodal Barú y transición energética para catalizar el crecimiento socioeconómico.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
      badge: 'Visión Regional 2050 en Marcha',
      highlight: 'Región Occidental'
    }
  ];

  // Cambio automático del slider en el inicio
  useEffect(() => {
    if (currentPage !== 'inicio') return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [currentPage, slides.length]);

  const navigate = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setActiveNestedDropdown(false);
    setSearchModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('aecid') || q.includes('vacante')) navigate('vacantes-aecid');
    else if (q.includes('compra') || q.includes('licita')) navigate('portal-compras-aecid');
    else if (q.includes('cafe') || q.includes('café') || q.includes('turism')) navigate('turismo');
    else if (q.includes('asociad') || q.includes('aliad') || q.includes('convenio')) navigate('asociados');
    else if (q.includes('vision') || q.includes('2050')) navigate('vision-2050');
    else if (q.includes('quien') || q.includes('somos')) navigate('quienes-somos');
    else navigate('noticias');
    setSearchModalOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 font-sans antialiased selection:bg-[#C63E43] selection:text-white">
      
      {/* ========================================================= */}
      {/* 1. TOP BAR                                                */}
      {/* ========================================================= */}
      <div className="bg-slate-100 text-slate-600 text-xs font-medium border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center py-2 gap-2">
          <div className="flex items-center space-x-3 sm:space-x-5">
            <button 
              onClick={() => setSearchModalOpen(true)} 
              className="flex items-center space-x-1.5 hover:text-[#C63E43] transition-colors text-slate-700 font-semibold cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#2F358A]" />
              <span>Buscar</span>
            </button>
            <span className="text-slate-300">|</span>
            <button 
              onClick={() => navigate('contacto')} 
              className="hover:text-[#C63E43] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-[#2F358A]" />
              <span>Contacto</span>
            </button>
            <span className="text-slate-300">|</span>
            <a 
              href="https://www.itse.ac.pa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#C63E43] transition-colors font-semibold text-slate-700 flex items-center gap-1"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[#2F358A]" />
              <span>ITSE Panamá</span>
            </a>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <button 
              onClick={() => navigate('vision-2050')} 
              className="hover:text-[#C63E43] transition-colors font-semibold text-[#2F358A] hidden sm:flex items-center gap-1 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Visiones Regionales 2050</span>
            </button>
          </div>

          {/* Redes Sociales Oficiales */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="hidden md:inline text-slate-500 text-[11px] uppercase tracking-wider font-semibold">Síguenos:</span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-slate-200 hover:bg-[#2F358A] hover:text-white flex items-center justify-center transition-all" aria-label="Facebook">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.688 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-slate-200 hover:bg-[#2F358A] hover:text-white flex items-center justify-center transition-all" aria-label="Twitter">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-slate-200 hover:bg-[#C63E43] hover:text-white flex items-center justify-center transition-all" aria-label="YouTube">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded-full bg-slate-200 hover:bg-[#C63E43] hover:text-white flex items-center justify-center transition-all" aria-label="Instagram">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. HEADER PRINCIPAL (Logos CECOM-RO, ITSE, Circuito Café)  */}
      {/* ========================================================= */}
      <header className="bg-white py-3.5 border-b border-slate-100 shadow-sm relative z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo CECOM-RO */}
          <button onClick={() => navigate('inicio')} className="flex items-center gap-3.5 group text-left cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F358A] to-[#23286E] flex items-center justify-center shadow-md shadow-[#2F358A]/20 group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" stroke="#C63E43" strokeWidth="2.5" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="white" />
                <path d="M2 12h20" stroke="white" />
                <circle cx="12" cy="12" r="3" fill="#C63E43" stroke="none" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-[#2F358A]">CECOM</span>
                <span className="font-extrabold text-2xl tracking-tight text-[#C63E43]">RO</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider leading-tight max-w-[270px] hidden sm:block">
                Centro de Competitividad de la Región Occidental
              </span>
            </div>
          </button>

          {/* Logos Derecha: ITSE y Circuito del Café */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* ITSE Logo Badge */}
            <a 
              href="https://www.itse.ac.pa" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#2F358A] transition-all bg-slate-50/80 group"
              title="Instituto Técnico Superior Especializado"
            >
              <div className="w-7 h-7 rounded bg-[#2F358A] text-white flex items-center justify-center font-black text-[11px] tracking-tighter">
                ITSE
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-[#2F358A] tracking-tight uppercase leading-none group-hover:text-[#C63E43] transition-colors">ITSE Panamá</span>
                <span className="text-[9px] text-slate-400 font-medium">Educación Superior</span>
              </div>
            </a>

            {/* Circuito del Café Badge */}
            <button 
              onClick={() => navigate('turismo')} 
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50/60 hover:border-amber-400 transition-all group text-left cursor-pointer"
              title="Circuito del Café de Chiriquí"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white flex items-center justify-center shadow-sm">
                <Coffee className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-bold text-amber-900 tracking-tight leading-none group-hover:text-[#C63E43] transition-colors">Circuito del Café</span>
                <span className="text-[9px] text-amber-700 font-medium">Tierras Altas • Boquete</span>
              </div>
            </button>

            {/* Toggle Móvil */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* 3. MENÚ PRINCIPAL (FONDO AZUL #2F358A)                    */}
      {/* ========================================================= */}
      <nav className="bg-[#2F358A] text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:flex items-center justify-between">
            <ul className="flex items-center space-x-1 text-sm font-medium">
              
              {/* INICIO */}
              <li>
                <button 
                  onClick={() => navigate('inicio')} 
                  className={`px-4 py-3.5 flex items-center gap-1.5 transition-all font-semibold cursor-pointer ${
                    currentPage === 'inicio' ? 'bg-[#23286E] border-b-2 border-[#C63E43] text-white' : 'text-slate-100 hover:bg-[#23286E]'
                  }`}
                >
                  <span>Inicio</span>
                </button>
              </li>

              {/* NOSOTROS */}
              <li 
                className="relative"
                onMouseEnter={() => setActiveDropdown('nosotros')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1.5 px-4 py-3.5 text-slate-100 hover:bg-[#23286E] transition-all font-medium cursor-pointer">
                  <span>Nosotros</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {activeDropdown === 'nosotros' && (
                  <div className="absolute left-0 top-full w-64 bg-white text-slate-800 rounded-b-xl shadow-2xl py-2 border-t-2 border-[#C63E43] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <button onClick={() => navigate('quienes-somos')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs font-semibold">Quiénes Somos</button>
                    <button onClick={() => navigate('mision')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs">Misión y Visión</button>
                    <button onClick={() => navigate('directiva')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs">Junta Directiva</button>
                    <button onClick={() => navigate('equipo')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs">Equipo Ejecutivo</button>
                    <button onClick={() => navigate('comisiones')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs">Comisiones de Trabajo</button>
                    <button onClick={() => navigate('plan-estrategico')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs">Plan Estratégico</button>
                    <button onClick={() => navigate('asociados')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs">Asociados y Aliados (84)</button>
                    <button onClick={() => navigate('consultores')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs border-t border-slate-100 mt-1">Red de Consultores</button>
                  </div>
                )}
              </li>

              {/* NUESTRO TRABAJO */}
              <li 
                className="relative"
                onMouseEnter={() => setActiveDropdown('trabajo')}
                onMouseLeave={() => { setActiveDropdown(null); setActiveNestedDropdown(false); }}
              >
                <button className="flex items-center gap-1.5 px-4 py-3.5 text-slate-100 hover:bg-[#23286E] transition-all font-medium cursor-pointer">
                  <span>Nuestro Trabajo</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {activeDropdown === 'trabajo' && (
                  <div className="absolute left-0 top-full w-72 bg-white text-slate-800 rounded-b-xl shadow-2xl py-2 border-t-2 border-[#C63E43] z-50">
                    
                    {/* Submenú Proyectos de Cooperación */}
                    <div 
                      className="relative"
                      onMouseEnter={() => setActiveNestedDropdown(true)}
                      onMouseLeave={() => setActiveNestedDropdown(false)}
                    >
                      <button 
                        onClick={() => navigate('proyectos-cooperacion')}
                        className="w-full text-left flex items-center justify-between px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs font-semibold"
                      >
                        <span>Proyectos de Cooperación</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </button>

                      {activeNestedDropdown && (
                        <div className="absolute left-full top-0 w-64 bg-white text-slate-800 rounded-xl shadow-2xl py-2 border-l border-slate-100 animate-in fade-in slide-in-from-left-1 duration-150">
                          <button onClick={() => navigate('vacantes-aecid')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#C63E43] text-xs flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3 text-slate-400" />
                            <span>Vacantes AECID</span>
                          </button>
                          <button onClick={() => navigate('portal-compras-aecid')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#C63E43] text-xs flex items-center gap-1.5">
                            <ShoppingCart className="w-3 h-3 text-slate-400" />
                            <span>Portal de Compras AECID</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <button onClick={() => navigate('vision-2050')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs font-semibold text-[#2F358A]">Visión 2050</button>
                    <button onClick={() => navigate('educacion')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs">Educación</button>
                    <button onClick={() => navigate('agro')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs">Agro</button>
                    <button onClick={() => navigate('turismo')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs">Turismo</button>
                    <button onClick={() => navigate('gestion-territorial')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs">Gestión Territorial</button>
                    <button onClick={() => navigate('gobernabilidad')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs">Gobernabilidad</button>
                    <button onClick={() => navigate('estudios')} className="w-full text-left px-4 py-2 hover:bg-slate-50 hover:text-[#2F358A] text-xs border-t border-slate-100 mt-1">Estudios</button>
                  </div>
                )}
              </li>

              {/* RED DE CENTROS REGIONALES */}
              <li 
                className="relative"
                onMouseEnter={() => setActiveDropdown('red')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1.5 px-4 py-3.5 text-slate-100 hover:bg-[#23286E] transition-all font-medium cursor-pointer">
                  <span>Red de Centros Regionales</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {activeDropdown === 'red' && (
                  <div className="absolute left-0 top-full w-60 bg-white text-slate-800 rounded-b-xl shadow-2xl py-2 border-t-2 border-[#C63E43] z-50">
                    <button onClick={() => navigate('cecomce')} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 hover:text-[#2F358A] text-xs">
                      <span className="font-bold text-[#2F358A] block">CECOMCE</span>
                      <span className="text-[10px] text-slate-500">Colón y Región Oriental</span>
                    </button>
                    <button onClick={() => navigate('cecomcro')} className="w-full text-left px-4 py-2.5 hover:bg-slate-50 hover:text-[#2F358A] text-xs border-t border-slate-100">
                      <span className="font-bold text-[#2F358A] block">CECOMCRO</span>
                      <span className="text-[10px] text-slate-500">Región Central</span>
                    </button>
                  </div>
                )}
              </li>

              {/* RECURSOS DE INFORMACIÓN */}
              <li>
                <button 
                  onClick={() => navigate('recursos')} 
                  className={`px-4 py-3.5 transition-all cursor-pointer ${
                    currentPage === 'recursos' ? 'bg-[#23286E] text-white font-semibold' : 'text-slate-100 hover:bg-[#23286E]'
                  }`}
                >
                  Recursos de Información
                </button>
              </li>

              {/* NOTICIAS */}
              <li>
                <button 
                  onClick={() => navigate('noticias')} 
                  className={`px-4 py-3.5 transition-all cursor-pointer ${
                    currentPage === 'noticias' ? 'bg-[#23286E] text-white font-semibold' : 'text-slate-100 hover:bg-[#23286E]'
                  }`}
                >
                  Noticias
                </button>
              </li>

            </ul>

            {/* BOTÓN INVOLÚCRATE */}
            <button 
              onClick={() => navigate('contacto')} 
              className="bg-[#C63E43] hover:bg-[#A82F34] text-white text-xs font-bold uppercase tracking-wider py-2 px-4 rounded shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Involúcrate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Menú Móvil */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-[#23286E] space-y-2 text-sm font-medium">
              <button onClick={() => navigate('inicio')} className="w-full text-left px-3 py-1.5 rounded hover:bg-[#23286E]">Inicio</button>
              
              <div className="border-t border-white/10 pt-2">
                <span className="block px-3 py-1 text-xs font-bold text-[#C63E43] uppercase tracking-wider">Nosotros</span>
                <div className="pl-4 space-y-1 text-xs text-slate-200">
                  <button onClick={() => navigate('quienes-somos')} className="w-full text-left py-1 hover:text-white">• Quiénes Somos</button>
                  <button onClick={() => navigate('mision')} className="w-full text-left py-1 hover:text-white">• Misión y Visión</button>
                  <button onClick={() => navigate('directiva')} className="w-full text-left py-1 hover:text-white">• Junta Directiva</button>
                  <button onClick={() => navigate('equipo')} className="w-full text-left py-1 hover:text-white">• Equipo Ejecutivo</button>
                  <button onClick={() => navigate('comisiones')} className="w-full text-left py-1 hover:text-white">• Comisiones de Trabajo</button>
                  <button onClick={() => navigate('plan-estrategico')} className="w-full text-left py-1 hover:text-white">• Plan Estratégico</button>
                  <button onClick={() => navigate('asociados')} className="w-full text-left py-1 hover:text-white">• Asociados y Aliados (84)</button>
                  <button onClick={() => navigate('consultores')} className="w-full text-left py-1 hover:text-white">• Red de Consultores</button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-2">
                <span className="block px-3 py-1 text-xs font-bold text-[#C63E43] uppercase tracking-wider">Nuestro Trabajo</span>
                <div className="pl-4 space-y-1 text-xs text-slate-200">
                  <button onClick={() => navigate('proyectos-cooperacion')} className="w-full text-left py-1 font-semibold text-white">• Proyectos de Cooperación</button>
                  <button onClick={() => navigate('vacantes-aecid')} className="w-full text-left pl-3 py-0.5 text-slate-300 hover:text-white">- Vacantes AECID</button>
                  <button onClick={() => navigate('portal-compras-aecid')} className="w-full text-left pl-3 py-0.5 text-slate-300 hover:text-white">- Portal de Compras AECID</button>
                  <button onClick={() => navigate('vision-2050')} className="w-full text-left py-1 hover:text-white">• Visión 2050</button>
                  <button onClick={() => navigate('educacion')} className="w-full text-left py-1 hover:text-white">• Educación</button>
                  <button onClick={() => navigate('agro')} className="w-full text-left py-1 hover:text-white">• Agro</button>
                  <button onClick={() => navigate('turismo')} className="w-full text-left py-1 hover:text-white">• Turismo</button>
                  <button onClick={() => navigate('gestion-territorial')} className="w-full text-left py-1 hover:text-white">• Gestión Territorial</button>
                  <button onClick={() => navigate('gobernabilidad')} className="w-full text-left py-1 hover:text-white">• Gobernabilidad</button>
                  <button onClick={() => navigate('estudios')} className="w-full text-left py-1 hover:text-white">• Estudios</button>
                </div>
              </div>

              <div className="border-t border-white/10 pt-2">
                <span className="block px-3 py-1 text-xs font-bold text-[#C63E43] uppercase tracking-wider">Red de Centros</span>
                <div className="pl-4 space-y-1 text-xs text-slate-200">
                  <button onClick={() => navigate('cecomce')} className="w-full text-left py-1 hover:text-white">• CECOMCE</button>
                  <button onClick={() => navigate('cecomcro')} className="w-full text-left py-1 hover:text-white">• CECOMCRO</button>
                </div>
              </div>

              <button onClick={() => navigate('recursos')} className="w-full text-left px-3 py-1.5 rounded hover:bg-[#23286E]">Recursos de Información</button>
              <button onClick={() => navigate('noticias')} className="w-full text-left px-3 py-1.5 rounded hover:bg-[#23286E]">Noticias</button>
              <button onClick={() => navigate('contacto')} className="w-full text-left px-3 py-1.5 rounded bg-white/10 text-[#C63E43] font-bold">Contacto</button>
            </div>
          )}

        </div>
      </nav>

      {/* ========================================================= */}
      {/* 4. VISTAS DEL SITIO (SWITCH DE PÁGINAS INDIVIDUALES)       */}
      {/* ========================================================= */}
      <main className="flex-grow">
        {(() => {
          switch (currentPage) {
            
            // -------------------------------------------------------
            // HOME PAGE
            // -------------------------------------------------------
            case 'inicio':
              return (
                <div>
                  {/* Hero Banner Slider */}
                  <div className="relative bg-slate-900 overflow-hidden h-[480px] sm:h-[540px] flex items-center">
                    <div className="absolute inset-0 w-full h-full">
                      <img 
                        src={slides[currentSlide].image} 
                        alt="Región Occidental" 
                        className="w-full h-full object-cover object-center transition-all duration-700 brightness-50"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#23286E]/95 via-[#2F358A]/75 to-transparent"></div>
                    </div>

                    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
                      <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-4">
                          <span className="w-2 h-2 rounded-full bg-[#C63E43] animate-pulse"></span>
                          <span>{slides[currentSlide].badge}</span>
                        </div>
                        
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
                          {slides[currentSlide].title}
                        </h1>

                        <p className="text-sm sm:text-base text-slate-200 font-normal leading-relaxed mb-6 max-w-2xl">
                          {slides[currentSlide].desc}
                        </p>

                        <div className="flex flex-wrap items-center gap-3">
                          <button 
                            onClick={() => navigate('quienes-somos')}
                            className="px-5 py-3 rounded-lg bg-[#C63E43] hover:bg-[#A82F34] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                          >
                            <span>Conoce Más de CECOM-RO</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => navigate('proyectos-cooperacion')}
                            className="px-5 py-3 rounded-lg bg-white/10 hover:bg-white hover:text-[#2F358A] text-white border border-white/30 font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
                          >
                            <Briefcase className="w-4 h-4" />
                            <span>Proyectos y Convocatorias</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Controles Slider */}
                    <div className="absolute bottom-5 right-6 sm:right-12 z-20 flex items-center gap-2">
                      <button 
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div className="flex gap-1 px-2">
                        {slides.map((_, idx) => (
                          <button 
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              currentSlide === idx ? 'w-6 bg-[#C63E43]' : 'w-2 bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                      <button 
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-all cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Cifras Clave */}
                  <section className="bg-white border-b border-slate-100 relative -mt-6 z-30 max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-200 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                      <div className="border-r border-slate-100 last:border-none">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#2F358A] block">2015</span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Año de Fundación</span>
                      </div>
                      <div className="border-r border-slate-100 last:border-none">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#C63E43] block">+84</span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Asociados y Aliados</span>
                      </div>
                      <div className="border-r border-slate-100 last:border-none">
                        <span className="text-3xl sm:text-4xl font-extrabold text-[#2F358A] block">3</span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Socios Fundadores</span>
                      </div>
                      <div>
                        <span className="text-3xl sm:text-4xl font-extrabold text-slate-800 block">2050</span>
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Visión Regional</span>
                      </div>
                    </div>
                  </section>

                  {/* Sección Sobre CECOM RO */}
                  <section className="py-16 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        
                        <div className="lg:col-span-7 space-y-4">
                          <span className="text-[#C63E43] text-xs font-bold uppercase tracking-widest block">Sobre Nosotros</span>
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F358A]">
                            CECOM RO
                          </h2>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-700">
                            Centro de Competitividad de la Región Occidental de Panamá
                          </h3>
                          <p className="text-slate-600 text-sm leading-relaxed text-justify">
                            El Centro de Competitividad de la Región Occidental de Panamá (CECOM-RO) es una Fundación privada sin ánimo de lucro que nace gracias al impulso de <strong>APEDE</strong>, la <strong>Cámara de Comercio, Industrias y Agricultura de Chiriquí</strong> y la <strong>Fundación Pro‐Chiriquí</strong>, formada por un grupo de empresarios comprometidos con el desarrollo de la región, que son sus socios fundadores.
                          </p>
                          <p className="text-slate-600 text-sm leading-relaxed text-justify">
                            La creación del centro cuenta con el apoyo especial de <strong>CAF, Banco de Desarrollo de América Latina</strong>, fiel a su compromiso de impulsar y promover el desarrollo socio-económico de Chiriquí y la región occidental del país. Cuenta también con el apoyo destacado del <strong>Instituto Interamericano de Cooperación para la Agricultura</strong>, así como con la colaboración de diversas agencias de cooperación internacional e instituciones de financiación multilateral.
                          </p>
                          <div className="pt-2">
                            <button 
                              onClick={() => navigate('quienes-somos')}
                              className="text-xs font-bold text-[#C63E43] hover:text-[#2F358A] inline-flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>Conocer estructura y antecedentes completos</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#2F358A] mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-[#C63E43]" />
                            <span>Socios Fundadores</span>
                          </h4>
                          <div className="space-y-3">
                            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                              <div className="w-9 h-9 rounded bg-blue-50 text-[#2F358A] font-extrabold flex items-center justify-center text-xs">APEDE</div>
                              <div>
                                <h5 className="font-bold text-xs text-slate-900">APEDE</h5>
                                <p className="text-[10px] text-slate-500">Asociación Panameña de Ejecutivos de Empresas</p>
                              </div>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                              <div className="w-9 h-9 rounded bg-red-50 text-[#C63E43] font-extrabold flex items-center justify-center text-xs">CAMCHI</div>
                              <div>
                                <h5 className="font-bold text-xs text-slate-900">CAMCHI</h5>
                                <p className="text-[10px] text-slate-500">Cámara de Comercio, Industrias y Agricultura de Chiriquí</p>
                              </div>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                              <div className="w-9 h-9 rounded bg-emerald-50 text-emerald-700 font-extrabold flex items-center justify-center text-xs">PRO</div>
                              <div>
                                <h5 className="font-bold text-xs text-slate-900">Fundación Pro-Chiriquí</h5>
                                <p className="text-[10px] text-slate-500">Empresarios Comprometidos con la Región</p>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                            <span className="font-semibold text-[11px]">Respaldo multilateral:</span>
                            <span className="font-bold text-[#2F358A]">CAF & IICA</span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </section>

                  {/* SECCIÓN EJES ESTRATÉGICOS (TOTALMENTE VISIBLE) */}
                  <section className="py-16 bg-slate-50 border-t border-b border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      
                      <div className="text-center max-w-2xl mx-auto mb-12">
                        <span className="text-[#C63E43] text-xs font-bold uppercase tracking-widest block mb-1">Ejes Estratégicos</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F358A]">
                          Líneas de Acción Institucional
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm mt-2">
                          Proyectos y programas formulados para elevar la productividad, la sostenibilidad y el bienestar en la Región Occidental.
                        </p>
                      </div>

                      {/* Grid de Ejes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        
                        {/* Eje 1: Proyectos de Cooperación */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#C63E43] flex items-center justify-center mb-4">
                              <Briefcase className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Proyectos de Cooperación</h3>
                            <p className="text-slate-600 text-xs leading-relaxed mb-4">
                              Gestión de fondos con organismos internacionales, vacantes de empleo y licitaciones del Portal de Compras AECID.
                            </p>
                          </div>
                          <div className="border-t border-slate-100 pt-3 space-y-1">
                            <button onClick={() => navigate('proyectos-cooperacion')} className="w-full flex items-center justify-between text-xs font-bold text-[#2F358A] hover:text-[#C63E43]">
                              <span>Ver Proyectos</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => navigate('vacantes-aecid')} className="block text-[11px] text-slate-500 hover:text-[#C63E43]">• Vacantes AECID</button>
                            <button onClick={() => navigate('portal-compras-aecid')} className="block text-[11px] text-slate-500 hover:text-[#C63E43]">• Portal de Compras AECID</button>
                          </div>
                        </div>

                        {/* Eje 2: Visión 2050 */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2F358A] flex items-center justify-center mb-4">
                              <Compass className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Visión Regional 2050</h3>
                            <p className="text-slate-600 text-xs leading-relaxed mb-4">
                              Hoja de ruta estratégica a largo plazo para posicionar a Chiriquí, Bocas del Toro y la Comarca como motor de desarrollo.
                            </p>
                          </div>
                          <div className="border-t border-slate-100 pt-3">
                            <button onClick={() => navigate('vision-2050')} className="w-full flex items-center justify-between text-xs font-bold text-[#2F358A] hover:text-[#C63E43]">
                              <span>Consultar Plan Maestro</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Eje 3: Agro */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                              <Sprout className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Agro & Agrotecnología</h3>
                            <p className="text-slate-600 text-xs leading-relaxed mb-4">
                              Modernización del agro con IICA, tecnificación de cadenas de frío, innovación agrotech y apertura de mercados.
                            </p>
                          </div>
                          <div className="border-t border-slate-100 pt-3">
                            <button onClick={() => navigate('agro')} className="w-full flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-[#C63E43]">
                              <span>Iniciativas Agrícolas</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Eje 4: Turismo */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                              <Coffee className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Turismo Sostenible</h3>
                            <p className="text-slate-600 text-xs leading-relaxed mb-4">
                              Desarrollo y consolidación del Circuito del Café, agroturismo, senderismo en Tierras Altas y turismo cultural.
                            </p>
                          </div>
                          <div className="border-t border-slate-100 pt-3">
                            <button onClick={() => navigate('turismo')} className="w-full flex items-center justify-between text-xs font-bold text-amber-800 hover:text-[#C63E43]">
                              <span>Circuito del Café</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Eje 5: Educación */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                              <GraduationCap className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Educación y Talento</h3>
                            <p className="text-slate-600 text-xs leading-relaxed mb-4">
                              Convenio y sinergias con ITSE Panamá, universidades regionales y formación técnica en competencias productivas.
                            </p>
                          </div>
                          <div className="border-t border-slate-100 pt-3">
                            <button onClick={() => navigate('educacion')} className="w-full flex items-center justify-between text-xs font-bold text-purple-800 hover:text-[#C63E43]">
                              <span>Programas de Educación</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Eje 6: Gestión Territorial */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                          <div>
                            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
                              <Layers className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-lg text-slate-900 mb-2">Gestión Territorial & Estudios</h3>
                            <p className="text-slate-600 text-xs leading-relaxed mb-4">
                              Infraestructura logística, proyectos de puertos multimodales, monitoreo urbano y publicaciones estadísticas.
                            </p>
                          </div>
                          <div className="border-t border-slate-100 pt-3">
                            <button onClick={() => navigate('gestion-territorial')} className="w-full flex items-center justify-between text-xs font-bold text-sky-800 hover:text-[#C63E43]">
                              <span>Territorio e Infraestructura</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  </section>

                  {/* Red de Centros Regionales */}
                  <section className="py-14 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="text-center max-w-xl mx-auto mb-8">
                        <span className="text-[#C63E43] text-xs font-bold uppercase tracking-widest block">Articulación Nacional</span>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-[#2F358A] mt-1">
                          Red de Centros Regionales
                        </h2>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div 
                          onClick={() => navigate('cecomce')} 
                          className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#2F358A] transition-all shadow-sm cursor-pointer"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-10 rounded-lg bg-[#2F358A] text-white font-bold flex items-center justify-center text-sm">CCE</span>
                            <div>
                              <h3 className="font-bold text-base text-slate-900">CECOMCE</h3>
                              <p className="text-[11px] text-slate-500">Colón y Región Oriental</p>
                            </div>
                          </div>
                          <p className="text-slate-600 text-xs">Impulso a la logística portuaria, zona franca y desarrollo productivo caribeño.</p>
                        </div>

                        <div 
                          onClick={() => navigate('cecomcro')} 
                          className="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#C63E43] transition-all shadow-sm cursor-pointer"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-10 rounded-lg bg-[#C63E43] text-white font-bold flex items-center justify-center text-sm">CCR</span>
                            <div>
                              <h3 className="font-bold text-slate-900 text-base">CECOMCRO</h3>
                              <p className="text-[11px] text-slate-500">Región Central</p>
                            </div>
                          </div>
                          <p className="text-slate-600 text-xs">Fomento agroindustrial y comercial para Coclé, Herrera, Los Santos y Veraguas.</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              );

            // -------------------------------------------------------
            // SUBPÁGINAS: NOSOTROS
            // -------------------------------------------------------
            case 'quienes-somos':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Quiénes Somos</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2F358A] mb-6">Quiénes Somos</h1>
                  <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed text-justify">
                    <p className="p-5 bg-slate-50 rounded-2xl border-l-4 border-[#C63E43]">
                      La <strong>Fundación Centro de Competitividad de la Región Occidental de Panamá (CECOM-RO)</strong> es una Fundación de Interés Privado sin fines de lucro fundada en el año 2015, que tiene como misión impulsar la posición competitiva de la Región Occidental del país, acercando a las empresas las herramientas que les permitan desarrollar ventajas competitivas sostenibles y promoviendo la atracción de inversiones, el emprendimiento, las infraestructuras necesarias y la inclusión social y cultural, articulando los esfuerzos públicos y privados, y contribuyendo a su efectividad.
                    </p>
                    <p>
                      Surge gracias al impulso de la Asociación Panameña de Ejecutivos de Empresas (APEDE), la Cámara de Comercio, Industrias y Agricultura de Chiriquí (CAMCHI) y la Fundación Pro-Chiriquí, -formada por un grupo de empresarios comprometidos con el desarrollo de la región; de iniciativas y participación de los agentes implicados en el desarrollo económico y social de la región y, en consecuencia, promueve la incorporación de empresarios, gremios, instituciones académicas y técnicas, gobiernos locales y dependencias públicas en el desarrollo, impulso y ejecución de programas, proyectos, actividades que estimulen la competitividad de la región occidental, al igual de redes de participación ciudadana para el desarrollo, implementación y seguimiento de políticas públicas alineadas con el cumplimiento de los objetivos de desarrollo sostenible de nuestra región y el país.
                    </p>
                    <p>
                      Actualmente cuenta con <strong>84 asociados</strong> por medio de convenios marco de colaboración firmados y refrendados en el caso de las instituciones gubernamentales, así como con la colaboración de diversos aliados del sector público y privado, agencias de cooperación internacional e instituciones de financiación multilateral.
                    </p>
                  </div>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <h4 className="font-bold text-[#2F358A] text-sm mb-1">Fundada en 2015</h4>
                      <p className="text-xs text-slate-500">Pioneros en articulación público-privada.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <h4 className="font-bold text-[#C63E43] text-sm mb-1">84 Asociados</h4>
                      <p className="text-xs text-slate-500">Convenios marco vigentes y refrendados.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <h4 className="font-bold text-slate-800 text-sm mb-1">Apoyo Multilateral</h4>
                      <p className="text-xs text-slate-500">Alianza con CAF, IICA, AECID.</p>
                    </div>
                  </div>
                </div>
              );

            case 'mision':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Misión y Visión</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-8">Misión y Visión Institucional</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#2F358A] text-white flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 mb-3">Nuestra Misión</h2>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Impulsar la posición competitiva de la Región Occidental de Panamá, acercando a las empresas las herramientas que les permitan desarrollar ventajas competitivas sostenibles y promoviendo la atracción de inversiones, el emprendimiento, las infraestructuras necesarias y la inclusión social y cultural.
                      </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-[#C63E43] text-white flex items-center justify-center mb-4">
                        <Compass className="w-6 h-6" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 mb-3">Nuestra Visión</h2>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Ser reconocidos como el principal modelo de articulación territorial del país para el año 2050, logrando una Región Occidental próspera, tecnificada, inclusiva y con alta capacidad de exportación e innovación turística y agroindustrial.
                      </p>
                    </div>
                  </div>
                </div>
              );

            case 'directiva':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Junta Directiva</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-2">Junta Directiva</h1>
                  <p className="text-slate-600 text-sm mb-8">Órgano de gobernanza conformado por líderes empresariales y fundadores.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#2F358A] text-white mx-auto mb-3 flex items-center justify-center font-bold text-xl">FR</div>
                      <h3 className="font-bold text-slate-900 text-sm">Felipe Ariel Rodríguez</h3>
                      <p className="text-xs text-[#C63E43] font-semibold">Presidente</p>
                      <p className="text-[11px] text-slate-400 mt-1">Líder Fundador y Empresario Regional</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#C63E43] text-white mx-auto mb-3 flex items-center justify-center font-bold text-xl">CAM</div>
                      <h3 className="font-bold text-slate-900 text-sm">Representación CAMCHI</h3>
                      <p className="text-xs text-[#2F358A] font-semibold">Vicepresidencia</p>
                      <p className="text-[11px] text-slate-400 mt-1">Cámara de Comercio de Chiriquí</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                      <div className="w-16 h-16 rounded-full bg-slate-700 text-white mx-auto mb-3 flex items-center justify-center font-bold text-xl">APE</div>
                      <h3 className="font-bold text-slate-900 text-sm">Representación APEDE</h3>
                      <p className="text-xs text-[#2F358A] font-semibold">Secretaría</p>
                      <p className="text-[11px] text-slate-400 mt-1">APEDE Capítulo Chiriquí</p>
                    </div>
                  </div>
                </div>
              );

            case 'equipo':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Equipo Ejecutivo</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Equipo Ejecutivo</h1>
                  <p className="text-slate-600 text-sm mb-6">Estructura operativa responsable de la coordinación de planes, convocatorias y seguimiento de proyectos.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                      <h3 className="font-bold text-slate-900 text-base mb-1">Dirección Ejecutiva</h3>
                      <p className="text-xs text-[#C63E43] font-semibold mb-2">Gestión y Articulación Institucional</p>
                      <p className="text-xs text-slate-500 leading-relaxed">Supervisión estratégica de convenios con CAF, IICA, gobiernos locales y el sector empresarial.</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                      <h3 className="font-bold text-slate-900 text-base mb-1">Coordinación de Proyectos AECID</h3>
                      <p className="text-xs text-[#2F358A] font-semibold mb-2">Fondos de Cooperación y Licitaciones</p>
                      <p className="text-xs text-slate-500 leading-relaxed">Administración del portal de compras, términos de referencia y seguimiento técnico de programas.</p>
                    </div>
                  </div>
                </div>
              );

            case 'comisiones':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Comisiones de Trabajo</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Comisiones Técnicas de Trabajo</h1>
                  <p className="text-slate-600 text-sm mb-8">Grupos especializados que elaboran diagnósticos y propuestas de política pública.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                      <h3 className="font-bold text-[#2F358A] text-sm mb-1">Comisión Agroindustrial</h3>
                      <p className="text-xs text-slate-600">Tecnificación de cultivos, inocuidad de alimentos y valor agregado de exportación.</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                      <h3 className="font-bold text-[#2F358A] text-sm mb-1">Comisión de Turismo</h3>
                      <p className="text-xs text-slate-600">Posicionamiento del Circuito del Café y ecoturismo de Tierras Altas.</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                      <h3 className="font-bold text-[#2F358A] text-sm mb-1">Comisión de Logística y Puerto</h3>
                      <p className="text-xs text-slate-600">Monitoreo del Puerto Barú, pasos fronterizos de Paso Canoas y conectividad vial.</p>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
                      <h3 className="font-bold text-[#2F358A] text-sm mb-1">Comisión de Educación</h3>
                      <p className="text-xs text-slate-600">Formación técnica alineada al mercado laboral en conjunto con ITSE Panamá.</p>
                    </div>
                  </div>
                </div>
              );

            case 'plan-estrategico':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Plan Estratégico</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Plan Estratégico de Competitividad</h1>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Documento directriz que establece las metas a corto, mediano y largo plazo para asegurar la competitividad regional alineada con los Objetivos de Desarrollo Sostenible (ODS).
                  </p>
                  <div className="bg-[#2F358A] text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-base mb-1">Descargar Documento Maestro (Plan Estratégico)</h3>
                      <p className="text-xs text-slate-200">Diagnóstico integral, metas 2025-2050 y programas prioritarios.</p>
                    </div>
                    <button className="px-4 py-2.5 bg-[#C63E43] hover:bg-[#A82F34] text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer">
                      <Download className="w-4 h-4" />
                      <span>Descargar PDF</span>
                    </button>
                  </div>
                </div>
              );

            case 'asociados':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Asociados y Aliados</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-2">84 Asociados por Convenio Marco</h1>
                  <p className="text-slate-600 text-sm mb-6">Convenios marco firmados y refrendados con instituciones públicas, agencias y gremios.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {['APEDE', 'CAMCHI', 'Fundación Pro-Chiriquí', 'ITSE Panamá', 'CAF Banco de Desarrollo', 'IICA', 'AECID Cooperación Española', 'UNACHI', 'UTP Chiriquí', 'MIDA', 'AMPYME', 'Alcaldía de David', 'Alcaldía de Boquete', 'Alcaldía Tierras Altas', 'Cámara de Turismo', 'Asoc. Cafés Especiales', '+68 Asociados Oficiales'].map((item, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center font-bold text-xs text-slate-800">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'consultores':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Red de Consultores</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Red de Consultores Especializados</h1>
                  <p className="text-slate-600 text-sm mb-6">Banco de talento para estudios técnicos, consultorías de cooperación internacional y asistencia agropecuaria.</p>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-sm mb-2">Convocatoria para Registro de Consultores</h3>
                    <p className="text-xs text-slate-600 mb-4">Si posees experiencia en proyectos financiados por CAF, AECID o IICA, registra tu hoja de vida en nuestra base de datos.</p>
                    <button onClick={() => navigate('contacto')} className="px-4 py-2 bg-[#2F358A] text-white text-xs font-bold rounded cursor-pointer">
                      Postular Registro
                    </button>
                  </div>
                </div>
              );

            // -------------------------------------------------------
            // SUBPÁGINAS: NUESTRO TRABAJO
            // -------------------------------------------------------
            case 'proyectos-cooperacion':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Proyectos de Cooperación</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Proyectos de Cooperación Internacional</h1>
                  <p className="text-slate-600 text-sm mb-8">Iniciativas ejecutadas en conjunto con agencias internacionales para el desarrollo productivo y la competitividad.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                      onClick={() => navigate('vacantes-aecid')}
                      className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#C63E43] transition-all cursor-pointer shadow-sm"
                    >
                      <Briefcase className="w-8 h-8 text-[#C63E43] mb-3" />
                      <h3 className="font-bold text-slate-900 text-base mb-1">Vacantes AECID</h3>
                      <p className="text-xs text-slate-600">Oportunidades de vinculación laboral y consultorías en proyectos de la cooperación española.</p>
                    </div>
                    <div 
                      onClick={() => navigate('portal-compras-aecid')}
                      className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#2F358A] transition-all cursor-pointer shadow-sm"
                    >
                      <ShoppingCart className="w-8 h-8 text-[#2F358A] mb-3" />
                      <h3 className="font-bold text-slate-900 text-base mb-1">Portal de Compras AECID</h3>
                      <p className="text-xs text-slate-600">Pliegos de licitación, cotizaciones de suministros y contrataciones de servicios.</p>
                    </div>
                  </div>
                </div>
              );

            case 'vacantes-aecid':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('proyectos-cooperacion')} className="hover:text-[#2F358A]">Proyectos de Cooperación</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Vacantes AECID</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Vacantes de Cooperación AECID</h1>
                  <div className="space-y-4">
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900 text-base">Especialista Técnico en Agrotecnología y Cadenas de Valor</h3>
                        <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">CONVOCATORIA VIGENTE</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-4">David, Chiriquí • Consultoría individual para fortalecimiento de fincas piloto en Tierras Altas.</p>
                      <button onClick={() => navigate('contacto')} className="px-4 py-2 bg-[#C63E43] text-white text-xs font-bold rounded cursor-pointer">
                        Postular / Enviar Hoja de Vida
                      </button>
                    </div>
                  </div>
                </div>
              );

            case 'portal-compras-aecid':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('proyectos-cooperacion')} className="hover:text-[#2F358A]">Proyectos de Cooperación</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Portal de Compras AECID</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Portal de Compras y Licitaciones AECID</h1>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 text-sm mb-1">Licitación Abierta: Adquisición de Equipos Meteorológicos y Sensores</h3>
                    <p className="text-xs text-slate-600 mb-3">Proyecto de resiliencia hídrica para cuencas agropecuarias de Chiriquí.</p>
                    <span className="text-[11px] font-semibold text-[#C63E43] block mb-4">Cierre de recepción de ofertas: 30 de Octubre</span>
                    <button className="px-4 py-2 bg-[#2F358A] text-white text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer">
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Pliego de Cargos (PDF)</span>
                    </button>
                  </div>
                </div>
              );

            case 'vision-2050':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Visión 2050</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Visión Regional 2050</h1>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Estrategia de desarrollo territorial de largo aliento que proyecta a Chiriquí, Bocas del Toro y la Comarca Ngäbe-Buglé como un epicentro de agroexportación, logística multimodal y turismo de clase mundial.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-[#2F358A] text-sm mb-1">Pilar Agroexportador</h4>
                      <p className="text-xs text-slate-500">Transformación con tecnología y riego tecnificado.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-[#2F358A] text-sm mb-1">Pilar Logístico</h4>
                      <p className="text-xs text-slate-500">Puerto Barú y nodo logístico intermodal.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <h4 className="font-bold text-[#2F358A] text-sm mb-1">Pilar Turístico</h4>
                      <p className="text-xs text-slate-500">Circuito del Café y ecoturismo internacional.</p>
                    </div>
                  </div>
                </div>
              );

            case 'educacion':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Educación</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Educación y Capital Humano</h1>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    En articulación con el <strong>ITSE (Instituto Técnico Superior Especializado)</strong> y universidades de Chiriquí, impulsamos currículas pertinentes que formen el talento requerido por el sector agropecuario, turístico y logístico.
                  </p>
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <GraduationCap className="w-10 h-10 text-[#2F358A] shrink-0" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Alianza Estratégica con ITSE Panamá</h3>
                      <p className="text-xs text-slate-600">Formación técnica superior de ciclo corto con pasantías en empresas regionales.</p>
                    </div>
                  </div>
                </div>
              );

            case 'agro':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Agro</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Agroindustria y Tecnificación</h1>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Con el apoyo del Instituto Interamericano de Cooperación para la Agricultura (IICA) y el MIDA, desarrollamos programas de inocuidad, bioseguridad y adopción de tecnología de precisión para pequeños y medianos productores.
                  </p>
                </div>
              );

            case 'turismo':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Turismo</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Turismo Sostenible y Circuito del Café</h1>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    El <strong>Circuito del Café</strong> reúne las fincas productoras más prestigiosas de Boquete, Tierras Altas y Renacimiento, ofreciendo experiencias inmersivas de catación, senderismo y hospedaje boutique de clase mundial.
                  </p>
                  <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-4">
                    <Coffee className="w-10 h-10 text-amber-700 shrink-0" />
                    <div>
                      <h3 className="font-bold text-amber-900 text-sm">Destino Cafetalero de Excelencia</h3>
                      <p className="text-xs text-amber-800">Cuna del café Geisha más premiado del planeta.</p>
                    </div>
                  </div>
                </div>
              );

            case 'gestion-territorial':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Gestión Territorial</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Gestión Territorial e Infraestructuras</h1>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Acompañamiento a planes de ordenamiento territorial, modernización de aduanas en Paso Canoas, red vial regional e interconexión con el futuro Puerto Barú.
                  </p>
                </div>
              );

            case 'gobernabilidad':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Gobernabilidad</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Gobernabilidad y Participación Ciudadana</h1>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Generamos espacios de diálogo y concertación entre gremios empresariales, gobiernos locales, pueblos originarios y sociedad civil para dar seguimiento a los acuerdos de desarrollo.
                  </p>
                </div>
              );

            case 'estudios':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Estudios</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Estudios y Publicaciones Técnicas</h1>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Repositorio de diagnósticos económicos, informes de competitividad provincial y análisis de cadenas de valor elaborados por CECOM-RO.
                  </p>
                </div>
              );

            // -------------------------------------------------------
            // SUBPÁGINAS: RED DE CENTROS & OTROS
            // -------------------------------------------------------
            case 'cecomce':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Red de Centros</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">CECOMCE</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">CECOMCE — Colón y Región Oriental</h1>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Centro hermano enfocado en potenciar la posición logística, marítima y de zona libre en la provincia de Colón y el oriente panameño.
                  </p>
                </div>
              );

            case 'cecomcro':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Red de Centros</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">CECOMCRO</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">CECOMCRO — Región Central</h1>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Centro articulador de la competitividad para las provincias de Coclé, Herrera, Los Santos y Veraguas.
                  </p>
                </div>
              );

            case 'recursos':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Recursos de Información</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-4">Recursos de Información</h1>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Accede a mapas, presentaciones oficiales, convenios marco y normativas de desarrollo regional.
                  </p>
                </div>
              );

            case 'noticias':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Noticias</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-6">Noticias y Actualidad</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-bold text-white bg-[#C63E43] px-2 py-0.5 rounded">AECID</span>
                      <h3 className="font-bold text-slate-900 text-base mt-2 mb-2">Convocatorias Abiertas en el Portal de Compras</h3>
                      <p className="text-xs text-slate-500 mb-3">Pliegos disponibles para proveedores locales en rubros de innovación y riego.</p>
                      <button onClick={() => navigate('portal-compras-aecid')} className="text-xs font-bold text-[#2F358A] hover:text-[#C63E43]">
                        Leer más →
                      </button>
                    </div>
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-[10px] font-bold text-white bg-amber-700 px-2 py-0.5 rounded">Turismo</span>
                      <h3 className="font-bold text-slate-900 text-base mt-2 mb-2">Fortalecimiento del Circuito del Café en Mercados Emisores</h3>
                      <p className="text-xs text-slate-500 mb-3">Capacitaciones a guías turísticos y fincas de Boquete y Tierras Altas.</p>
                      <button onClick={() => navigate('turismo')} className="text-xs font-bold text-[#2F358A] hover:text-[#C63E43]">
                        Leer más →
                      </button>
                    </div>
                  </div>
                </div>
              );

            case 'contacto':
              return (
                <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                    <button onClick={() => navigate('inicio')} className="hover:text-[#2F358A]">Inicio</button>
                    <span>/</span>
                    <span className="text-[#C63E43] font-semibold">Contacto</span>
                  </div>
                  <h1 className="text-3xl font-extrabold text-[#2F358A] mb-6">Contacto Institucional</h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#C63E43]" />
                          <span>Ubicación</span>
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          <strong>Edificio Brencan</strong><br />
                          Calle B Norte<br />
                          David, Chiriquí, República de Panamá
                        </p>
                      </div>

                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#C63E43]" />
                          <span>Horario</span>
                        </h3>
                        <p className="text-xs text-slate-600">
                          Lunes a Viernes: 8:00 am a 5:00 pm<br />
                          Sábado: 9:00 am to 12:00 md
                        </p>
                      </div>

                      <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-2">
                          <Phone className="w-4 h-4 text-[#C63E43]" />
                          <span>Teléfono</span>
                        </h3>
                        <a href="tel:+50760791889" className="text-xs font-bold text-[#2F358A] hover:text-[#C63E43]">
                          +507 6079-1889
                        </a>
                      </div>
                    </div>

                    {/* Formulario */}
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                      <h3 className="font-bold text-[#2F358A] text-base mb-4">Envíanos un Mensaje</h3>
                      {formSubmitted ? (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs text-center">
                          <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                          <p className="font-bold">¡Mensaje enviado exitosamente!</p>
                          <p className="mt-1">Nuestro equipo ejecutivo le responderá a la brevedad posible.</p>
                          <button 
                            onClick={() => setFormSubmitted(false)} 
                            className="mt-3 text-xs text-emerald-900 font-bold underline"
                          >
                            Enviar otro mensaje
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); }} className="space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre Completo</label>
                            <input required type="text" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#2F358A]" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                            <input required type="email" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#2F358A]" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Mensaje o Solicitud</label>
                            <textarea required rows="4" className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 outline-none focus:border-[#2F358A]"></textarea>
                          </div>
                          <button type="submit" className="w-full py-2.5 bg-[#C63E43] hover:bg-[#A82F34] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer">
                            Enviar Mensaje
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              );

            default:
              return null;
          }
        })()}
      </main>

      {/* ========================================================= */}
      {/* 5. FOOTER OFICIAL CONTEXTUAL                              */}
      {/* ========================================================= */}
      <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t-4 border-[#C63E43] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#2F358A] flex items-center justify-center font-bold text-white text-xs">
                  <span className="text-[#C63E43]">C</span>R
                </div>
                <span className="text-lg font-extrabold text-white">CECOM RO</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fundación Centro de Competitividad de la Región Occidental de Panamá. Entidad de interés privado sin fines de lucro fundada en 2015.
              </p>
            </div>

            {/* Col 2: Ubicación */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C63E43]" />
                <span>Ubicación</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Edificio Brencan</strong><br />
                Calle B Norte<br />
                David, Chiriquí
              </p>
            </div>

            {/* Col 3: Horarios */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C63E43]" />
                <span>Horario</span>
              </h3>
              <ul className="text-xs space-y-1 text-slate-300">
                <li>Lunes a Viernes: 8:00 am a 5:00 pm</li>
                <li>Sábado: 9:00 am to 12:00 md</li>
              </ul>
            </div>

            {/* Col 4: Teléfonos y Redes */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#C63E43]" />
                <span>Teléfonos</span>
              </h3>
              <a href="tel:+50760791889" className="inline-block text-xs font-bold text-white hover:text-[#C63E43]">
                +507 6079-1889
              </a>
              <div className="pt-2">
                <span className="text-[11px] text-slate-400 block mb-1 font-semibold">Redes Sociales:</span>
                <div className="flex space-x-2">
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded bg-slate-800 hover:bg-[#2F358A] flex items-center justify-center text-slate-300 hover:text-white text-xs">F</a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded bg-slate-800 hover:bg-[#2F358A] flex items-center justify-center text-slate-300 hover:text-white text-xs">X</a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded bg-slate-800 hover:bg-[#C63E43] flex items-center justify-center text-slate-300 hover:text-white text-xs">Y</a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 rounded bg-slate-800 hover:bg-[#C63E43] flex items-center justify-center text-slate-300 hover:text-white text-xs">I</a>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-800 text-center sm:flex sm:justify-between text-xs text-slate-400">
            <p>© {new Date().getFullYear()}. Centro de Competitividad de la Región Occidental. CECOMRO.</p>
            <div className="flex justify-center space-x-4 mt-2 sm:mt-0 text-[11px]">
              <button onClick={() => navigate('quienes-somos')} className="hover:text-white">Quiénes Somos</button>
              <button onClick={() => navigate('contacto')} className="hover:text-white">Contacto</button>
            </div>
          </div>

        </div>
      </footer>

      {/* ========================================================= */}
      {/* 6. MODAL DE BÚSQUEDA INTERACTIVO                          */}
      {/* ========================================================= */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <form onSubmit={handleSearchSubmit} className="p-4 border-b border-slate-200 flex items-center gap-3">
              <Search className="w-5 h-5 text-[#2F358A]" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en CECOM-RO (ej. AECID, Visión 2050, Caficultura)..." 
                className="w-full text-sm outline-none text-slate-800"
                autoFocus
              />
              <button 
                type="button" 
                onClick={() => setSearchModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="p-4 bg-slate-50 text-xs text-slate-600">
              <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Accesos rápidos:</span>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => navigate('vacantes-aecid')} className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:border-[#C63E43]">Vacantes AECID</button>
                <button onClick={() => navigate('portal-compras-aecid')} className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:border-[#C63E43]">Portal de Compras</button>
                <button onClick={() => navigate('turismo')} className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:border-[#C63E43]">Circuito del Café</button>
                <button onClick={() => navigate('asociados')} className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:border-[#C63E43]">84 Asociados</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}