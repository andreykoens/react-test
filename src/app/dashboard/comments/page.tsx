'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiDelete, apiPost } from 'utils/api'
import { IRecordPost, IRecordPostDelete } from 'types/api'
import { v4 } from 'uuid'
import { CommentSection } from 'components/CommentSection'

export default function DashboardCommentsList() {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, logout, user } = useContext(ContextAuth)
  const router = useRouter()
  /*================================ States ==============================*/
  const [recordsPosts, setRecordsPosts] = useState<any>(null)

  /*================================ Functions ==============================*/
  const getPosts = useCallback(() => {
    if (!user) return
    apiPost('/posts', {}, (data: Record<string | number, IRecordPost>) => {
      delete data['message']
      const posts = Object.values(data)
      setRecordsPosts(posts)
    })
  }, [user])

  const deletePost = useCallback(
    (data: IRecordPostDelete) => {
      if (!isLogged) return
      apiDelete('/posts/remove', { post_id: data.post_id }, () => {
        getPosts()
      })
    },
    [getPosts, isLogged]
  )

  /*================================ Effects ==============================*/
  useEffect(() => {
    if (!isLoaded) return
    if (isLoaded && !isLogged) {
      router.push('/')
    }
    getPosts()
  }, [getPosts, isLoaded, isLogged, router])

  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  if (!user) return <></>
  return (
    <main>
      {/*================== POSTS =================*/}
      {recordsPosts && recordsPosts.length === 0 && (
        <div>
          No posts yet. <Link href={'/dashboard/posts/new'}>Start now</Link>
        </div>
      )}
      {recordsPosts &&
        recordsPosts.map((post: IRecordPost) => (
          <div
            key={`post-${v4()}`}
            style={{ border: '1px solid black', padding: '10px', margin: '0 0 10px 0' }}
          >
            <h2>
              <Link href={`/dashboard/posts/edit/${post.id}`}>{post.title}</Link>
            </h2>
            <p>{post.content.substring(0, 100)}...</p>
            {post && post.id && post.comments && (
              <CommentSection
                post_id={post.id}
                comments={post.comments.filter((p) => p.user_id === user.id)}
                allowPost={false}
              ></CommentSection>
            )}
          </div>
        ))}
    </main>
  )
}
