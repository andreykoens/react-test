'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import Link from 'next/link'

export default function Home() {
  /*================================ Constants ==============================*/
  const auth = useContext(ContextAuth)
  const isLogged = auth.isLogged
  /*================================ States ==============================*/
  const [valueListaPosts, SetValueListaPosts] = useState<any>(null)
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
  const ListaPosts = useCallback(() => {
    window.FakerApi.get('/posts', {})
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueListaPosts(response)
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
    if (!window.FakerApi) return
    ListaPosts()
    ListaComments()
  }, [ListaComments, ListaPosts])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  return (
    <main>
      {!isLogged && <Link href={'/register'}>Criar uma conta</Link>}
      <button
        onClick={() => {
          auth.login({ username: 'teste', password: 'teste' })
        }}
      >
        Login
      </button>
      <br />
      <button
        onClick={() => {
          auth.logout()
        }}
      >
        Logout
      </button>
      <br />
      <button
        onClick={() => {
          // auth.Register({ name: 'teste', username: 'teste', password: 'teste' })
        }}
      >
        Register
      </button>
      <br />
      {isLogged && <div>{JSON.stringify(auth.user, null, 2)}</div>}

      <hr />
      <h1>Posts</h1>
      <div>{JSON.stringify(valueListaPosts, null, 2)}</div>
      <hr />

      <button
        onClick={() => {
          ListaPosts()
        }}
      >
        Atualizar lista de posts
      </button>
      <div>{JSON.stringify(valueBuscaPost, null, 2)}</div>
      <button
        onClick={() => {
          BuscaPost()
        }}
      >
        BuscaPost
      </button>
      <hr />
      <h1>Page</h1>
      <br />
      <div>{JSON.stringify(valueListaComments, null, 2)}</div>
      <button
        onClick={() => {
          ListaComments()
        }}
      >
        ListaComments
      </button>
      <br />
      <div>{JSON.stringify(valueBuscaComment, null, 2)}</div>
      <button
        onClick={() => {
          BuscaComment()
        }}
      >
        BuscaComment
      </button>
      {isLogged && (
        <div style={{ border: '1px solid black', padding: '10px' }}>
          <h3>logged user comment</h3>
          <div>{JSON.stringify(valueCriaComment, null, 2)}</div>
          <button
            onClick={() => {
              CriaComment()
            }}
          >
            CriaComment
          </button>

          <br />
          <div>{JSON.stringify(valueAtualizaComment, null, 2)}</div>
          <button
            onClick={() => {
              AtualizaComment()
            }}
          >
            AtualizaComment
          </button>
          <br />
          <div>{JSON.stringify(valueRemoveComment, null, 2)}</div>
          <button
            onClick={() => {
              RemoveComment()
            }}
          >
            RemoveComment
          </button>
        </div>
      )}

      <br />
      {isLogged && (
        <div style={{ background: '#ddd' }}>
          <h1>Admin</h1>
          <div>{JSON.stringify(valueCriaPost, null, 2)}</div>
          <button
            onClick={() => {
              CriaPost()
            }}
          >
            CriaPost
          </button>

          <br />
          <div>{JSON.stringify(valueAtualizaPost, null, 2)}</div>
          <button
            onClick={() => {
              AtualizaPost()
            }}
          >
            AtualizaPost
          </button>
          <br />
          <div>{JSON.stringify(valueRemovePost, null, 2)}</div>
          <button
            onClick={() => {
              RemovePost()
            }}
          >
            RemovePost
          </button>
          <br />
        </div>
      )}
    </main>
  )
}
