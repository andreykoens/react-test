'use client'

import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import { apiPost } from 'utils/api'
import { IRegister } from 'types/api'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'

export default function Register() {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged } = useContext(ContextAuth)
  const router = useRouter()
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IRegister>()
  const password = useRef({})
  password.current = watch('password', '')
  const usernamePattern = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/i

  /*================================ States ==============================*/
  /*================================ Functions ==============================*/
  const handleRegister = useCallback(
    (props: IRegister) => {
      apiPost('/register', props, (data) => {
        router.push('/')
      })
    },
    [router]
  )

  const onSubmit: SubmitHandler<IRegister> = (data) => {
    handleRegister(data)
  }
  /*================================ Effects ==============================*/
  useEffect(() => {
    if (isLoaded && !isLogged) return
    router.push('/')
  }, [isLoaded, isLogged, router])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          {...register('username', {
            required: 'You must specify a username',
            pattern: { value: usernamePattern, message: 'Please enter a valid username' },
            maxLength: { value: 191, message: 'The limit is 191 characters' },
          })}
        />
        {errors.password && <p>{errors.password.message}</p>}
        <br />

        <input
          {...register('name', {
            required: 'You must specify a name',
            maxLength: { value: 100, message: 'The limit is 100 characters' },
          })}
        />
        {errors.password && <p>{errors.password.message}</p>}
        <br />

        <input
          {...register('password', {
            required: 'You must specify a password',
            minLength: {
              value: 8,
              message: 'Password must have at least 8 characters',
            },
            maxLength: { value: 191, message: 'The limit is 191 characters' },
          })}
          type="password"
        />
        {errors.password && <p>{errors.password.message}</p>}
        <br />

        <input
          {...register('passwordconfirm', {
            validate: (value) => value === password.current || 'The passwords do not match',
          })}
          type="password"
        />
        {errors.passwordconfirm && <p>{errors.passwordconfirm.message}</p>}
        <br />

        <input type="submit" onClick={handleSubmit(onSubmit)} />
      </form>
    </main>
  )
}
