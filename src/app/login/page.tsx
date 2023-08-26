'use client'

import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import { apiPost } from 'utils/api'
import { ILogin } from 'types/api'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'

export default function Login() {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, login } = useContext(ContextAuth)
  const router = useRouter()
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<ILogin>()
  const password = useRef({})
  password.current = watch('password', '')
  /*================================ States ==============================*/
  /*================================ Functions ==============================*/
  const handleLogin = useCallback(
    (props: ILogin) => {
      login({ username: 'teste', password: 'teste' })
    },
    [login]
  )

  const onSubmit: SubmitHandler<ILogin> = (data) => {
    handleLogin(data)
  }
  /*================================ Effects ==============================*/
  useEffect(() => {
    if (isLoaded && !isLogged) return
    router.push('/')
  }, [isLoaded, isLogged, router, login])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()}>
        <input {...register('username', { required: 'You must specify a username' })} />
        {errors.password && <p>{errors.password.message}</p>}
        <br />

        <input
          {...register('password', {
            required: 'You must specify a password',
          })}
          type="password"
        />
        {errors.password && <p>{errors.password.message}</p>}
        <br />

        <input type="submit" onClick={handleSubmit(onSubmit)} />
      </form>
    </main>
  )
}
