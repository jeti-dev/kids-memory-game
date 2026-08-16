export interface CardImage {
  id: string
  label: string
  src: string
}

export interface Topic {
  id: string
  label: string
  thumbnail: string
  images: CardImage[]
}

export interface GameSettings {
  topicId: string
  cardCount: number
}
