'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import { useRouter } from 'next/navigation'
import { apiDelete, apiPost } from 'utils/api'
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

export default function DashboardPostsList() {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, user } = useContext(ContextAuth)
  const router = useRouter()
  /*================================ States ==============================*/
  const [recordsPosts, setRecordsPosts] = useState<IRecordPost[]>([])

  /*================================ Functions ==============================*/
  const getPosts = useCallback(() => {
    if (!user) return
    apiPost('/posts', {}, (data: Record<string | number, IRecordPost>) => {
      delete data['message']
      const posts = Object.values(data).filter((p) => p.user_id === user.id)
      setRecordsPosts(posts)
    })
  }, [user])

  const deletePost = useCallback(
    (data: IRecordPostDelete) => {
      if (!isLogged) return
      apiDelete('/posts/remove', { post_id: data.post_id }, () => {
        getPosts()
      })
    },
    [getPosts, isLogged]
  )

  /*================================ Effects ==============================*/
  useEffect(() => {
    if (!isLoaded) return
    if (isLoaded && !isLogged) {
      router.push('/')
    }
    getPosts()
  }, [getPosts, isLoaded, isLogged, router])

  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/

  if (recordsPosts && recordsPosts.length === 0) {
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
      {recordsPosts && recordsPosts.length === 0 && <EmptyList></EmptyList>}
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
