'use client'

import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import { apiPost } from 'utils/api'
import { IRecordPost, IRegister } from 'types/api'
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
  } = useForm<IRecordPost>()

  /*================================ States ==============================*/
  /*================================ Functions ==============================*/
  const handleRecordPostNew = useCallback(
    (props: IRecordPost) => {
      apiPost('/posts/create', props, (data) => {
        /* If the response returned the id of the post,
      the ideal would be to redirect to the edit page */
        router.push('/dashboard/posts/list')
      })
    },
    [router]
  )

  const onSubmit: SubmitHandler<IRecordPost> = (data) => {
    handleRecordPostNew(data)
  }
  /*================================ Effects ==============================*/
  useEffect(() => {
    if (!isLoaded) return
    if (isLoaded && !isLogged) {
      router.push('/')
    }
  }, [isLoaded, isLogged, router])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          {...register('title', {
            required: 'You must write a title',
            minLength: { value: 15, message: 'You must provide at least 15 characters' },
            maxLength: { value: 60, message: 'The title limit is 60 characters' },
          })}
        />
        {errors.title && <p>{errors.title.message}</p>}
        <br />
        <textarea
          {...register('content', {
            required: 'You must write some content',
            minLength: { value: 260, message: 'You must provide at least 256 characters' },
          })}
        />
        {errors.content && <p>{errors.content.message}</p>}
        <br />

        <input type="submit" onClick={handleSubmit(onSubmit)} />
      </form>
    </main>
  )
}
