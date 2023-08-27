'use client'

import React from 'react'
import type { Metadata } from 'next'
import { ContextAuthProvider } from 'contexts/Auth'
import Script from 'next/script'
import { Header } from 'components/Header'
import { CacheProvider } from '@chakra-ui/next-js'
import { Box, ChakraProvider, Flex, Spacer } from '@chakra-ui/react'
import { theme } from 'styles/theme'

import '@fontsource/poppins/200.css'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import { Footer } from 'components/Footer'
import { ContextMouseEvents, ContextMouseEventsProvider } from 'contexts/MouseEvent'
import { Presentation } from 'components/Presentation'

export const metadata: Metadata = {
  title: 'React Test',
  description: 'Technical test of recent code practices',
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ContextAuthProvider>
      <CacheProvider>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </CacheProvider>
    </ContextAuthProvider>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <Script src="/fakerApi.js"></Script>
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
