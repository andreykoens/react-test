'use client'

import React, { useCallback, useEffect } from 'react'

import { IRecordPost } from 'types/api'
import { useParams, useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { useApi } from 'contexts/Api'

export default function DashboardPostsUpdate() {
  /*================================ Constants ==============================*/

  const { apiGet, apiPut } = useApi()
  const router = useRouter()
  const params = useParams()
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IRecordPost>()

  /*================================ States ==============================*/

  /*================================ Functions ==============================*/

  const getPost = useCallback(() => {
    apiGet<{ post_id: number }, IRecordPost>(
      '/posts/view',
      { post_id: Number(params.id) },
      (data: IRecordPost) => {
        reset(data)
      }
    )
  }, [apiGet, params.id, reset])

  const handleRecordPostUpdate = useCallback(
    (props: IRecordPost) => {
      apiPut('/posts/update', { post_id: props.id, post: { ...props } }, () => {
        router.push('/dashboard/posts/list')
      })
    },
    [apiPut, router]
  )

  const onSubmit: SubmitHandler<IRecordPost> = (data) => {
    handleRecordPostUpdate(data)
  }
  /*================================ Effects ==============================*/
  useEffect(() => {
    getPost()
  }, [getPost, router])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  return (
    <Flex
      id={'RegisterPostNew'}
      h={'100%'}
      w={'100%'}
      flexDirection={'column'}
      justify={'center'}
      align={'center'}
    >
      <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: '700px', width: '100%' }}>
        <VStack gap={6} h={'100%'} maxW={'700px'} w={'100%'} margin={'0 auto'}>
          <FormControl isInvalid={!!errors.title}>
            <Input
              size={'lg'}
              placeholder="Título da postagem"
              {...register('title', {
                required: 'O título é obrigatório',
                minLength: { value: 15, message: 'Você precisa utilizar pelo menos 15 caracteres' },
                maxLength: { value: 100, message: 'O limite de 100 caracteres foi excedido' },
              })}
            />
            <FormErrorMessage>{errors.title && errors.title.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.content} flexGrow={1}>
            <Textarea
              h={'100%'}
              size={'lg'}
              placeholder="Conteúdo"
              rows={10}
              {...register('content', {
                required: 'Você precisa incluir o conteúdo',
                minLength: {
                  value: 260,
                  message: 'Você precisa utilizar pelo menos 250 caracteres',
                },
              })}
            />
            <FormErrorMessage>{errors.content && errors.content.message}</FormErrorMessage>
          </FormControl>
          <Box textAlign={'right'} w={'100%'}>
            <Button type="submit" onClick={handleSubmit(onSubmit)}>
              Postar
            </Button>
          </Box>
        </VStack>
      </form>
    </Flex>
  )
}
