'use client'

import { ContextAuth } from 'contexts/Auth'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { IRecordCommentDelete, IRecordComment, IResponseError, IResponse } from 'types/api'
import { apiDelete, apiGet, apiPost, apiPut } from 'utils/api'
import { useForm, SubmitHandler } from 'react-hook-form'
import { v4 } from 'uuid'
import { alertError, alertErrorApi } from 'utils/alerts'

interface ICommentSection {
  post_id: number
  comments: IRecordComment[] | undefined
  allowPost: boolean
}
interface IRecordCommentEditable extends IRecordComment {
  contentEdit: string
}

export const CommentSection: React.FC<ICommentSection> = (props) => {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, logout, user } = useContext(ContextAuth)
  const router = useRouter()
  const { comments, post_id, allowPost } = props
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<IRecordCommentEditable>()

  /*================================ States ==============================*/
  const [currentComments, setCurrentComments] = useState<IRecordCommentEditable[]>([])
  const [showBlock, setShowBlock] = useState<boolean>(false)
  const [showEditComment, setShowEditComment] = useState<boolean>(false)
  /*================================ Functions ==============================*/
  const getComments = useCallback(() => {
    apiGet('/comments', { post_id }, (data: IRecordCommentEditable[]) => {
      setCurrentComments(Object.values(data))
    })
  }, [post_id])
  const deleteComment = useCallback(
    (data: IRecordCommentDelete) => {
      if (!isLogged) return
      apiDelete('/comments/remove', { post_id: data.post_id, comment_id: data.comment_id }, () => {
        getComments()
      })
    },
    [getComments, isLogged]
  )
  const putComment = useCallback(
    (id: number, data: IRecordCommentEditable) => {
      if (!isLogged) return
      window.FakerApi.put('/comments/update', {
        post_id: post_id,
        comment_id: id,
        comment: data,
      })
        .catch((err: IResponseError) => {
          alertError(err)
        })
        .then((response: IResponse<IRecordCommentEditable>) => {
          if (!response) {
            alertErrorApi()
            return
          }
          getComments()
          reset()
        })
    },
    [getComments, isLogged, post_id, reset]
  )
  const postComment = useCallback(
    (data: IRecordCommentEditable) => {
      if (!isLogged) return
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
    [getComments, isLogged, post_id, reset]
  )

  const onSubmitNew: SubmitHandler<any> = (data) => {
    postComment(data)
  }
  const onSubmitEdit: SubmitHandler<any> = (data) => {
    data.content = data.contentEdit
    putComment(data.id, data)
    setShowEditComment(false)
    reset()
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
            <div
              key={`comment-${v4()}`}
              style={{ border: '1px solid black', padding: '10px', margin: '0 0 10px 0' }}
            >
              {/* Todo: for comments to make sense, we need to know who posted... */}
              user {comment.user_id} says: {comment.content}
              {user && user.id === comment.user_id && (
                <div style={{ float: 'right' }}>
                  <button
                    onClick={() => {
                      if (!comment.id) return
                      reset({ ...comment, contentEdit: comment.content })
                      setShowEditComment(true)
                      setShowBlock(false)
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (!comment.id) return
                      deleteComment({ post_id, comment_id: comment.id })
                    }}
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          )
        })}

      {/*================== CommentNew =================*/}

      <div>
        {allowPost && isLogged && !showBlock && !showEditComment && (
          <button
            onClick={() => {
              setShowBlock((current) => !current)
            }}
          >
            Leave a comment
          </button>
        )}

        {allowPost && !isLogged && !showBlock && (
          <>
            <button
              onClick={() => {
                router.push('/login')
              }}
            >
              Log in to leave a comment
            </button>
          </>
        )}
        {allowPost && isLogged && showBlock && (
          <div style={{ border: '1px solid black', padding: '10px' }}>
            <button
              onClick={() => {
                setShowBlock((current) => !current)
              }}
              style={{ float: 'right' }}
            >
              Cancelar
            </button>

            <h3>Leave a comment</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <input {...register('content', { required: "You can't leave an empty comment" })} />
              {errors.content && <p>{errors.content.message}</p>}
              <br />
              <input type="submit" onClick={handleSubmit(onSubmitNew)} />
            </form>
          </div>
        )}
      </div>

      {/*================== CommentEdit =================*/}

      <div>
        {isLogged && showEditComment && (
          <div style={{ border: '1px solid black', padding: '10px' }}>
            <button
              onClick={() => {
                setShowEditComment(false)
                reset()
              }}
              style={{ float: 'right' }}
            >
              Cancel
            </button>

            <h3>Edit comment</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                {...register('contentEdit', { required: "You can't leave an empty comment" })}
              />
              {errors.content && <p>{errors.content.message}</p>}
              <br />
              <input type="submit" onClick={handleSubmit(onSubmitEdit)} />
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
