'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Flex, HStack, Heading, Text, Tooltip, VStack } from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'

import { IRecordPost } from 'types/api'
import { ContextAuth } from 'contexts/Auth'
import { SeedByUserComments, SeedByUserPosts } from 'utils/seed'
import { randomDrift } from 'styles/theme'
import { WipeByUserComments, WipeByUserPosts } from 'utils/wipe'
import { useApi } from 'contexts/Api'

export default function TemplateDashboard({ children }) {
  /*================================ Constants ==============================*/
  const router = useRouter()
  const pathname = usePathname()
  const { apiGet } = useApi()
  const { isLoaded, isLogged, user } = useContext(ContextAuth)
  /*================================ States ==============================*/
  const [currentCommentsAmount, setCurrentCommentsAmout] = useState<number>(0)
  const [currentPostsAmount, setCurrentPostsAmout] = useState<number>(0)
  /*================================ Functions ==============================*/
  const getPosts = useCallback(() => {
    if (!user) return
    apiGet<unknown, Record<string | number, IRecordPost>>('/posts', {}, (data) => {
      let newCommentsAmount = 0
      let newPostsAmount = 0
      Object.values(data).forEach((post) => {
        if (post.user_id === user.id) newPostsAmount++
        if (post.comments) {
          post.comments.forEach((comment) => {
            if (comment.user_id === user.id) newCommentsAmount++
          })
        }
        setCurrentCommentsAmout(newCommentsAmount)
        setCurrentPostsAmout(newPostsAmount)
      }, [])
    })
  }, [apiGet, user])
  /*================================ Effects ==============================*/
  useEffect(() => {
    if (!isLoaded) return
    if (isLogged == false) router.push('/')
    getPosts()
  }, [getPosts, isLoaded, isLogged, router])
  /*================================ Render ==============================*/
  return (
    <Flex
      id={'TemplateDashboardWrap'}
      direction={'row'}
      flexGrow={1}
      position={'relative'}
      px={6}
      pt={10}
      zIndex={100}
    >
      <Box id={'TemplateDashboardContent'} px={6} flexGrow={1}>
        {children}
      </Box>
      <Flex
        id={'TemplateDashboardSidebar'}
        width={'300px'}
        direction={'column'}
        px={6}
        background={'#f6f6f6'}
        borderRadius={50}
        minW={300}
      >
        <Heading mt={10} textAlign={'center'} fontWeight={300}>
          Dashboard
        </Heading>
        <VStack gap={6} mt={10} position={'sticky'} top={200}>
          <Button
            w={'full'}
            background={'white'}
            borderRadius={25}
            onClick={() => {
              router.push('/dashboard/posts/new')
            }}
          >
            Novo Post
          </Button>
          <Tooltip
            hasArrow
            label={'Seed'}
            placement={'left'}
            bg={'#7b6c19'}
            borderRadius={25}
            color={'white'}
            px={6}
            py={4}
          >
            <HStack background={'#fff'} w={'full'} borderRadius={25} px={4} position={'relative'}>
              <Text
                flexGrow={0}
                width={0}
                fontSize={30}
                animation={randomDrift(7, 150 * 60)}
                position={'absolute'}
                left={-4}
              >
                🍃
              </Text>
              <Button
                variant={'ghost'}
                borderRadius={25}
                flexGrow={1}
                onClick={() => {
                  SeedByUserPosts(user.id)
                }}
              >
                Posts
              </Button>
              <Button
                variant={'ghost'}
                borderRadius={25}
                flexGrow={1}
                onClick={() => {
                  SeedByUserComments(user.id)
                }}
              >
                Comentários
              </Button>
            </HStack>
          </Tooltip>
          <Tooltip
            hasArrow
            label={'Wipe'}
            placement={'left'}
            bg={'#cb6751'}
            borderRadius={25}
            color={'white'}
            px={6}
            py={4}
          >
            <HStack background={'#fff'} w={'full'} borderRadius={25} px={4} position={'relative'}>
              <Text
                flexGrow={0}
                width={0}
                fontSize={30}
                animation={randomDrift(7, 150 * 60)}
                position={'absolute'}
                left={-4}
              >
                💥
              </Text>
              <Button
                variant={'ghost'}
                borderRadius={25}
                flexGrow={1}
                onClick={() => {
                  WipeByUserPosts(user.id)
                }}
              >
                Posts
              </Button>
              <Button
                variant={'ghost'}
                borderRadius={25}
                flexGrow={1}
                onClick={() => {
                  WipeByUserComments(user.id)
                }}
              >
                Comentários
              </Button>
            </HStack>
          </Tooltip>

          <Box
            py={10}
            textAlign={'center'}
            borderRadius={30}
            w={'100%'}
            background={pathname.includes('posts') ? '#e6e6e6' : '#fff'}
            cursor={'pointer'}
            transition={'all 150ms ease-in-out'}
            _hover={{ background: '#efefef' }}
            onClick={() => {
              router.push('/dashboard/posts/list')
            }}
          >
            <Text fontSize={80} m={0}>
              {currentPostsAmount}
            </Text>
            <Text fontSize={20}>Posts</Text>
          </Box>
          <Box
            py={10}
            textAlign={'center'}
            borderRadius={30}
            w={'100%'}
            mb={10}
            background={pathname.includes('comments') ? '#e6e6e6' : '#fff'}
            cursor={'pointer'}
            transition={'all 150ms ease-in-out'}
            _hover={{ background: '#efefef' }}
            onClick={() => {
              router.push('/dashboard/comments')
            }}
          >
            <Text fontSize={80} m={0}>
              {currentCommentsAmount}
            </Text>
            <Text fontSize={20}>Comentários</Text>
          </Box>
        </VStack>
      </Flex>
    </Flex>
  )
}
