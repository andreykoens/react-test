'use client'

import React, { useCallback, useMemo } from 'react'

import { Button, HStack, Text, Tooltip, VStack } from '@chakra-ui/react'
import { randomDrift } from 'styles/theme'
import { useApi } from 'contexts/Api'

interface IRecordCommentActions {
  commentId: number
  postId: number
  position: 'right' | 'bottom'
}
export const RecordCommentActions = ({
  commentId,
  postId,
  position,
}: IRecordCommentActions): JSX.Element => {
  /*================================ Constants ==============================*/
  const { apiDelete } = useApi()
  /*================================ States ==============================*/

  /*================================ Functions ==============================*/
  const deleteComment = useCallback(() => {
    apiDelete('/comments/remove', { post_id: postId, comment_id: commentId }, () => {
      console.log(postId, commentId)
    })
  }, [apiDelete, commentId, postId])

  /*================================ Effects ==============================*/
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
              // router.push(`/dashboard/posts/edit/${post.id}`)
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
              // deletePost({ post_id: post.id })
            }}
          >
            <Text animation={randomDrift(10, 150 * 60)}>🧨</Text>
          </Button>
        </Tooltip>
      </>
    )
  }, [deleteComment, position])
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
