'use client'

import { Box, Button, Link, Heading } from '@chakra-ui/react'
import { ContextAuth, useAuth } from 'contexts/Auth'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useContext, useState } from 'react'
import { Seed } from 'utils/seeder'

export const EmptyList: React.FC = ({}) => {
  /*================================ Constants ==============================*/
  const { isLogged, isLoaded } = useContext(ContextAuth)
  /*================================ States ==============================*/
  /*================================ Functions ==============================*/
  /*================================ Effects ==============================*/
  /*================================ Render ==============================*/
  return (
    <>
      {isLoaded && (
        <Box textAlign={'center'}>
          {!isLogged && (
            <Heading fontWeight={300}>
              Nenhum post. Comece pelo <Link href={'/login'}>login</Link>, ou{' '}
              <Link href={'/register'}>registre-se</Link>.
            </Heading>
          )}
          {isLogged && (
            <Heading fontWeight={300}>
              Nenhum post. Que tal{' '}
              <Link href={'/dashboard/posts/new'} opacity={0.85}>
                criar um novo
              </Link>
              ?
            </Heading>
          )}
          <Button
            variant={'unstyled'}
            fontWeight={400}
            borderBottom={'1px solid black'}
            px={3}
            _hover={{ background: '#f6f6f6' }}
            onClick={() => {
              Seed()
            }}
          >
            Quer ir direto pro blá blá blá? Você pode usar um seed.
          </Button>
        </Box>
      )}
    </>
  )
}
