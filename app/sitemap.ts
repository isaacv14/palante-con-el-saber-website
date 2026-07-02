import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://palanteconelsaber.site',
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: 'https://palanteconelsaber.site/problema',
      lastModified: new Date(),
      priority: 0.8,
    },
    {
      url: 'https://palanteconelsaber.site/equipo',
      lastModified: new Date(),
      priority: 0.8,
    },
  ]
}
