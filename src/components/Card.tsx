import type { DeckCard } from '../hooks/useMemoryGame'
import './Card.css'

interface CardProps {
  card: DeckCard
  disabled: boolean
  onFlip: (cardId: string) => void
}

export function Card({ card, disabled, onFlip }: CardProps) {
  const isFaceUp = card.isFlipped || card.isMatched

  return (
    <button
      type="button"
      className={`card ${card.isMatched ? 'card-matched' : ''}`}
      onClick={() => onFlip(card.cardId)}
      disabled={disabled || card.isMatched || card.isFlipped}
      aria-label={isFaceUp ? card.label : 'Hidden card'}
    >
      <div className={`card-inner ${isFaceUp ? 'card-flipped' : ''}`}>
        <div className="card-face card-back">
          <span className="card-back-star">★</span>
        </div>
        <div className="card-face card-front">
          <img src={card.src} alt={card.label} draggable={false} />
        </div>
      </div>
    </button>
  )
}
