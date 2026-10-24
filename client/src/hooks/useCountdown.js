import { useEffect, useState } from 'react'

// Drives seat-reservation and OTP-style countdowns from a target ISO timestamp.
export function useCountdown(targetIso) {
  const [remainingMs, setRemainingMs] = useState(() =>
    targetIso ? Math.max(0, new Date(targetIso).getTime() - Date.now()) : 0
  )

  useEffect(() => {
    if (!targetIso) return undefined
    const tick = () => setRemainingMs(Math.max(0, new Date(targetIso).getTime() - Date.now()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetIso])

  const totalSeconds = Math.floor(remainingMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return {
    minutes,
    seconds,
    isExpired: targetIso ? remainingMs <= 0 : false,
    label: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
  }
}
