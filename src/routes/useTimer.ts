import { writable } from 'svelte/store'

export const useTimer = () => {
  const { subscribe, update } = writable(0)

  let intervalId: NodeJS.Timer | null = null

  const timeStop = () => {
    if (!intervalId) return

    clearInterval(intervalId)
  }

  const timeReset = () => {
    if (!intervalId) return

    clearInterval(intervalId)
    update(() => 0)
  }

  const timeStart = () => {
    intervalId = setInterval(() => {
      update((prev) => prev + 1)

      return timeStop
    }, 1000)
  }

  return {
    time: { subscribe },
    timeStop,
    timeReset,
    timeStart
  }
}
