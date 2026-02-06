import React, { useState } from 'react';
import { useAppState } from './state';
import { LoginScreen } from './Loginscreen';
import { QuickplayScreen } from './Quickplayscreen';

type Tab = 'games' | 'stats' | 'quickplay';

export const App: React.FC = () => {
  const { user } = useAppState();
  const [tab, setTab] = useState<Tab>('quickplay');

  if (!user) {
    return (
      <div className="app-root">
        <div className="glass-card">
          <LoginScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <div className="glass-card">
        <header>
          <h1>Dart Session</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Eingeloggt als {user.name}
          </p>
        </header>

        <nav className="main-nav">
          <button
            className={`tab-button ${tab === 'games' ? 'tab-button--active' : ''}`}
            onClick={() => setTab('games')}
          >
            Games
          </button>
          <button
            className={`tab-button ${tab === 'stats' ? 'tab-button--active' : ''}`}
            onClick={() => setTab('stats')}
          >
            Stats
          </button>
          <button
            className={`tab-button ${tab === 'quickplay' ? 'tab-button--active' : ''}`}
            onClick={() => setTab('quickplay')}
          >
            Quickplay
          </button>
        </nav>

        <main style={{ marginTop: '1.25rem', flex: 1 }}>
          {tab === 'quickplay' && <QuickplayScreen />}
          {tab === 'games' && (
            <p style={{ color: 'var(--text-muted)' }}>
              Dieser Bereich wird später Spielmodi anzeigen.
            </p>
          )}
          {tab === 'stats' && (
            <p style={{ color: 'var(--text-muted)' }}>
              Hier kommen später detaillierte Statistiken.
            </p>
          )}
        </main>

        <footer className="bottom-row">
          <XpBar />
        </footer>
      </div>
    </div>
  );
};

const XpBar: React.FC = () => {
  const { user } = useAppState();
  if (!user) return null;

  const totalToNext = user.xpToNext;
  const progress = Math.max(0, Math.min(1, (totalToNext - user.xpToNext) / totalToNext));

  // Einfacher: wir nehmen Anteil zwischen 0 und 1 anhand xpToNext nicht exakt – du kannst das
  // später mit einer calcLevel‑Funktion vom Backend gespiegelt berechnen.

  return (
    <div className="xp-bar">
      <div className="xp-bar-track">
        <div
          className="xp-bar-fill"
          style={{ width: `${Math.min(100, Math.max(10, 100 - (user.xpToNext / (user.xpToNext + 50)) * 100))}%` }}
        />
      </div>
      <div className="xp-bar-label">
        <span>Level {user.level}</span>
        <span>{user.xpToNext} XP bis Level‑Up</span>
      </div>
    </div>
  );
};
