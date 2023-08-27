'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ILogin, IUser } from 'types/api'
import { apiPost } from 'utils/api'

declare global {
  interface Window {
    FakerApi: any
  }
}

interface IMousePosition {
  x: number
  y: number
}
interface IContextMousePosition {
  mousePosition: IMousePosition
  trigger: (call: string) => void
}
interface FCProps {
  children: React.ReactNode
}

export const ContextMouseEvents = createContext({} as IContextMousePosition)

export const ContextMouseEventsProvider: React.FC<FCProps> = ({
  children,
}: {
  children: React.ReactNode
}) => {
  /*================================ Constants ==============================*/
  /*================================ States ==============================*/
  const [mousePosition, setMousePosition] = useState<IMousePosition>({ x: 0, y: 0 })

  /*================================ Functions ==============================*/
  const handleMouseMovement = (event) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY,
    })
  }
  /*================================ Effects ==============================*/
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMovement)
    return () => {
      window.removeEventListener('mousemove', handleMouseMovement)
    }
  }, [])

  /*================================ Memos ==============================*/
  const contextMouseEventsValue: IContextMousePosition = useMemo(
    () => ({
      mousePosition,
      trigger,
    }),
    [mousePosition, trigger]
  )

  /*================================ Render ==============================*/
  return (
    <ContextMouseEvents.Provider value={contextMouseEventsValue}>
      {children}
    </ContextMouseEvents.Provider>
  )
}

export function useMouseEvents() {
  const context = useContext(ContextMouseEvents)
  return context
}
