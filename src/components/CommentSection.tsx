'use client'

import { ContextAuth } from 'contexts/Auth'
import { useRouter } from 'next/navigation'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { IRecordComment, IResponseError, IResponse } from 'types/api'
import { apiGet, apiPost } from 'utils/api'
import { useForm, SubmitHandler } from 'react-hook-form'
import { v4 } from 'uuid'
import { alertError, alertErrorApi } from 'utils/alerts'
import { Box, Button } from '@chakra-ui/react'
import { RecordCommentShow } from './RecordCommentShow'

interface ICommentSection {
  post_id: number
  comments: IRecordComment[] | undefined
  allowPost: boolean
}
interface IRecordCommentEditable extends IRecordComment {
  contentEdit?: string
}

export const CommentSection = ({ comments, post_id, allowPost }: ICommentSection): JSX.Element => {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged } = useContext(ContextAuth)
  const router = useRouter()
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
  // const deleteComment = useCallback(
  //   (data: IRecordCommentDelete) => {
  //     if (!isLogged) return
  //     apiDelete('/comments/remove', { post_id: data.post_id, comment_id: data.comment_id }, () => {
  //       getComments()
  //     })
  //   },
  //   [getComments, isLogged]
  // )
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
        () => {
          getComments()
          reset()
        }
      )
    },
    [getComments, isLogged, post_id, reset]
  )

  const onSubmitCommentNew: SubmitHandler<IRecordComment> = (data) => {
    postComment(data)
  }
  const onSubmitCommentEdit: SubmitHandler<IRecordCommentEditable> = (data) => {
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
  if (!isLoaded) return <></>
  return (
    <Box>
      <Box textAlign={'center'}>
        {allowPost && !isLogged && !showBlock && (
          <Button
            px={10}
            py={6}
            background={`#eaeaea`}
            borderRadius={50}
            fontWeight={500}
            onClick={() => {
              router.push('/login')
            }}
          >
            Entre para comentar 📝
          </Button>
        )}
        {allowPost && isLogged && !showBlock && !showEditComment && (
          <Button
            px={10}
            py={6}
            background={`#eaeaea`}
            borderRadius={50}
            fontWeight={500}
            onClick={() => {
              setShowBlock((current) => !current)
            }}
          >
            Deixe seu comentário ✏️
          </Button>
        )}
      </Box>

      <Box mt={10}>
        {currentComments.length > 0 &&
          currentComments.map((comment) => {
            if (!comment) return <React.Fragment key={v4()}></React.Fragment>
            return (
              <RecordCommentShow key={v4()} postId={post_id} Record={comment}></RecordCommentShow>
            )
          })}
      </Box>
      {/*================== CommentNew =================*/}

      <div>
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
              <input type="submit" onClick={handleSubmit(onSubmitCommentNew)} />
            </form>
          </div>
        )}
      </div>

      {/*================== CommentEdit =================*/}

      <Box>
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
              <input type="submit" onClick={handleSubmit(onSubmitCommentEdit)} />
            </form>
          </div>
        )}
      </Box>
    </Box>
  )
}
