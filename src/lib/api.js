export async function analyzeProfile(profile) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
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
