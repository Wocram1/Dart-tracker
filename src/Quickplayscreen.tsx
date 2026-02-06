import React, { useEffect, useState } from 'react';
import { useAppState } from './state';
import { callApi } from './api';

type ThrowInfo = {
  throwNumber: number;
  dartInTurn: number;
};

const START_SCORE = 501;

export const QuickplayScreen: React.FC = () => {
  const { user, session, setSession } = useAppState();
  const [currentScore, setCurrentScore] = useState(START_SCORE);
  const [throwInfo, setThrowInfo] = useState<ThrowInfo>({ throwNumber: 1, dartInTurn: 1 });
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (!user) return;
      if (session) {
        setCurrentScore(session.score);
        return;
      }
      try {
        const res = await callApi('startQuickplay', { userId: user.id });
        if (res.ok && mounted) {
          const s = { id: res.sessionId, score: res.startingScore };
          setSession(s);
          setCurrentScore(res.startingScore);
        }
      } catch (e) {
        console.error(e);
        setStatus('Fehler beim Start der Runde.');
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [user, session, setSession]);

  if (!user || !session) {
    return <p>Initialisiere Quickplay…</p>;
  }

  const handleScoreClick = async (hitValue: number, multiplier: number, label: string) => {
    const scored = hitValue * multiplier;
    const newScore = Math.max(0, currentScore - scored);

    const isFirstTryHit = throwInfo.dartInTurn === 1;

    try {
      const res = await callApi('submitThrow', {
        sessionId: session.id,
        userId: user.id,
        userName: user.name,
        throwNumber: throwInfo.throwNumber,
        dartInTurn: throwInfo.dartInTurn,
        target: label,
        hitValue,
        multiplier,
        isFirstTryHit
      });

      if (res.ok) {
        setStatus(`-${scored} Punkte • +${res.xpGain} XP`);
      }
    } catch (e) {
      console.error(e);
      setStatus('Fehler beim Speichern des Wurfs.');
    }

    setCurrentScore(newScore);
    setSession({ ...session, score: newScore });

    let nextDart = throwInfo.dartInTurn + 1;
    let nextThrow = throwInfo.throwNumber;
    if (nextDart > 3) {
      nextDart = 1;
      nextThrow += 1;
    }
    setThrowInfo({ throwNumber: nextThrow, dartInTurn: nextDart });
  };

  const renderNumberRow = (from: number, to: number) => {
    const buttons = [];
    for (let n = from; n <= to; n++) {
      buttons.push(
        <button
          key={n}
          className="score-button"
          onClick={() => handleScoreClick(n, 1, `S${n}`)}
        >
          {n}
        </button>
      );
    }
    return buttons;
  };

  return (
    <section>
      <header>
        <h2>Quickplay 501</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Restscore: <strong>{currentScore}</strong> • Wurf {throwInfo.throwNumber} / Dart {throwInfo.dartInTurn}
        </p>
      </header>

      {status && (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.4rem' }}>
          {status}
        </p>
      )}

      <div className="scoring-grid">
        <button
          className="score-button"
          onClick={() => handleScoreClick(0, 1, 'MISS')}
        >
          Miss
        </button>
        <button
          className="score-button score-button--bull"
          onClick={() => handleScoreClick(25, 1, 'S25')}
        >
          Bull (25)
        </button>
        <button
          className="score-button score-button--bull"
          onClick={() => handleScoreClick(50, 1, 'BULL')}
        >
          Bull (50)
        </button>
        {/* leere Füller, damit sich das Grid wie in der App anfühlt */}
        <div />
        <div />
      </div>

      <div className="scoring-grid">
        {renderNumberRow(1, 5)}
      </div>
      <div className="scoring-grid">
        {renderNumberRow(6, 10)}
      </div>
      <div className="scoring-grid">
        {renderNumberRow(11, 15)}
      </div>
      <div className="scoring-grid">
        {renderNumberRow(16, 20)}
      </div>

      {/* einfache Zeile für Doppel/Trippel des aktuell gewählten Felds kannst du später ergänzen */}

      <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        Doppel/Trippel‑Tracking wird bereits gespeichert (Multiplier). UI‑Buttons dafür kannst du
        analog ergänzen.
      </div>
    </section>
  );
};
