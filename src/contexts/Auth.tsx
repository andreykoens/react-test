'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ILogin, IRecordUser } from 'types/api'
import { apiPost } from 'utils/api'

declare global {
  interface Window {
    // The API is a non typescript external asset
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FakerApi: any
  }
}

interface INameIndexItem {
  id: number
  name: string
}

interface IContextAuth {
  isLoaded: boolean
  user: IRecordUser
  isLogged: boolean
  // False positive
  // eslint-disable-next-line no-unused-vars
  login(props: ILogin): void
  logout(): void
  nameIndex: INameIndexItem[]
  buildNameIndex(): void
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
  const [user, setUser] = useState<IRecordUser>()
  const [isLogged, setIsLogged] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [nameIndex, setNameIndex] = useState<INameIndexItem[]>([])

  /*================================ Functions ==============================*/
  const Reset = useCallback(() => {
    setUser(null)
    setIsLogged(false)
  }, [])
  const getUserData = useCallback(() => {
    apiPost('/me', {}, (data: IRecordUser) => {
      setUser(data)
      setIsLogged(true)
    })
  }, [])
  const login = useCallback(
    (props: ILogin) => {
      apiPost<ILogin, ILogin>('/login', props, () => {
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
    let rawUsers: string = localStorage.getItem('users')
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
    if (!isLogged) {
      const authCheck: string = localStorage.getItem('auth')
      if (authCheck) {
        const check = JSON.parse(authCheck)
        if (check && 'name' in check) setIsLogged(true)
      }
    }
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
  }, [isLoaded, getUserData, buildNameIndex, isLogged])

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
