import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// CONFIGURACIÓN SEO PARA GOOGLE
export const metadata: Metadata = {
  title: "KS Studios | Serigrafía y Diseños Únicos en Las Palmas",
  description: "Especialistas en personalizar tus ideas: tazas, bolsos, gorras y mucho más. Calidad artesanal desde Las Palmas de Gran Canaria para el mundo.",
  keywords: ["serigrafía Las Palmas", "regalos personalizados", "tazas personalizadas", "diseño textil", "KS Studios"],
  authors: [{ name: "KS Studios" }],
  
  // Cómo se verá cuando compartas el link por WhatsApp o redes
  openGraph: {
    title: "KS Studios | Serigrafía Personalizada",
    description: "Transformamos tus ideas en piezas únicas. ¡Echa un vistazo a nuestras colecciones!",
    url: "https://ks-studios.vercel.app",
    siteName: "KS Studios",
    images: [
      {
        url: "/og-image.jpg", // Si tienes una imagen de portada, ponla en la carpeta public con este nombre
        width: 1200,
        height: 630,
        alt: "KS Studios - Serigrafía y Diseño",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  
  // Iconos de la pestaña
  icons: {
    icon: "/favicon.ico", // El icono pequeño de la pestaña
    apple: "/apple-touch-icon.png", // Para cuando alguien lo guarda en un iPhone
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es" // ¡Cambiado a español para que Google sepa el idioma!
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children} bodies</body>
    </html>
  );
}