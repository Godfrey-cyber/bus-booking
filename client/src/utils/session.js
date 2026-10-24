// Session persistence for the mock JWT flow. "Remember me" decides whether the
// session survives a browser restart (localStorage) or just the tab (sessionStorage).
const SESSION_KEY = 'fleetgo.session'

export function storeSession({ user, token }, remember) {
  const store = remember ? localStorage : sessionStorage
  const other = remember ? sessionStorage : localStorage
  other.removeItem(SESSION_KEY)
  store.setItem(SESSION_KEY, JSON.stringify({ user, token }))
}

export function readSession() {
  const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}
