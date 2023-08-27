'use client'

import { ContextAuth } from 'contexts/Auth'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { IRecordCommentDelete, IRecordComment, IResponseError, IResponse } from 'types/api'
import { apiDelete, apiGet, apiPost, apiPut } from 'utils/api'
import { useForm, SubmitHandler } from 'react-hook-form'
import { v4 } from 'uuid'
import { alertError, alertErrorApi } from 'utils/alerts'
import { Box, Button, Center, Flex, SimpleGrid, Text, VStack, keyframes } from '@chakra-ui/react'
import { getRandomBoolean, getRandomFloat, getRandomInt } from 'utils/math'
import { RecordCommentShow } from './RecordCommentShow'

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
  const { isLoaded, isLogged, logout, user, nameIndex } = useContext(ContextAuth)
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
    <Box>
      {allowPost && !isLogged && !showBlock && (
        <Flex justify={'center'}>
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
        </Flex>
      )}

      <Box mt={10}>
        {currentComments.length > 0 &&
          currentComments.map((comment) => {
            if (!comment) return <React.Fragment key={v4()}></React.Fragment>
            return (
              <RecordCommentShow
                key={`comment-${v4()}`}
                {...{
                  Record: comment,
                  EditAction: () => {
                    if (!comment.id) return
                    reset({ ...comment, contentEdit: comment.content })
                    setShowEditComment(true)
                    setShowBlock(false)
                  },
                  DeleteAction: () => {
                    if (!comment.id) return
                    deleteComment({ post_id, comment_id: comment.id })
                  },
                }}
              ></RecordCommentShow>
            )
          })}
      </Box>
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
              <input type="submit" onClick={handleSubmit(onSubmitEdit)} />
            </form>
          </div>
        )}
      </Box>
    </Box>
  )
}
