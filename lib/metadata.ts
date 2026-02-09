import { Metadata } from 'next'

const BASE_URL = 'https://www.indorigaadiwala.com'

export function createMetadata(title?: string, description?: string, path?: string): Metadata {
  return {
    title: title ? `${title} | Indori Gaadiwala` : 'Indori Gaadiwala - Premium Used Vehicles at Unbeatable Prices',
    description: description || 'Find the best deals on used cars and bikes in Indore at discounted prices. Quality second-hand vehicles with great savings.',
    alternates: {
      canonical: path ? `${BASE_URL}${path}` : BASE_URL,
    },
    openGraph: {
      title: title ? `${title} | Indori Gaadiwala` : 'Indori Gaadiwala - Premium Used Vehicles at Unbeatable Prices',
      description: description || 'Find the best deals on used cars and bikes in Indore at discounted prices. Quality second-hand vehicles with great savings.',
      url: path ? `${BASE_URL}${path}` : BASE_URL,
      siteName: 'Indori Gaadiwala',
    },
  }
}
