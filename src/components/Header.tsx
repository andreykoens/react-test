'use client'

import { Box, Button, Flex, Heading, keyframes } from '@chakra-ui/react'
import { ContextAuth } from 'contexts/Auth'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useContext, useState } from 'react'
import { randomDrift } from 'styles/theme'
import { Nuke, Seed } from 'utils/seeder'

export const Header: React.FC = ({}) => {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, logout, user } = useContext(ContextAuth)
  const router = useRouter()
  const pathname = usePathname()
  /*================================ States ==============================*/
  const [valueBuscaPost, SetValueBuscaPost] = useState<any>(null)
  /*================================ Functions ==============================*/
  const BuscaPost = useCallback(() => {
    window.FakerApi.get('/posts/view', { post_id: 1 })
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueBuscaPost(response)
      })
  }, [])

  /*================================ Effects ==============================*/
  /*================================ Render ==============================*/
  return (
    <Box
      h={'100px'}
      borderBottom={'1px solid black'}
      background={'#fff'}
      position={'fixed'}
      w={'full'}
      zIndex={10}
    >
      <Heading fontSize={120} position={'fixed'} textAlign={'center'} w={'full'} mt={4}>
        <Button
          mr={-20}
          mt={16}
          borderRadius={50}
          animation={`${keyframes`${randomDrift(50)}`} infinite 150s linear`}
          variant={'ghost'}
          fontSize={60}
          onClick={() => {
            Seed()
          }}
        >
          🍃
        </Button>{' '}
        <Link href={'/'}>Gibberish™️</Link>
        <Button
          ml={-20}
          mt={16}
          borderRadius={50}
          animation={`${keyframes`${randomDrift(50)}`} infinite 150s linear`}
          variant={'ghost'}
          fontSize={60}
          onClick={() => {
            logout()
            Nuke()
          }}
        >
          💥
        </Button>
      </Heading>

      {isLogged && (
        <Box>
          {JSON.stringify(user, null, 2)}
          {!pathname.includes('dashboard') && (
            <Button
              onClick={() => {
                router.push('/dashboard/posts/list')
              }}
            >
              Dashboard
            </Button>
          )}
          {pathname.includes('dashboard') && (
            <span>
              <Button
                onClick={() => {
                  router.push('/dashboard/posts/list')
                }}
              >
                View Posts
              </Button>
              <Button
                onClick={() => {
                  router.push('/dashboard/comments')
                }}
              >
                View Comments
              </Button>
            </span>
          )}
          <Button
            onClick={() => {
              logout()
            }}
          >
            Logout
          </Button>
        </Box>
      )}
      {!isLogged && (
        <Box>
          <Button
            onClick={() => {
              router.push('/login')
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => {
              router.push('/register')
            }}
          >
            Register
          </Button>
        </Box>
      )}
    </Box>
  )
}
