'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ILogin, IUser } from 'types/api'
import { apiPost } from 'utils/api'

declare global {
  interface Window {
    FakerApi: any
  }
}

interface INameIndexItem {
  id: number
  name: string
}

interface IContextAuth {
  isLoaded: boolean
  user: IUser
  isLogged: boolean
  login: (props: ILogin) => void
  logout: () => void
  nameIndex: INameIndexItem[]
  buildNameIndex: () => void
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
  const [nameIndex, setNameIndex] = useState<INameIndexItem[]>([])

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

  const buildNameIndex = useCallback(() => {
    const newNameIndex: INameIndexItem[] = []
    let rawUsers: any = localStorage.getItem('users')
    if (!rawUsers) rawUsers = '[]'
    const users = JSON.parse(rawUsers)
    users.forEach((user) => {
      newNameIndex.push({ id: user.id, name: user.name })
    })
    setNameIndex(newNameIndex)
  }, [])

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
      buildNameIndex()
    }, 25)
  }, [isLoaded, getUserData, buildNameIndex])

  /*================================ Memos ==============================*/
  const contextAuthValue: IContextAuth = useMemo(
    () => ({
      isLoaded,
      user,
      isLogged,
      login,
      logout,
      nameIndex,
      buildNameIndex,
    }),
    [isLoaded, user, isLogged, login, logout, nameIndex, buildNameIndex]
  )

  /*================================ Render ==============================*/
  return <ContextAuth.Provider value={contextAuthValue}>{children}</ContextAuth.Provider>
}

export function useAuth() {
  const context = useContext(ContextAuth)
  return context
}
