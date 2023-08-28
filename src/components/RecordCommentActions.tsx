'use client'

import React, { useCallback, useEffect, useMemo } from 'react'

import {
  Button,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  Modal,
  VStack,
  useDisclosure,
  FormControl,
  FormErrorMessage,
  Textarea,
} from '@chakra-ui/react'
import { randomDrift } from 'styles/theme'
import { useApi } from 'contexts/Api'
import { usePersistent } from 'contexts/Persistent'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IRecordComment } from 'types/api'
import { usePathname } from 'next/navigation'

interface IRecordCommentActions {
  commentId: number
  postId: number
  position: 'right' | 'bottom'
  comment: IRecordComment
}
interface IRecordCommentEditable extends IRecordComment {
  contentEdit?: string
}

export const RecordCommentActions = ({
  commentId,
  postId,
  position,
  comment,
}: IRecordCommentActions): JSX.Element => {
  /*================================ Constants ==============================*/
  const { apiDelete, apiPut } = useApi()
  const pathname = usePathname()
  const { updatePosts } = usePersistent()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<IRecordCommentEditable>()

  /*================================ States ==============================*/
  /*================================ Functions ==============================*/
  const deleteComment = useCallback(() => {
    apiDelete('/comments/remove', { post_id: postId, comment_id: commentId }, () => {
      updatePosts()
      if (!pathname.includes('dashboard')) window.location = window.location
    })
  }, [apiDelete, commentId, pathname, postId, updatePosts])

  const handleRecordCommentUpdate = useCallback(
    (id: number, props: IRecordComment) => {
      apiPut(
        '/comments/update',
        { post_id: postId, comment_id: commentId, comment: { content: props.content } },
        () => {
          reset()
          updatePosts()
          if (!pathname.includes('dashboard')) window.location = window.location
        }
      )
    },
    [apiPut, commentId, pathname, postId, reset, updatePosts]
  )

  const onSubmitCommentEdit: SubmitHandler<IRecordCommentEditable> = useCallback(
    (data) => {
      handleRecordCommentUpdate(data.id, data)
      onClose()
      reset()
    },
    [handleRecordCommentUpdate, onClose, reset]
  )
  /*================================ Effects ==============================*/
  useEffect(() => {
    reset(comment)
  }, [comment, reset])
  /*================================ Memos ==============================*/
  const actionButtons = useMemo(() => {
    return (
      <>
        <Tooltip
          hasArrow
          label={'Editar'}
          placement={position === 'bottom' ? 'top' : 'left'}
          bg={'#626060'}
          borderRadius={25}
          color={'white'}
          px={6}
          py={4}
        >
          <Button
            variant={'solid'}
            size={'sm'}
            borderRadius={25}
            fontSize={30}
            mb={2}
            h={6}
            p={0}
            w={6}
            background={'#efefef'}
            _hover={{ background: '#fff' }}
            onClick={(e) => {
              e.stopPropagation()
              onOpen()
            }}
          >
            <Text animation={randomDrift(10, 150 * 60)}>✏️</Text>
          </Button>
        </Tooltip>
        <Tooltip
          hasArrow
          label={'Excluir'}
          placement={position === 'bottom' ? 'top' : 'left'}
          bg={'#cb6751'}
          borderRadius={25}
          color={'white'}
          px={6}
          py={4}
        >
          <Button
            variant={'solid'}
            size={'sm'}
            borderRadius={25}
            fontSize={30}
            mb={2}
            h={6}
            p={0}
            w={6}
            background={'#efefef'}
            _hover={{ background: '#fff' }}
            onClick={(e) => {
              e.stopPropagation()
              deleteComment()
            }}
          >
            <Text animation={randomDrift(10, 150 * 60)}>🧨</Text>
          </Button>
        </Tooltip>

        <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset="slideInBottom">
          <ModalOverlay background={'rgba(255,255,255,0.85)'} zIndex={20} />
          <ModalContent borderRadius={30}>
            <ModalHeader fontSize={'xx-large'} textAlign={'center'} fontWeight={300}>
              Editar comentário
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
                  onClick={handleSubmit(onSubmitCommentEdit)}
                  w={'full'}
                >
                  Publicar
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </>
    )
  }, [
    deleteComment,
    errors.content,
    handleSubmit,
    isOpen,
    onClose,
    onOpen,
    onSubmitCommentEdit,
    position,
    register,
  ])
  /*================================ Render ==============================*/
  if (position === 'right')
    return (
      <VStack position={'absolute'} top={6} right={-4}>
        {actionButtons}
      </VStack>
    )
  if (position === 'bottom')
    return (
      <HStack position={'absolute'} bottom={-4} left={0} width={'full'} justify={'center'}>
        {actionButtons}
      </HStack>
    )
  return <></>
}
