'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ILogin, IUser } from 'types/api'
import { apiPost } from 'utils/api'

declare global {
  interface Window {
    FakerApi: any
  }
}

interface IContextAuth {
  isLoaded: boolean
  user: IUser
  isLogged: boolean
  login: (props: ILogin) => void
  logout: () => void
}

interface FCProps {
  children: React.ReactNode
}

export const ContextAuth = createContext({} as IContextAuth)

export const ContextAuthProvider: React.FC<FCProps> = ({
  children,
}: {
  children: React.ReactNode
}) => {
  /*================================ Constants ==============================*/
  /*================================ States ==============================*/
  const [user, setUser] = useState<any>(null)
  const [isLogged, setIsLogged] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  /*================================ Functions ==============================*/
  const Reset = useCallback(() => {
    setUser(null)
    setIsLogged(false)
  }, [])
  const getUserData = useCallback(() => {
    apiPost('/me', {}, (data: IUser) => {
      setUser(data)
      setIsLogged(true)
    })
  }, [])
  const login = useCallback(
    (props: ILogin) => {
      apiPost<ILogin, ILogin>('/login', props, (data) => {
        getUserData()
      })
    },
    [getUserData]
  )
  const logout = useCallback(() => {
    apiPost('/logout', {}, () => {
      setIsLogged(false)
      Reset()
    })
  }, [Reset])

  /*================================ Effects ==============================*/
  // Hacky-ish, will work for the mock-up
  useEffect(() => {
    if (isLoaded) return
    setTimeout(() => {
      if (!window.FakerApi) {
        setIsLoaded(false)
      } else {
        getUserData()
        setIsLoaded(true)
      }
    }, 25)
  }, [isLoaded, getUserData])
  /*================================ Memos ==============================*/
  const contextAuthValue: IContextAuth = useMemo(
    () => ({
      isLoaded,
      user,
      isLogged,
      login,
      logout,
    }),
    [isLoaded, user, isLogged, login, logout]
  )

  /*================================ Render ==============================*/
  return <ContextAuth.Provider value={contextAuthValue}>{children}</ContextAuth.Provider>
}

export function useAuth() {
  const context = useContext(ContextAuth)
  return context
}
