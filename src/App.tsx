import { useState } from 'react'
import { HomeScreen } from './screens/HomeScreen'
import { GameScreen } from './screens/GameScreen'
import type { GameSettings } from './types'

type Screen = { name: 'home' } | { name: 'game'; settings: GameSettings }

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  if (screen.name === 'game') {
    return <GameScreen settings={screen.settings} onExit={() => setScreen({ name: 'home' })} />
  }

  return <HomeScreen onStart={(settings) => setScreen({ name: 'game', settings })} />
}

export default App
