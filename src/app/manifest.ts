import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FridgeSplit',
    short_name: 'FridgeSplit',
    description: 'Gérez votre frigo en colocation',
    start_url: '/',
    display: 'standalone', // C'est ça qui enlève la barre du navigateur
    background_color: '#ffffff',
    theme_color: '#10b981', // Couleur Emerald-500
    icons: [
      {
        src: '/icon.png', // On va ajouter cette image juste après
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}