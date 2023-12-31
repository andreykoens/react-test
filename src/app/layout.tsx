'use client'

import React from 'react'
import type { Metadata } from 'next'
import { ContextAuthProvider } from 'contexts/Auth'
import { Header } from 'components/Header'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, Flex } from '@chakra-ui/react'
import { theme } from 'styles/theme'

import '@fontsource/poppins/200.css'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import { Footer } from 'components/Footer'
import { ContextApiProvider } from 'contexts/Api'
import { ContextPersistentProvider } from 'contexts/Persistent'

export const metadata: Metadata = {
  title: 'Gibberish™️',
  description: 'Blá blá blá',
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ContextApiProvider>
      <ContextAuthProvider>
        <ContextPersistentProvider>
          <CacheProvider>
            <ChakraProvider theme={theme}>{children}</ChakraProvider>
          </CacheProvider>
        </ContextPersistentProvider>
      </ContextAuthProvider>
    </ContextApiProvider>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <Flex
            id={'LayoutWrap'}
            pt={150}
            minH={'100vh'}
            direction={'column'}
            background={'#fdfdfd'}
          >
            <Header></Header>
            <Flex
              id={'ContentWrap'}
              flexGrow={1}
              flexDir={'column'}
              alignContent={'center'}
              justifyContent={'center'}
              zIndex={10}
              position={'relative'}
            >
              {children}
            </Flex>
            <Footer></Footer>
          </Flex>
        </Providers>
      </body>
    </html>
  )
}
