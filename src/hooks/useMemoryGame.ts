import { useEffect, useRef, useState } from 'react'
import type { Topic } from '../types'
import { shuffle } from '../utils/shuffle'
import { playMatch, playMismatch, playWin } from '../utils/sound'

export interface DeckCard {
  cardId: string
  imageId: string
  label: string
  src: string
  isFlipped: boolean
  isMatched: boolean
}

const MATCH_DELAY_MS = 700
const MISMATCH_DELAY_MS = 2100

function buildDeck(topic: Topic, cardCount: number): DeckCard[] {
  const pairsNeeded = cardCount / 2
  const chosenImages = shuffle(topic.images).slice(0, pairsNeeded)
  const cards: DeckCard[] = chosenImages.flatMap((image) => [
    {
      cardId: `${image.id}-a`,
      imageId: image.id,
      label: image.label,
      src: image.src,
      isFlipped: false,
      isMatched: false,
    },
    {
      cardId: `${image.id}-b`,
      imageId: image.id,
      label: image.label,
      src: image.src,
      isFlipped: false,
      isMatched: false,
    },
  ])
  return shuffle(cards)
}

export function useMemoryGame(topic: Topic, cardCount: number) {
  const [deck, setDeck] = useState<DeckCard[]>(() => buildDeck(topic, cardCount))
  const [locked, setLocked] = useState(false)
  const flippedIdsRef = useRef<string[]>([])
  const timeoutRef = useRef<number | null>(null)

  const matchedCount = deck.filter((card) => card.isMatched).length
  const status: 'playing' | 'won' = matchedCount === deck.length ? 'won' : 'playing'

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function restart() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    flippedIdsRef.current = []
    setLocked(false)
    setDeck(buildDeck(topic, cardCount))
  }

  function flipCard(cardId: string) {
    if (locked) return
    const card = deck.find((c) => c.cardId === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    const nextFlippedIds = [...flippedIdsRef.current, cardId]
    flippedIdsRef.current = nextFlippedIds
    setDeck((prev) => prev.map((c) => (c.cardId === cardId ? { ...c, isFlipped: true } : c)))

    if (nextFlippedIds.length < 2) return

    setLocked(true)
    const [firstId, secondId] = nextFlippedIds
    const first = deck.find((c) => c.cardId === firstId)
    const isMatch = first?.imageId === card.imageId

    timeoutRef.current = window.setTimeout(() => {
      if (isMatch) {
        playMatch()
        setDeck((prev) =>
          prev.map((c) => (c.cardId === firstId || c.cardId === secondId ? { ...c, isMatched: true } : c)),
        )
      } else {
        playMismatch()
        setDeck((prev) =>
          prev.map((c) => (c.cardId === firstId || c.cardId === secondId ? { ...c, isFlipped: false } : c)),
        )
      }
      flippedIdsRef.current = []
      setLocked(false)
      timeoutRef.current = null
    }, isMatch ? MATCH_DELAY_MS : MISMATCH_DELAY_MS)
  }

  const wonRef = useRef(false)
  useEffect(() => {
    if (status === 'won' && !wonRef.current) {
      wonRef.current = true
      playWin()
    }
    if (status === 'playing') {
      wonRef.current = false
    }
  }, [status])

  return { deck, status, flipCard, restart }
}
