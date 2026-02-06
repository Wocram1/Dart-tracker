const API_BASE = '/api';

export type ApiAction =
  | 'register'
  | 'login'
  | 'startQuickplay'
  | 'submitThrow';

export async function callApi(action: ApiAction, payload: any) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload })
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}
