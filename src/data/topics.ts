import type { CardImage, Topic } from '../types'

const animalModules = import.meta.glob('../assets/images/animals/*.{jpg,jpeg,png}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const clothingModules = import.meta.glob('../assets/images/clothing/*.{jpg,jpeg,png}', {
  eager: true,
  import: 'default',
}) as Record<string, string>

function labelFromPath(path: string): string {
  const filename = path.split('/').pop() ?? path
  const name = filename.replace(/\.[^.]+$/, '')
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function toImages(modules: Record<string, string>): CardImage[] {
  return Object.entries(modules)
    .map(([path, src]) => ({
      id: labelFromPath(path).toLowerCase().replace(/\s+/g, '-'),
      label: labelFromPath(path),
      src,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

const animalImages = toImages(animalModules)
const clothingImages = toImages(clothingModules)

const allTopics: Topic[] = [
  {
    id: 'animals',
    label: 'Animals',
    thumbnail: animalImages[0]?.src ?? '',
    images: animalImages,
  },
  {
    id: 'clothing',
    label: 'Clothing',
    thumbnail: clothingImages[0]?.src ?? '',
    images: clothingImages,
  },
]

// Only expose topics that actually have images bundled in src/assets/images/<topic>/.
export const topics: Topic[] = allTopics.filter((topic) => topic.images.length > 0)

export const CARD_COUNT_OPTIONS = [6, 8, 10, 12] as const
