'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { apiGet } from 'utils/api'
import { IRecordPost } from 'types/api'
import { v4 } from 'uuid'
import { CommentSection } from 'components/CommentSection'

export default function RecordsShowPost() {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, logout, user } = useContext(ContextAuth)
  const router = useRouter()
  const params = useParams()
  /*================================ States ==============================*/
  const [valueBuscaPost, SetValueBuscaPost] = useState<any>(null)
  const [recordPost, setRecordPost] = useState<any>(null)
  const [valueCriaPost, SetValueCriaPost] = useState<any>(null)
  const [valueAtualizaPost, SetValueAtualizaPost] = useState<any>(null)
  const [valueRemovePost, SetValueRemovePost] = useState<any>(null)

  /*================================ Functions ==============================*/

  const CriaPost = useCallback(() => {
    window.FakerApi.post('/posts/create', { title: 'teste', content: 'teste' })
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueCriaPost(response)
      })
  }, [])
  const AtualizaPost = useCallback(() => {
    window.FakerApi.put('/posts/update', {
      post_id: 1,
      post: { title: 'teste', content: 'teste atualizado' },
    })
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueAtualizaPost(response)
      })
  }, [])
  const RemovePost = useCallback(() => {
    window.FakerApi.delete('/posts/remove', { post_id: 2 })
      .catch((error: any) => {
        console.error(error)
        SetValueRemovePost(null)
      })
      .then((response: any) => {
        SetValueRemovePost(response)
      })
  }, [])

  const getPost = useCallback(() => {
    apiGet<{ post_id: number }, IRecordPost>(
      '/posts/view',
      { post_id: Number(params.id) },
      (data: IRecordPost) => {
        setRecordPost(data)
      }
    )
  }, [params.id])
  /*================================ Effects ==============================*/
  useEffect(() => {
    if (!isLoaded) return
    getPost()
  }, [getPost, isLoaded])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  return (
    <main>
      {/*================== SINGLE POST =================*/}

      {recordPost && (
        <div
          key={`post-${v4()}`}
          style={{ border: '1px solid black', padding: '10px', margin: '0 0 10px 0' }}
        >
          <h2>
            <Link href={`/post/${recordPost.id}`}>{recordPost.title}</Link>
          </h2>
          <small>Written by {recordPost.user_id}</small>
          <p>{recordPost.content}</p>
          {recordPost.id && (
            <CommentSection
              post_id={recordPost.id}
              comments={recordPost.comments}
              allowPost={true}
            ></CommentSection>
          )}
        </div>
      )}
    </main>
  )
}
