"use server";

import { createClient } from '@supabase/supabase-js';
import { verificarAuth } from './auth';

// Inicializamos Supabase con la LLAVE MAESTRA (service_role)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function subirProducto(formData: FormData) {
  try {
    // 1. Comprobamos la seguridad VIP
    const auth = await verificarAuth();
    if (!auth) throw new Error("No autorizado");

    const nombre = formData.get("nombre") as string;
    const categoria = formData.get("categoria") as string;
    const descripcion = formData.get("descripcion") as string;
    const imagen = formData.get("imagen") as File | null;

    let imagen_url = "";

    // 2. Subimos la imagen a Storage
    if (imagen && imagen.size > 0) {
      const fileName = `${Date.now()}.jpg`;
      
      // ¡AQUÍ ESTABA EL TRUCO! 
      // En el servidor, Supabase necesita la imagen en formato "Buffer", no como "File" normal.
      const arrayBuffer = await imagen.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const { error: uploadError } = await supabaseAdmin.storage
        .from("imagenes_productos")
        .upload(fileName, buffer, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        console.error("❌ Error subiendo foto a Supabase:", uploadError);
        throw new Error("Error subiendo imagen");
      }

      const { data: pUrl } = supabaseAdmin.storage
        .from("imagenes_productos")
        .getPublicUrl(fileName);

      imagen_url = pUrl.publicUrl;
    }

    // 3. Guardamos los datos en la tabla saltándonos el candado
    const { error: dbError } = await supabaseAdmin
      .from("productos")
      .insert([{ nombre, categoria, descripcion, imagen_url }]);

    if (dbError) {
      console.error("❌ Error guardando datos en la tabla:", dbError);
      throw new Error("Error guardando producto");
    }

    console.log("✅ Producto subido con éxito:", nombre);
    return true;

  } catch (error) {
    console.error("❌ Error general en subirProducto:", error);
    throw error;
  }
}

export async function borrarProductoAction(id: string, imagenUrl: string) {
  try {
    const auth = await verificarAuth();
    if (!auth) throw new Error("No autorizado");

    // Borramos de la tabla
    const { error } = await supabaseAdmin.from("productos").delete().eq("id", id);
    if (error) {
      console.error("❌ Error borrando de la base de datos:", error);
      throw new Error("Error borrando producto");
    }

    // Borramos la imagen
    if (imagenUrl) {
      const fileName = imagenUrl.split("/").pop();
      if (fileName) {
        const { error: imgError } = await supabaseAdmin.storage.from("imagenes_productos").remove([fileName]);
        if (imgError) console.error("⚠️ Aviso: No se pudo borrar la imagen de Storage", imgError);
      }
    }
    
    console.log("✅ Producto borrado con éxito:", id);
    return true;
  } catch (error) {
    console.error("❌ Error en borrarProductoAction:", error);
    throw error;
  }
}