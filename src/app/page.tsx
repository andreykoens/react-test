'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiPost } from 'utils/api'
import { IRecordPost } from 'types/api'
import { CommentSection } from 'components/CommentSection'
import { v4 } from 'uuid'

export default function Home() {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, logout, user } = useContext(ContextAuth)
  const router = useRouter()
  /*================================ States ==============================*/
  const [recordsPosts, setRecordsPosts] = useState<any>(null)

  /*================================ Functions ==============================*/
  const getPosts = useCallback(() => {
    apiPost('/posts', {}, (data: Record<string | number, IRecordPost>) => {
      delete data['message']
      setRecordsPosts(Object.values(data))
    })
  }, [])

  /*================================ Effects ==============================*/
  useEffect(() => {
    if (!isLoaded) return
    getPosts()
    // ListaComments()
  }, [getPosts, isLoaded])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  return (
    <main>
      {/*================== POSTS =================*/}
      {recordsPosts &&
        recordsPosts.map((post: IRecordPost) => (
          <div
            key={`post-${v4()}`}
            style={{ border: '1px solid black', padding: '10px', margin: '0 0 10px 0' }}
          >
            <h2>
              <Link href={`/post/${post.id}`}>{post.title}</Link>
            </h2>
            <small>Written by {post.user_id}</small>
            <p>content</p>
            <CommentSection comments={post.comments} post_id={post.id}></CommentSection>
          </div>
        ))}
    </main>
  )
}
