'use client'

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

declare global {
  interface Window {
    FakerApi: any
  }
}
interface ILogin {
  username: string
  password: string
}

interface IRegister {
  name: string
  username: string
  password: string
}

interface IContextAuth {
  Login({}: ILogin): any
  Logout: any
  Register({}: IRegister): any
  Me: any
  isLogged: boolean
}
interface IContextAuthValue {
  Login: any
  Logout: any
  Register: any
  Me: any
  isLogged: boolean
}

export const ContextAuth = createContext({} as IContextAuth)

export const ContextAuthProvider: React.FC = ({ children }) => {
  /*================================ Constants ==============================*/
  /*================================ States ==============================*/
  const [valueLogin, SetValueLogin] = useState<any>(null)
  const [valueLogout, SetValueLogout] = useState<string>('')
  const [valueRegister, SetValueRegister] = useState<any>(null)
  const [valueMe, SetValueMe] = useState<any>(null)
  const [isLogged, setIsLogged] = useState<boolean>(false)

  /*================================ Functions ==============================*/
  const Reset = useCallback(() => {
    SetValueLogin(null)
    SetValueRegister(null)
    SetValueMe(null)
    setIsLogged(false)
  }, [])

  const Login = useCallback((props: ILogin) => {
    console.log(props)
    window.FakerApi.post('/login', props)
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueLogin(response)
      })
  }, [])
  const Logout = useCallback(() => {
    window.FakerApi.post('/logout', {})
      .catch((response: any) => {
        console.log('error')
      })
      .then((response: any) => {
        SetValueLogout('loggedOut')
        Reset()
      })
  }, [Reset])
  const Register = useCallback((props: IRegister) => {
    window.FakerApi.post('/register', props)
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueRegister(response)
      })
  }, [])
  const Me = useCallback(() => {
    window.FakerApi.get('/me', {})
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueMe(response)
      })
  }, [])

  /*================================ Effects ==============================*/
  /*================================ Memos ==============================*/
  const contextAuthValue: IContextAuthValue = useMemo(
    () => ({
      data: {
        valueLogin,
        valueLogout,
        valueRegister,
        valueMe,
        isLogged,
      },
      Login,
      Logout,
      Register,
      Me,
    }),
    [Login, Logout, Me, Register, valueLogin, valueLogout, valueMe, valueRegister]
  )

  /*================================ Render ==============================*/
  return <ContextAuth.Provider value={contextAuthValue}>{children}</ContextAuth.Provider>
}

export function useAuth() {
  const context = useContext(ContextAuth)
  return context
}
