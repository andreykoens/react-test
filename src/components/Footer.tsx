import React from 'react'

import { Box, Flex, Link } from '@chakra-ui/react'

export const Footer: React.FC = ({}) => {
  /*================================ Constants ==============================*/
  /* const { isLogged, isLoaded } = useContext(ContextAuth) */
  /*================================ States ==============================*/
  /*================================ Functions ==============================*/
  /*================================ Effects ==============================*/
  /*================================ Render ==============================*/
  return (
    <Flex
      w={'full'}
      bg={'#414141'}
      color={'#fff'}
      alignItems={'center'}
      justifyContent={'center'}
      fontSize={16}
      h={'20'}
      style={{
        filter: 'contrast(190%) brightness(1000%)',
        background:
          "linear-gradient(0deg, rgba(9,9,14,0.9), rgba(0,0,0,0)), url(data:image/svg+xml,%3Csvg viewBox='0 0 58 58' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.35' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E",
      }}
    >
      <Box>
        Escrito por{' '}
        <Link href={'https://koens.com.br'} target={'_blank'} textDecoration={'underline'}>
          Andrey Koens
        </Link>{' '}
        num corujão animado, 2023 💤
      </Box>
    </Flex>
  )
}
