'use client'

import { ContextAuth } from 'contexts/Auth'
import { useRouter } from 'next/navigation'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { IRecordComment } from 'types/api'

import { useForm, SubmitHandler } from 'react-hook-form'
import { v4 } from 'uuid'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { RecordCommentShow } from './RecordCommentShow'
import { useApi } from 'contexts/Api'

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
  const { isLogged } = useContext(ContextAuth)
  const router = useRouter()
  const { apiGet, apiPost } = useApi()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<IRecordCommentEditable>()

  /*================================ States ==============================*/
  const [currentComments, setCurrentComments] = useState<IRecordCommentEditable[]>([])
  const [showBlock, setShowBlock] = useState<boolean>(false)
  const [showEditComment] = useState<boolean>(false)
  /*================================ Functions ==============================*/
  const getComments = useCallback(() => {
    apiGet<{ post_id: number }, IRecordCommentEditable[]>('/comments', { post_id }, (data) => {
      setCurrentComments(Object.values(data))
    })
  }, [apiGet, post_id])
  // const deleteComment = useCallback(
  //   (data: IRecordCommentDelete) => {
  //     if (!isLogged) return
  //     apiDelete('/comments/remove', { post_id: data.post_id, comment_id: data.comment_id }, () => {
  //       getComments()
  //     })
  //   },
  //   [getComments, isLogged]
  // )
  const postComment = useCallback(
    (props: IRecordCommentEditable) => {
      if (!isLogged) return
      apiPost(
        '/comments/create',
        {
          post_id: post_id,
          comment: props,
        },
        () => {
          getComments()
          reset()
        }
      )
    },
    [apiPost, getComments, isLogged, post_id, reset]
  )

  const onSubmitCommentNew: SubmitHandler<IRecordComment> = (data) => {
    postComment(data)
    onClose()
  }
  /*================================ Effects ==============================*/
  useEffect(() => {
    if (!comments) return
    setCurrentComments(comments)
  }, [comments])
  /*================================ Render ==============================*/
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
            onClick={(e) => {
              e.stopPropagation()
              onOpen()
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
          </div>
        )}
      </div>

      {/*================== CommentEdit =================*/}

      <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
        <ModalOverlay background={'rgba(255,255,255,0.85)'} zIndex={20} />
        <ModalContent borderRadius={30}>
          <ModalHeader fontSize={'xx-large'} textAlign={'center'} fontWeight={300}>
            Novo comentário
          </ModalHeader>
          <ModalCloseButton />
          <form onSubmit={(e) => e.preventDefault()}>
            <ModalBody>
              <FormControl isInvalid={!!errors.content}>
                <Textarea
                  size={'lg'}
                  placeholder="Comentário"
                  {...register('content', {
                    required: 'Por favor, escreva um comentário',
                    minLength: {
                      value: 15,
                      message: 'Inclua pelo menos 15 caracteres',
                    },
                  })}
                />
                <FormErrorMessage>{errors.content && errors.content.message}</FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                type="submit"
                borderRadius={25}
                mb={2}
                onClick={handleSubmit(onSubmitCommentNew)}
                w={'full'}
              >
                Publicar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  )
}
