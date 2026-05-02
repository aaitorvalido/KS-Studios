"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation'; 
import { supabase } from '../lib/supabase';
import HeroAnimado from './HeroAnimado';
import ThemeToggle from './ThemeToggle';

export default function Home() {
  const [productos, setProductos] = useState<any[] | null>([]);
  const [isDark, setIsDark] = useState(false);
  const [filtroActual, setFiltroActual] = useState('Tazas');
  // NUEVO: Estado para el producto seleccionado
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>(null);
  
  const productosRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const manejarAtajo = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault(); 
        router.push('/admin');
      }
    };
    window.addEventListener('keydown', manejarAtajo);
    return () => window.removeEventListener('keydown', manejarAtajo);
  }, [router]);

  useEffect(() => {
    const getProductos = async () => {
      const { data } = await supabase.from('productos').select('*');
      setProductos(data);
    };
    getProductos();
  }, []);

  const manejarClickCategoria = (id: string) => {
    setFiltroActual(id);
    setTimeout(() => {
      productosRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const categorias = [
    { id: 'Tazas', label: 'Tazas', img: '/t.png' },
    { id: 'Bolsos', label: 'Bolsos', img: '/b.png' },
    { id: 'Gorras', label: 'Gorras', img: '/g.png' },
    { id: 'Otros', label: 'Otros', img: '/o.png' },
  ];

  const productosFiltrados = productos?.filter(p => {
    const catBaseDatos = p.categoria; 
    if (filtroActual === 'Otros') return !['Tazas', 'Bolsos', 'Gorras'].includes(catBaseDatos);
    return catBaseDatos === filtroActual;
  }) || [];

  return (
    <main className={`relative w-full overflow-x-hidden transition-colors duration-700 ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
      
      {/* 1. FONDO FIJO */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full flex items-center justify-center overflow-hidden p-4 md:p-0">
          <HeroAnimado />
        </div>
      </div>

      {/* 2. CONTENEDOR DE SCROLL REAL */}
      <div className="relative z-10 w-full">
        <div className="h-[90vh] md:h-[300vh] w-full pointer-events-none"></div>

        {/* 3. PANEL DE CONTENIDO */}
        <div className={`relative w-full transition-colors duration-1000 rounded-t-[3rem] md:rounded-t-[5rem] shadow-[0_-50px_100px_rgba(0,0,0,0.15)] ${
          isDark ? 'bg-zinc-900' : 'bg-white'
        }`}>
          
          <div className="max-w-5xl mx-auto px-6 pt-12 pb-32 md:py-24">
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
              <div className="text-center md:text-left">
                <h2 className={`text-4xl md:text-7xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  Colecciones
                </h2>
                <div className={`h-1.5 w-16 mt-2 mx-auto md:mx-0 ${isDark ? 'bg-white' : 'bg-zinc-900'}`}></div>
              </div>
              <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
            </div>

            {/* Categorías */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => manejarClickCategoria(cat.id)}
                  className={`group relative overflow-hidden border-4 transition-all duration-700
                    h-48 md:h-auto md:aspect-video rounded-[2.5rem] md:rounded-[3.5rem]
                    ${filtroActual === cat.id 
                      ? (isDark ? 'border-white scale-[1.02]' : 'border-zinc-900 scale-[1.02]')
                      : (isDark ? 'border-zinc-800' : 'border-zinc-100 shadow-sm')
                  }`}
                >
                  <img src={cat.img} alt={cat.label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-all duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center transition-all duration-500 group-hover:opacity-0 group-hover:scale-90">
                    <h3 className="text-white text-3xl md:text-4xl font-black uppercase tracking-tighter shadow-black drop-shadow-lg">
                      {cat.label}
                    </h3>
                  </div>
                </button>
              ))}
            </div>

            {/* Multimedia */}
            <div ref={productosRef} className="mt-20 md:mt-32 mb-10">
                <h3 className={`text-3xl md:text-5xl font-black uppercase tracking-widest italic ${isDark ? 'text-zinc-500' : 'text-zinc-300'}`}>
                  Multimedia
                </h3>
                <div className={`h-1 w-20 mt-2 ${isDark ? 'bg-zinc-700' : 'bg-zinc-200'}`}></div>
            </div>

            {/* Listado de Fotos (Productos) con CLICK */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 pb-10">
              {productosFiltrados.map((producto) => (
                <div 
                  key={producto.id} 
                  onClick={() => setProductoSeleccionado(producto)} // ABRIR MODAL
                  className={`group relative overflow-hidden border-2 md:border-4 transition-all duration-500 cursor-pointer
                    h-[350px] md:h-auto md:aspect-video rounded-[2.5rem] md:rounded-[3.5rem]
                    ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'
                  }`}
                >
                  <img src={producto.imagen_url} className="absolute inset-0 w-full h-full object-cover" alt={producto.nombre} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h4 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {producto.nombre}
                    </h4>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity delay-75">
                      Ver detalles
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* About Section */}
            <section className="mt-24 md:mt-40 border-t border-zinc-200 pt-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                  <h2 className={`text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    <br className="hidden md:block"/>KS Studios
                  </h2>
                  <p className={`text-base md:text-xl font-medium leading-relaxed max-w-xl mx-auto md:mx-0 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    Especialistas en transformar tus ideas en piezas únicas. En KS Studios combinamos técnicas tradicionales con diseños modernos para marcar la diferencia.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-zinc-50 border-zinc-100'}`}>
                    <h3 className={`text-xl md:text-2xl font-black uppercase mb-1 flex items-center gap-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                      <span>📍</span> Ubicación
                    </h3>
                    <p className={`text-sm md:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Las Palmas de Gran Canaria, España</p>
                  </div>
                  
                  <a href="https://wa.me/34614258904" target="_blank" rel="noopener noreferrer" 
                     className={`p-8 rounded-[2.5rem] border transition-all hover:scale-[1.02] flex flex-col group ${
                       isDark ? 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800' : 'bg-zinc-50 border-zinc-100 shadow-lg'
                     }`}>
                    <h3 className={`text-xl md:text-2xl font-black uppercase mb-1 flex items-center gap-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                      <svg viewBox="0 0 24 24" className={`w-6 h-6 fill-current ${isDark ? 'text-green-500' : 'text-green-600'}`} xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.938 3.659 1.435 5.624 1.435h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </h3>
                    <p className={`text-sm md:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>WhatsApp Directo.</p>
                  </a>
                </div>
              </div>
            </section>

            <footer className="mt-32 text-center">
              <p className={`text-[10px] md:text-xs font-black uppercase tracking-[0.3em] ${isDark ? 'text-zinc-600' : 'text-zinc-300'}`}>
                © 2026 KS Studios.
              </p>
            </footer>

          </div>
        </div>
      </div>

      {/* MODAL DE DETALLE (Solo aparece si hay un producto seleccionado) */}
      {productoSeleccionado && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all animate-in fade-in duration-300"
          onClick={() => setProductoSeleccionado(null)} // Cerrar al hacer clic fuera
        >
          <div 
            className={`relative max-w-2xl w-full rounded-[3rem] overflow-hidden shadow-2xl border ${
              isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-100'
            }`}
            onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer clic dentro
          >
            {/* Botón Cerrar */}
            <button 
              onClick={() => setProductoSeleccionado(null)}
              className="absolute top-6 right-6 z-10 bg-black/20 hover:bg-black/40 backdrop-blur-sm text-white p-2 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Imagen en el Modal */}
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto">
                <img src={productoSeleccionado.imagen_url} className="w-full h-full object-cover" />
              </div>

              {/* Texto en el Modal */}
              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                <span className="text-pink-500 font-black uppercase text-[10px] tracking-widest mb-2 block">
                  {productoSeleccionado.categoria}
                </span>
                <h3 className={`text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none mb-6 ${
                  isDark ? 'text-white' : 'text-zinc-900'
                }`}>
                  {productoSeleccionado.nombre}
                </h3>
                <p className={`text-base md:text-lg font-medium leading-relaxed mb-8 ${
                  isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  {productoSeleccionado.descripcion || "Diseño exclusivo de KS Studios con los mejores acabados."}
                </p>

                {/* Botón WhatsApp */}
                <a 
                  href={`https://wa.me/34614258904?text=Hola! Me interesa este producto: ${productoSeleccionado.nombre}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-black uppercase py-4 px-6 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-green-500/20"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.938 3.659 1.435 5.624 1.435h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Preguntar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}