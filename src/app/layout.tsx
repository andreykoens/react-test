'use client'

import React from 'react'
import type { Metadata } from 'next'
import { ContextAuthProvider } from 'contexts/Auth'
import Script from 'next/script'
import { Header } from 'components/Header'
import { CacheProvider } from '@chakra-ui/next-js'
import { Box, ChakraProvider, Flex } from '@chakra-ui/react'
import { theme } from 'styles/theme'

import '@fontsource/poppins/200.css'
import '@fontsource/poppins/300.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import { Footer } from 'components/Footer'

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
          <Box minH={'100vh'} background={'#fdfdfd'}>
            {/*================== HEADER =================*/}
            <Header></Header>
            {/*================== BODY =================*/}
            <Flex justify={'center'}>
              <Box maxW={'1200px'}>{children}</Box>
            </Flex>
            {/*================== FOOTER =================*/}
            <Footer></Footer>
          </Box>
        </Providers>
      </body>
    </html>
  )
}
