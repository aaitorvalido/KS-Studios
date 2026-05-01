"use server";

import { cookies } from 'next/headers';

// Comprueba si existe la cookie secreta
export async function verificarAuth() {
  const cookieStore = await cookies(); // <-- AÑADIDO EL AWAIT AQUÍ
  return cookieStore.get('admin_session')?.value === 'autorizado';
}

// Valida la contraseña y crea la cookie impenetrable
export async function login(password: string) {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies(); // <-- AÑADIDO EL AWAIT AQUÍ
    cookieStore.set('admin_session', 'autorizado', {
      httpOnly: true, // Bloquea el acceso desde JavaScript (F12)
      secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // La sesión dura 7 días
    });
    return true;
  }
  return false;
}

// Borra la cookie para cerrar sesión
export async function logout() {
  const cookieStore = await cookies(); // <-- AÑADIDO EL AWAIT AQUÍ
  cookieStore.delete('admin_session');
}