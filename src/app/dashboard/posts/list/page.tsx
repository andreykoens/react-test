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
  VStack,
} from '@chakra-ui/react'
import { EmptyList } from 'components/EmptyList'

export default function DashboardPostsList() {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, logout, user } = useContext(ContextAuth)
  const router = useRouter()
  /*================================ States ==============================*/
  const [recordsPosts, setRecordsPosts] = useState<any>(null)

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

  if (recordsPosts && recordsPosts.length === 0) return
  ;<Flex flexGrow={1} justify={'center'} alignItems={'center'} flexDirection={'column'} h={'100%'}>
    <EmptyList></EmptyList>
  </Flex>
  return (
    <SimpleGrid columns={2} gap={10} flexGrow={1} h={'100%'} pt={0}>
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
            <Box>
              <Heading mb={5}>
                <Link href={`/dashboard/posts/edit/${post.id}`}>{post.title}</Link>
              </Heading>
              <Text>{post.content && post.content.substring(0, 100)}...</Text>
            </Box>
            <Box width={'80px'}>
              <Button
                mb={6}
                onClick={() => {
                  router.push(`/dashboard/posts/edit/${post.id}`)
                }}
              >
                Editar
              </Button>
              <Button
                onClick={() => {
                  deletePost({ post_id: post.id })
                }}
              >
                Excluir
              </Button>
            </Box>
          </HStack>
        ))}
    </SimpleGrid>
  )
}
