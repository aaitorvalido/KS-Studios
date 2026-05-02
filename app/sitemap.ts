import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://ks-studios.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://ks-studios.vercel.app/admin',
      lastModified: new Date(),
      changeFrequency: 'never',
      priority: 0.1,
    },
  ]
}