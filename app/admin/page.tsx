"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import ReactCrop, { centerCrop, makeAspectCrop, Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { verificarAuth, login, logout } from '../actions/auth';
import { subirProducto, borrarProductoAction } from '../actions/productos';

export default function AdminPage() {
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [productos, setProductos] = useState<any[]>([]);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [verificando, setVerificando] = useState(true);

  useEffect(() => {
    verificarAuth().then((auth) => {
      if (auth) {
        setIsAuthorized(true);
        fetchProductos();
      }
      setVerificando(false);
    });
  }, []);

  const manejarLogin = async () => {
    if (!password) return;
    const exito = await login(password);
    if (exito) {
      setIsAuthorized(true);
      setPassword("");
      fetchProductos();
    } else {
      alert("Clave incorrecta. Inténtalo de nuevo.");
    }
  };

  const cerrarSesion = async () => {
    await logout();
    setIsAuthorized(false);
    setProductos([]); 
  };

  // Esta función solo LEE, así que sigue funcionando igual
  async function fetchProductos() {
    const { data } = await supabase.from("productos").select("*").order("created_at", { ascending: false });
    if (data) setProductos(data);
  }

  // Ahora llama al Servidor en lugar de a Supabase directamente
  async function eliminarProducto(id: string, imagenUrl: string) {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await borrarProductoAction(id, imagenUrl); // ¡MAGIA SEGURA AQUÍ!
      fetchProductos();
      setMensaje("Eliminado");
    } catch (error: any) {
      setMensaje("Error");
    }
  }

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(makeAspectCrop({ unit: '%', width: 90 }, 16 / 9, width, height), width, height);
    setCrop(initialCrop);
  }

  async function getCroppedImg(image: HTMLImageElement, pixelCrop: PixelCrop): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = Math.floor(pixelCrop.width * scaleX);
    canvas.height = Math.floor(pixelCrop.height * scaleY);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No ctx');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(image, pixelCrop.x * scaleX, pixelCrop.y * scaleY, pixelCrop.width * scaleX, pixelCrop.height * scaleY, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => { if (blob) resolve(blob); }, 'image/jpeg', 1.0);
    });
  }

  // Ahora empaqueta todo y se lo manda al Servidor Secreto
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    
    const formData = new FormData(e.currentTarget);

    try {
      if (imgRef.current && completedCrop) {
        const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
        // Empaquetamos la imagen en el formulario
        formData.append("imagen", croppedBlob, "imagen.jpg");
      }

      // ¡MAGIA SEGURA AQUÍ! Se lo enviamos a la función de servidor
      await subirProducto(formData); 

      setMensaje("¡Listo!");
      setImgSrc('');
      (e.target as HTMLFormElement).reset(); 
      fetchProductos();
    } catch (error: any) {
      setMensaje("Error al subir");
    } finally {
      setCargando(false);
    }
  }

  if (verificando) {
    return <div className="min-h-screen bg-pink-50 flex items-center justify-center font-black uppercase text-pink-400 tracking-widest">Verificando...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4 font-sans text-pink-900">
        <div className="bg-white p-8 rounded-[2rem] shadow-xl w-full max-w-xs text-center border-b-4 border-pink-400">
          <h1 className="text-pink-500 text-2xl font-black uppercase mb-6 tracking-tighter">Acceso</h1>
          <input 
            type="password" 
            placeholder="Clave de acceso"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && manejarLogin()}
            className="w-full p-3 rounded-xl bg-pink-50 border-2 border-transparent focus:border-pink-200 outline-none mb-4 text-center"
          />
          <button 
            onClick={manejarLogin}
            className="w-full py-3 bg-pink-500 text-white rounded-xl font-black uppercase shadow-md active:scale-95 transition-all"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-pink-50 flex flex-col items-center font-sans text-pink-900">
      <div className="w-full max-w-5xl mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic bg-gradient-to-r from-pink-600 via-rose-500 to-purple-500 bg-clip-text text-transparent">
          Hola de nuevo Karol, ¿alguna idea hoy?
        </h2>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-white p-6 rounded-[2rem] shadow-lg border-b-4 border-pink-400">
          <h1 className="text-lg font-black mb-4 text-pink-500 uppercase tracking-tighter">Subir Producto</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input type="text" name="nombre" placeholder="Nombre" required className="w-full bg-pink-50 p-3 rounded-xl outline-none text-sm" />
            <select name="categoria" className="w-full bg-pink-50 p-3 rounded-xl outline-none text-sm cursor-pointer">
              <option value="Tazas">Tazas</option>
              <option value="Bolsos">Bolsos</option>
              <option value="Gorras">Gorras</option>
              <option value="Otros">Otros</option>
            </select>
            <textarea name="descripcion" placeholder="Descripción corta" rows={2} className="w-full bg-pink-50 p-3 rounded-xl outline-none text-sm resize-none"></textarea>
            
            <div className="bg-pink-50 p-3 rounded-xl border-2 border-dashed border-pink-100">
              <input type="file" accept="image/*" onChange={onSelectFile} className="text-[10px] w-full" />
              {!!imgSrc && (
                <div className="mt-2 rounded-lg overflow-hidden shadow-sm">
                  <ReactCrop crop={crop} onChange={(c) => setCrop(c)} onComplete={(c) => setCompletedCrop(c)} aspect={16 / 9}>
                    <img ref={imgRef} src={imgSrc} onLoad={onImageLoad} alt="Crop" />
                  </ReactCrop>
                </div>
              )}
            </div>

            <button type="submit" disabled={cargando || !completedCrop} className="bg-pink-500 text-white font-black uppercase py-3 rounded-xl hover:bg-pink-600 transition-all text-sm">
              {cargando ? "..." : "Guardar"}
            </button>
          </form>
          {mensaje && <p className="text-center mt-3 text-xs font-bold text-pink-400 uppercase tracking-widest">{mensaje}</p>}
          
          <button 
            onClick={cerrarSesion}
            className="w-full mt-6 py-2 border-2 border-pink-100 text-pink-300 rounded-xl font-black uppercase text-[10px] hover:bg-pink-50 transition-all"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {productos.map((prod) => (
              <div key={prod.id} className="bg-white p-3 rounded-[1.5rem] shadow-sm border border-pink-100 flex flex-col gap-2 group">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img src={prod.imagen_url} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between px-1">
                  <div className="min-w-0">
                    <p className="text-pink-950 font-black uppercase text-xs truncate leading-none mb-1">{prod.nombre}</p>
                    <p className="text-pink-300 text-[10px] font-black uppercase">{prod.categoria}</p>
                  </div>
                  <button onClick={() => eliminarProducto(prod.id, prod.imagen_url)} className="bg-pink-50 text-pink-400 px-3 py-1.5 rounded-lg hover:bg-rose-500 hover:text-white transition-all font-black text-[10px] uppercase">
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}