'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiPost } from 'utils/api'
import { IRecordPost } from 'types/api'

export default function Home() {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, logout, user } = useContext(ContextAuth)
  const router = useRouter()
  /*================================ States ==============================*/
  const [recordsPosts, setRecordsPosts] = useState<any>(null)
  const [valueCriaPost, SetValueCriaPost] = useState<any>(null)
  const [valueBuscaPost, SetValueBuscaPost] = useState<any>(null)
  const [valueAtualizaPost, SetValueAtualizaPost] = useState<any>(null)
  const [valueRemovePost, SetValueRemovePost] = useState<any>(null)
  const [valueListaComments, SetValueListaComments] = useState<any>(null)
  const [valueCriaComment, SetValueCriaComment] = useState<any>(null)
  const [valueBuscaComment, SetValueBuscaComment] = useState<any>(null)
  const [valueAtualizaComment, SetValueAtualizaComment] = useState<any>(null)
  const [valueRemoveComment, SetValueRemoveComment] = useState<any>(null)
  /*================================ Functions ==============================*/
  const getPosts = useCallback(() => {
    apiPost('/posts', {}, (data: Record<string | number, IRecordPost>) => {
      delete data['message']
      setRecordsPosts(Object.values(data))
    })
  }, [])
  const CriaPost = useCallback(() => {
    window.FakerApi.post('/posts/create', { title: 'teste', content: 'teste' })
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueCriaPost(response)
      })
  }, [])
  const BuscaPost = useCallback(() => {
    window.FakerApi.get('/posts/view', { post_id: 1 })
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueBuscaPost(response)
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
  const ListaComments = useCallback(() => {
    window.FakerApi.get('/comments', { post_id: 1 })
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueListaComments(response)
      })
  }, [])
  const CriaComment = useCallback(() => {
    window.FakerApi.post('/comments/create', {
      post_id: 1,
      comment: { content: 'Comentario teste' },
    })
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueCriaComment(response)
      })
  }, [])
  const BuscaComment = useCallback(() => {
    window.FakerApi.get('/comments/view', { post_id: 1, comment_id: 1 })
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueBuscaComment(response)
      })
  }, [])
  const AtualizaComment = useCallback(() => {
    window.FakerApi.put('/comments/update', {
      post_id: 1,
      comment_id: 1,
      comment: { content: 'Comentario atualizado' },
    })
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueAtualizaComment(response)
      })
  }, [])
  const RemoveComment = useCallback(() => {
    window.FakerApi.delete('/comments/remove', { post_id: 1, comment_id: 2 })
      .catch((error: any) => {
        console.error(error)
        SetValueRemoveComment(null)
      })
      .then((response: any) => {
        SetValueRemoveComment(response)
      })
  }, [])
  /*================================ Effects ==============================*/
  useEffect(() => {
    if (!isLoaded) return
    getPosts()
    // ListaComments()
  }, [ListaComments, getPosts, isLoaded])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  return (
    <main>
      <h1>React Test</h1>
      {isLogged && (
        <div>
          {JSON.stringify(user, null, 2)}
          <button
            onClick={() => {
              logout()
            }}
          >
            Logout
          </button>
        </div>
      )}
      {!isLogged && (
        <div>
          <button
            onClick={() => {
              router.push('/login')
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              router.push('/register')
            }}
          >
            Register
          </button>
        </div>
      )}

      <br />
      <hr />
      <button
        onClick={() => {
          BuscaPost()
        }}
      >
        BuscaPost
      </button>
      <div>{JSON.stringify(valueBuscaPost, null, 2)}</div>
      <hr />

      {/*================== POSTS =================*/}
      {recordsPosts &&
        recordsPosts.map((post: IRecordPost) => (
          <div
            key={`post-${post.id}`}
            style={{ border: '1px solid black', padding: '10px', margin: '0 0 10px 0' }}
          >
            <h2>
              <Link href={`/post/${post.id}`}>{post.title}</Link>
            </h2>
            <small>Written by {post.user_id}</small>
            <p>content</p>
            {post.comments && <>{JSON.stringify(post, null, 2)}</>}
            {!post.comments && <>Leave a comment</>}
          </div>
        ))}
    </main>
  )
}
