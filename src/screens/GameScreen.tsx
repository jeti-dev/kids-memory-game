import { topics } from '../data/topics'
import type { GameSettings } from '../types'
import { useMemoryGame } from '../hooks/useMemoryGame'
import { Card } from '../components/Card'
import './GameScreen.css'

interface GameScreenProps {
  settings: GameSettings
  onExit: () => void
}

export function GameScreen({ settings, onExit }: GameScreenProps) {
  const topic = topics.find((t) => t.id === settings.topicId) ?? topics[0]
  const { deck, status, flipCard, restart } = useMemoryGame(topic, settings.cardCount)

  return (
    <div className="game">
      <header className="game-header">
        <button type="button" className="header-button" onClick={onExit}>
          ← New Settings
        </button>
        <h1 className="game-title">{topic.label}</h1>
      </header>

      <div className="card-grid">
        {deck.map((card) => (
          <Card key={card.cardId} card={card} disabled={status === 'won'} onFlip={flipCard} />
        ))}
      </div>

      {status === 'won' && (
        <div className="win-overlay">
          <div className="win-card">
            <p className="win-emoji">🎉</p>
            <h2 className="win-title">You did it!</h2>
            <div className="win-actions">
              <button type="button" className="win-button" onClick={restart}>
                Play Again
              </button>
              <button type="button" className="win-button win-button-secondary" onClick={onExit}>
                New Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
