'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ILogin, IRecordUser, IResponse } from 'types/api'
import { useApi } from './Api'
import { usePathname, useRouter } from 'next/navigation'
import FakerApi from 'utils/fakerApi'
const fakerApi = new FakerApi()

interface INameIndexItem {
  id: number
  name: string
}

interface IContextAuth {
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
  const { apiPost } = useApi()
  const router = useRouter()
  const pathname = usePathname()
  /*================================ States ==============================*/
  const [user, setUser] = useState<IRecordUser>()
  const [isLogged, setIsLogged] = useState<boolean>(false)
  const [nameIndex, setNameIndex] = useState<INameIndexItem[]>([])

  /*================================ Functions ==============================*/

  const getUserData = useCallback(() => {
    fakerApi
      .get('/me', {})
      .catch((response) => {
        console.log(response)
        if (!response.success) {
          setUser(null)
          setIsLogged(false)
        }
      })
      .then((response: IResponse<IRecordUser>) => {
        if (response && 'success' in response) {
          setUser(response.data as IRecordUser)
          setIsLogged(true)
        }
      })
  }, [])

  const login = useCallback(
    (props: ILogin) => {
      apiPost('/login', props, () => {
        getUserData()
        router.push('/')
      })
    },
    [apiPost, getUserData, router]
  )

  const logout = useCallback(() => {
    apiPost('/logout', {}, () => {
      setIsLogged(false)
      setUser(null)
    })
  }, [apiPost])

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
    getUserData()
    buildNameIndex()
  }, [buildNameIndex, getUserData])

  useEffect(() => {
    const authCheck = localStorage.getItem('auth')
    if (!authCheck && pathname.includes('dashboard')) {
      router.push('/')
    }
    if (authCheck && (pathname.includes('login') || pathname.includes('register'))) {
      router.push('/')
    }
  }, [isLogged, pathname, router, user])

  /*================================ Memos ==============================*/
  const contextAuthValue: IContextAuth = useMemo(
    () => ({
      user,
      isLogged,
      login,
      logout,
      nameIndex,
      buildNameIndex,
    }),
    [user, isLogged, login, logout, nameIndex, buildNameIndex]
  )

  /*================================ Render ==============================*/
  return <ContextAuth.Provider value={contextAuthValue}>{children}</ContextAuth.Provider>
}

export function useAuth() {
  const context = useContext(ContextAuth)
  return context
}
