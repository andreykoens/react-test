'use client'

import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import { apiGet, apiPost, apiPut } from 'utils/api'
import { IRecordPost, IRegister } from 'types/api'
import { useRouter, useParams } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'

export default function DashboardPostsUpdate() {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged } = useContext(ContextAuth)
  const router = useRouter()
  const params = useParams()
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IRecordPost>()

  /*================================ States ==============================*/

  /*================================ Functions ==============================*/
  const handleRecordPostUpdate = useCallback((props: IRecordPost) => {
    console.log(props)
    apiPut('/posts/update', props.id, { title: props.title, content: props.content }, (data) => {
      console.log('ok!')
    })
  }, [])

  const getPost = useCallback(() => {
    apiGet<{ post_id: number }, IRecordPost>(
      '/posts/view',
      { post_id: Number(params.id) },
      (data: IRecordPost) => {
        reset(data)
      }
    )
  }, [params.id, reset])

  const onSubmit: SubmitHandler<IRecordPost> = (data) => {
    handleRecordPostUpdate(data)
  }
  /*================================ Effects ==============================*/
  useEffect(() => {
    if (!isLoaded) return
    if (isLoaded && !isLogged) {
      // router.push('/')
    }
    getPost()
  }, [getPost, isLoaded, isLogged, router])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          {...register('title', {
            required: 'You must write a title',
            minLength: { value: 15, message: 'You must provide at least 15 characters' },
            maxLength: { value: 100, message: 'The limit is 100 characters' },
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
