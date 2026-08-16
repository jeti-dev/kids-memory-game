import { useState } from 'react'
import { topics, CARD_COUNT_OPTIONS } from '../data/topics'
import type { GameSettings } from '../types'
import './HomeScreen.css'

interface HomeScreenProps {
  onStart: (settings: GameSettings) => void
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  const [topicId, setTopicId] = useState(topics[0].id)
  const [cardCount, setCardCount] = useState<number>(CARD_COUNT_OPTIONS[0])

  return (
    <div className="home">
      <h1 className="home-title">Memory Game</h1>

      <section className="home-section">
        <h2 className="home-section-title">Pick a topic</h2>
        <div className="topic-grid">
          {topics.map((topic) => (
            <button
              type="button"
              key={topic.id}
              className={`topic-tile ${topic.id === topicId ? 'topic-tile-selected' : ''}`}
              onClick={() => setTopicId(topic.id)}
            >
              <img src={topic.thumbnail} alt="" className="topic-tile-image" />
              <span className="topic-tile-label">{topic.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2 className="home-section-title">How many cards?</h2>
        <div className="count-grid">
          {CARD_COUNT_OPTIONS.map((count) => (
            <button
              type="button"
              key={count}
              className={`count-tile ${count === cardCount ? 'count-tile-selected' : ''}`}
              onClick={() => setCardCount(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </section>

      <button type="button" className="start-button" onClick={() => onStart({ topicId, cardCount })}>
        Start
      </button>
    </div>
  )
}
