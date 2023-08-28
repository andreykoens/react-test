'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { IRecordPost } from 'types/api'
import { useAuth } from './Auth'
import { useApi } from './Api'

interface IContextPersistent {
  currentCommentsAmount: number
  currentPostsAmount: number
  updatePosts(): void
  posts: IRecordPost[]
}

interface FCProps {
  children: React.ReactNode
}

export const ContextPersistent = createContext({} as IContextPersistent)

export const ContextPersistentProvider: React.FC<FCProps> = ({
  children,
}: {
  children: React.ReactNode
}) => {
  /*================================ Constants ==============================*/
  const { apiGet } = useApi()
  const { user } = useAuth()
  /*================================ States ==============================*/
  const [currentCommentsAmount, setCurrentCommentsAmout] = useState<number>(0)
  const [currentPostsAmount, setCurrentPostsAmout] = useState<number>(0)
  const [posts, setPosts] = useState<IRecordPost[]>([])
  /*================================ Functions ==============================*/
  const getPosts = useCallback(() => {
    if (!user) return
    apiGet<unknown, Record<string | number, IRecordPost>>('/posts', {}, (data) => {
      let newCommentsAmount = 0
      let newPostsAmount = 0
      const posts = Object.values(data)
      setPosts(posts)
      posts.forEach((post) => {
        if (post.user_id === user.id) newPostsAmount++
        if (post.comments) {
          post.comments.forEach((comment) => {
            if (comment.user_id === user.id) newCommentsAmount++
          })
        }
        setCurrentCommentsAmout(newCommentsAmount)
        setCurrentPostsAmout(newPostsAmount)
      }, [])
    })
  }, [apiGet, user])

  const updatePosts = useCallback(() => {
    getPosts()
  }, [getPosts])
  /*================================ Effects ==============================*/
  useEffect(() => {
    getPosts()
  }, [getPosts])
  /*================================ Memos ==============================*/
  const contextPersistentValue: IContextPersistent = useMemo(
    () => ({
      currentCommentsAmount,
      currentPostsAmount,
      updatePosts,
      posts,
    }),
    [currentCommentsAmount, currentPostsAmount, posts, updatePosts]
  )

  /*================================ Render ==============================*/
  return (
    <ContextPersistent.Provider value={contextPersistentValue}>
      {children}
    </ContextPersistent.Provider>
  )
}

export function usePersistent() {
  const context = useContext(ContextPersistent)
  return context
}
