'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import { useRouter } from 'next/navigation'
import { apiPost } from 'utils/api'
import { IRecordPost } from 'types/api'
import { v4 } from 'uuid'
import { Box, Flex, HStack, Heading, SimpleGrid, Text, VStack, Link } from '@chakra-ui/react'
import { RecordCommentActions } from 'components/RecordCommentActions'

export default function DashboardCommentsList() {
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
      const allPosts = Object.values(data)
      const posts = allPosts.filter((post) => {
        if (!('comments' in post) || post.comments.length <= 0) return false
        post.comments = post.comments.filter((comment) => {
          return comment.user_id === user.id
        })
        return post.comments.length > 0
      })
      setRecordsPosts(posts)
    })
  }, [user])

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
  if (!user) return <></>
  if (recordsPosts && recordsPosts.length === 0) {
    return (
      <Flex
        flexGrow={1}
        justify={'center'}
        alignItems={'center'}
        flexDirection={'column'}
        h={'100%'}
      >
        <Heading fontWeight={300}>
          Nenhum comentário. Que tal comentar{' '}
          <Link href={'/'} opacity={0.85}>
            algum post
          </Link>
          ?
        </Heading>
      </Flex>
    )
  }
  return (
    <VStack gap={6}>
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
            <Box pr={10} width={'300px'} flexShrink={0}>
              <Heading size={'md'} mb={5}>
                {post.user_id === user.id && (
                  <Link href={`/dashboard/posts/edit/${post.id}`}>{post.title}</Link>
                )}
                {post.user_id !== user.id && post.title}
              </Heading>
              <Text fontSize={14}>{post.content && post.content.substring(0, 100)}...</Text>
            </Box>
            <SimpleGrid columns={3} gap={10} pt={0} flexGrow={1}>
              {post &&
                post.id &&
                post.comments &&
                post.comments.map((comment) => (
                  <Box
                    key={v4()}
                    background={'#fff'}
                    p={10}
                    borderRadius={25}
                    position={'relative'}
                  >
                    {comment.content}
                    <RecordCommentActions
                      commentId={comment.id}
                      postId={post.id}
                      position={'right'}
                    ></RecordCommentActions>
                  </Box>
                ))}
            </SimpleGrid>
          </HStack>
        ))}
    </VStack>
  )
}
