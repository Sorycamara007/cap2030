const TOKEN_KEY = 'cap2030-auth-token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // localStorage may be unavailable in private mode
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}

export async function login(password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) {
    let message = 'Mot de passe incorrect'
    try {
      const data = await res.json()
      if (data?.error) message = data.error
    } catch {
      // ignore parse error
    }
    throw new Error(message)
  }
  const data = await res.json()
  setToken(data.token)
  return data.token
}
