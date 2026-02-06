import React, { useState } from 'react';
import { useAppState } from './state';
import { callApi } from './api';

type Mode = 'login' | 'register';

export const LoginScreen: React.FC = () => {
  const { setUser } = useAppState();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await callApi('login', { name, password });
        if (!res.ok) throw new Error(res.error || 'Login fehlgeschlagen');
        setUser(res.user);
      } else {
        const res = await callApi('register', { name, password, inviteCode });
        if (!res.ok) throw new Error(res.error || 'Registrierung fehlgeschlagen');
        setUser(res.user);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>dart.session</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: '0.35rem', fontSize: '0.85rem' }}>
        Logge dich ein oder erstelle einen Account mit Invite‑Code.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1.2rem' }}>
        <div className="input-group">
          <input
            className="input-field"
            type="text"
            placeholder="Name"
            autoComplete="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="input-field"
            type="password"
            placeholder="Passwort"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {mode === 'register' && (
            <input
              className="input-field"
              type="text"
              placeholder="Invite‑Code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
          )}
        </div>

        {error && <div className="error-text">{error}</div>}

        <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.2rem', gap: '0.9rem' }}>
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Bitte warten...' : mode === 'login' ? 'Login' : 'Account erstellen'}
          </button>
          <button
            type="button"
            className="tab-button"
            onClick={switchMode}
          >
            {mode === 'login' ? 'Neu hier? Registrieren' : 'Schon Account? Login'}
          </button>
        </div>
      </form>
    </>
  );
};
