import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Settlr',
    short_name: 'Settlr',
    description: 'Settlr for managing personal finance',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        purpose: "maskable",
        sizes: "48x48",
        src: "/images/logo/maskable_icon_x48.png",
        type: "image/png"
      },
      {
        purpose: "maskable",
        sizes: "72x72",
        src: "/images/logo/maskable_icon_x72.png",
        type: "image/png"
      },
      {
        purpose: "maskable",
        sizes: "96x96",
        src: "/images/logo/maskable_icon_x96.png",
        type: "image/png"
      },
      {
        purpose: "maskable",
        sizes: "128x128",
        src: "/images/logo/maskable_icon_x128.png",
        type: "image/png"
      },
      {
        src: '/images/logo/maskable_icon_x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        purpose: "maskable",
        sizes: "384x384",
        src: "/images/logo/maskable_icon_x384.png",
        type: "image/png"
      },
      {
        src: '/images/logo/maskable_icon_x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        purpose: "maskable",
        sizes: "1024x1024",
        src: "/images/logo/maskable_icon.png",
        type: "image/png"
      }
    ],
  }
}
