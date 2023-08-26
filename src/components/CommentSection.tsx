'use client'

import { ContextAuth } from 'contexts/Auth'
import { useRouter } from 'next/navigation'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { IDeleteComment, IRecordComment } from 'types/api'
import { apiDelete, apiGet, apiPost } from 'utils/api'
import { useForm, SubmitHandler } from 'react-hook-form'
import { v4 } from 'uuid'

interface ICommentSection {
  post_id: number
  comments: IRecordComment[] | undefined
}

export const CommentSection: React.FC<ICommentSection> = (props) => {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, logout, user } = useContext(ContextAuth)
  const router = useRouter()
  const { comments, post_id } = props
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
  } = useForm<IRecordComment>()

  /*================================ States ==============================*/
  const [currentComments, setCurrentComments] = useState<IRecordComment[]>([])
  const [showBlock, setShowBlock] = useState<boolean>(false)
  /*================================ Functions ==============================*/
  const getComments = useCallback(() => {
    apiGet('/comments', { post_id }, (data: IRecordComment[]) => {
      setCurrentComments(Object.values(data))
    })
  }, [post_id])
  const deleteComment = useCallback(
    (data: IDeleteComment) => {
      apiDelete('/comments/remove', { post_id: data.post_id, comment_id: data.comment_id }, () => {
        // setCurrentComments((current) => current.filter((c) => c.id !== data.comment_id))
        getComments()
      })
    },
    [getComments]
  )
  const postComment = useCallback(
    (data: IRecordComment) => {
      apiPost(
        '/comments/create',
        {
          post_id: post_id,
          comment: data,
        },
        (data: any) => {
          getComments()
          reset()
        }
      )
    },
    [getComments, post_id, reset]
  )

  const onSubmit: SubmitHandler<any> = (data) => {
    postComment(data)
  }
  /*================================ Effects ==============================*/
  useEffect(() => {
    if (!comments || !isLoaded) return
    setCurrentComments(comments)
  }, [comments, isLoaded])
  /*================================ Render ==============================*/
  if (!props) return <></>
  return (
    <div>
      {currentComments.length > 0 &&
        currentComments.map((comment) => {
          if (!comment) return <React.Fragment key={v4()}></React.Fragment>
          return (
            <p key={`comment-${v4()}`} style={{ border: '1px solid black', padding: '10px' }}>
              user {comment.user_id} says: {comment.content}
              {user && user.id === comment.user_id && (
                <button
                  onClick={() => {
                    if (!comment.id) return
                    deleteComment({ post_id, comment_id: comment.id })
                  }}
                  style={{ float: 'right' }}
                >
                  X
                </button>
              )}
            </p>
          )
        })}

      {/*================== CommentNew =================*/}
      <div>
        <button
          onClick={() => {
            setShowBlock((current) => !current)
          }}
        >
          Leave a comment
        </button>

        {isLogged && showBlock && (
          <div style={{ border: '1px solid black', padding: '10px' }}>
            <h3>Leave a comment</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <input {...register('content', { required: "You can't leave an empty comment" })} />
              {errors.content && <p>{errors.content.message}</p>}
              <br />
              <input type="submit" onClick={handleSubmit(onSubmit)} />
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
