'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import { useRouter } from 'next/navigation'

import { IRecordPost, IRecordPostDelete } from 'types/api'
import { v4 } from 'uuid'
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Link,
  SimpleGrid,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { EmptyList } from 'components/EmptyList'
import { randomDrift } from 'styles/theme'
import { useApi } from 'contexts/Api'
import { usePersistent } from 'contexts/Persistent'

export default function DashboardPostsList() {
  /*================================ Constants ==============================*/
  const { isLogged, user } = useContext(ContextAuth)
  const router = useRouter()
  const { apiGet, apiDelete } = useApi()
  const { updatePosts } = usePersistent()
  /*================================ States ==============================*/
  const [recordsPosts, setRecordsPosts] = useState<IRecordPost[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  /*================================ Functions ==============================*/
  const getPosts = useCallback(() => {
    if (!user) return
    apiGet<unknown, Record<string | number, IRecordPost>>('/posts', {}, (data) => {
      const posts = Object.values(data).filter((p) => p.user_id === user.id)
      setRecordsPosts(posts)
      setIsLoading(false)
    })
  }, [apiGet, user])

  const deletePost = useCallback(
    (data: IRecordPostDelete) => {
      if (!isLogged) return
      apiDelete('/posts/remove', { post_id: data.post_id }, () => {
        getPosts()
      })
    },
    [apiDelete, getPosts, isLogged]
  )

  /*================================ Effects ==============================*/
  useEffect(() => {
    setIsLoading(true)
    getPosts()
    updatePosts()
  }, [getPosts, isLogged, router, updatePosts])

  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/

  if (!isLoading && recordsPosts && recordsPosts.length === 0) {
    return (
      <Flex
        flexGrow={1}
        justify={'center'}
        alignItems={'center'}
        flexDirection={'column'}
        h={'100%'}
      >
        <EmptyList></EmptyList>
      </Flex>
    )
  }
  return (
    <SimpleGrid columns={2} gap={10} flexGrow={1} pt={0}>
      {/*================== POSTS =================*/}
      {recordsPosts &&
        recordsPosts.map((post: IRecordPost) => (
          <HStack
            key={`post-${v4()}`}
            w={'full'}
            bg={'#f6f6f6'}
            borderRadius={30}
            p={10}
            align={'flex-start'}
          >
            <Box pr={10}>
              <Heading size={'lg'} mb={5}>
                <Link href={`/dashboard/posts/edit/${post.id}`}>{post.title}</Link>
              </Heading>
              <Text>{post.content && post.content.substring(0, 100)}...</Text>
            </Box>
            <Box width={'80px'}>
              <Tooltip
                hasArrow
                label={'Editar'}
                placement={'left'}
                bg={'#626060'}
                borderRadius={25}
                color={'white'}
                px={6}
                py={4}
              >
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  borderRadius={25}
                  fontSize={30}
                  mb={4}
                  _hover={{ background: '#fff' }}
                  onClick={() => {
                    router.push(`/dashboard/posts/edit/${post.id}`)
                  }}
                >
                  <Text animation={randomDrift(10, 150 * 60)}>✏️</Text>
                </Button>
              </Tooltip>
              <Tooltip
                hasArrow
                label={'Excluir'}
                placement={'left'}
                bg={'#cb6751'}
                borderRadius={25}
                color={'white'}
                px={6}
                py={4}
              >
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  borderRadius={25}
                  fontSize={30}
                  mb={4}
                  _hover={{ background: '#fff' }}
                  onClick={() => {
                    deletePost({ post_id: post.id })
                  }}
                >
                  <Text animation={randomDrift(10, 150 * 60)}>🧨</Text>
                </Button>
              </Tooltip>
            </Box>
          </HStack>
        ))}
    </SimpleGrid>
  )
}
