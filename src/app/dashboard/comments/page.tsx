'use client'

import React, { useContext, useEffect, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import { useRouter } from 'next/navigation'

import { IRecordPost } from 'types/api'
import { v4 } from 'uuid'
import { Box, Flex, HStack, Heading, SimpleGrid, Text, VStack, Link } from '@chakra-ui/react'
import { RecordCommentActions } from 'components/RecordCommentActions'
import { usePersistent } from 'contexts/Persistent'

export default function DashboardCommentsList() {
  /*================================ Constants ==============================*/
  const { isLogged, user } = useContext(ContextAuth)
  const router = useRouter()
  const { posts, updatePosts } = usePersistent()
  /*================================ States ==============================*/
  const [filteredComments, setFilteredComments] = useState<IRecordPost[]>([])
  /*================================ Functions ==============================*/

  /*================================ Effects ==============================*/
  useEffect(() => {
    updatePosts()
  }, [isLogged, router, updatePosts])

  useEffect(() => {
    const newFilteredComments = []
    posts.forEach((post) => {
      const filteredPostComments = []
      if (post.comments) {
        post.comments.forEach((comment) => {
          if (comment.user_id === user.id) filteredPostComments.push(comment)
        })
        delete post['comments']

        if (filteredPostComments.length > 0) {
          newFilteredComments.push({
            ...post,
            comments: filteredPostComments,
          })
        }
      }
      setFilteredComments(newFilteredComments)
    }, [])
  }, [posts, user])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/

  if (!filteredComments || (filteredComments && filteredComments.length === 0)) {
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
      {filteredComments &&
        filteredComments.map((post: IRecordPost) => (
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
                      comment={comment}
                    ></RecordCommentActions>
                  </Box>
                ))}
            </SimpleGrid>
          </HStack>
        ))}
    </VStack>
  )
}
