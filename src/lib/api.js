import { getToken, clearToken } from './auth.js'

export async function analyzeProfile(profile) {
  const token = getToken()
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(profile),
  })

  if (res.status === 401) {
    clearToken()
    throw new Error('Session expirée — veuillez vous reconnecter.')
  }

  if (!res.ok) {
    let message = `Erreur ${res.status}`
    try {
      const data = await res.json()
      if (data.error) message = data.error
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  return res.json()
}

export async function sendReportEmail(profile, report) {
  const token = getToken()
  const res = await fetch('/api/send-report', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ profile, report }),
  })

  if (!res.ok) {
    let message = `Erreur ${res.status}`
    try {
      const data = await res.json()
      if (data.error) message = data.error
    } catch {
      // ignore
    }
    throw new Error(message)
  }

  return res.json()
}
