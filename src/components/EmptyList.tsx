'use client'

import { Box, Button, Link, Heading } from '@chakra-ui/react'
import { ContextAuth } from 'contexts/Auth'
import React, { useContext } from 'react'
import { SeedGeneric } from 'utils/seed'

export const EmptyList = ({}): JSX.Element => {
  /*================================ Constants ==============================*/
  const { isLogged } = useContext(ContextAuth)
  /*================================ States ==============================*/
  /*================================ Functions ==============================*/
  /*================================ Effects ==============================*/
  /*================================ Render ==============================*/
  return (
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
          SeedGeneric()
        }}
      >
        Quer ir direto pro blá blá blá? Você pode usar um seed.
      </Button>
    </Box>
  )
}
