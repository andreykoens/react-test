'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiPost } from 'utils/api'
import { IRecordPost } from 'types/api'
import { CommentSection } from 'components/CommentSection'
import { v4 } from 'uuid'
import { EmptyList } from 'components/EmptyList'
import { Box, HStack, Heading, Text, VStack, keyframes } from '@chakra-ui/react'
import { getRandom, randomDrift } from 'styles/theme'

export default function Home() {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, logout, user, nameIndex } = useContext(ContextAuth)
  const router = useRouter()
  /*================================ States ==============================*/
  const [recordsPosts, setRecordsPosts] = useState<any>(null)

  /*================================ Functions ==============================*/
  const getPosts = useCallback(() => {
    apiPost('/posts', {}, (data: Record<string | number, IRecordPost>) => {
      delete data['message']
      setRecordsPosts(Object.values(data))
    })
  }, [])

  /*================================ Effects ==============================*/
  useEffect(() => {
    if (!isLoaded) return
    getPosts()
    // ListaComments()
  }, [getPosts, isLoaded])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  return (
    <Box>
      {/*================== POSTS =================*/}
      {recordsPosts && recordsPosts.length === 0 && <EmptyList></EmptyList>}
      <VStack mt={200}>
        {recordsPosts && (
          <>
            {recordsPosts.map((post: IRecordPost) => (
              <Box key={`post-${v4()}`} p={6} mb={100} textAlign={'center'}>
                <Box mt={100}>
                  <Heading
                    as={'span'}
                    size={'xl'}
                    fontWeight={300}
                    opacity={0.8}
                    borderBottom={'1px solid black'}
                    transition={'all 150ms ease-in-out'}
                    transform={`translateX(${getRandom(-100, 100)}px)`}
                    _hover={{ textShadow: `0 3px 5px rgba(0,0,0,0.35)` }}
                  >
                    <Link href={`/post/${post.id}`}>{post.title}</Link>
                  </Heading>
                </Box>
                <Box
                  transform={`rotate(${Math.random() * 5}deg)`}
                  animation={`${keyframes`${randomDrift(20)}`} infinite 150s linear`}
                  opacity={0.9}
                  fontWeight={600}
                >
                  {nameIndex.find((e) => e.id === post.user_id).name}
                </Box>
                <Box
                  mx={32}
                  my={20}
                  fontSize={30}
                  fontWeight={200}
                  lineHeight={'2em'}
                  textAlign={'center'}
                  display={'block'}
                >
                  {post.content}
                </Box>
                {post.id && (
                  <CommentSection
                    comments={post.comments}
                    post_id={post.id}
                    allowPost={true}
                  ></CommentSection>
                )}
              </Box>
            ))}
          </>
        )}
        {recordsPosts && recordsPosts.length > 0 && (
          <Heading fontWeight={100} fontSize={80} my={24} opacity={0.2}>
            fim dos posts
          </Heading>
        )}
      </VStack>
    </Box>
  )
}
