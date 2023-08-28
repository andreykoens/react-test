import React from 'react'

import { Box, Flex, Link } from '@chakra-ui/react'

export const Footer = ({}): JSX.Element => {
  /*================================ Constants ==============================*/
  const texture =
    "data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.30' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"
  /* const { isLogged, isLoaded } = useContext(ContextAuth) */
  /*================================ States ==============================*/
  /*================================ Functions ==============================*/
  /*================================ Effects ==============================*/
  /*================================ Render ==============================*/
  return (
    <>
      <Box
        h={'200px'}
        w={'full'}
        position={'absolute'}
        bottom={0}
        zIndex={31}
        background={`linear-gradient(0deg, rgba(41,41,50,0.5), rgba(0,0,0,0)), url("${texture}")`}
        backgroundImage={texture}
        filter={'contrast(370%) brightness(1000%)'}
        overflow={'hidden'}
        opacity={0.3}
      ></Box>
      <Box
        h={'100px'}
        w={'full'}
        position={'absolute'}
        bottom={0}
        zIndex={30}
        background={`linear-gradient(0deg, rgba(255,255,255,1), rgba(255,255,255,1), rgba(255,255,255,0))`}
      ></Box>
      <Flex
        id="Footer"
        w={'full'}
        mt={10}
        alignItems={'center'}
        justifyContent={'center'}
        fontSize={16}
        h={'20'}
        zIndex={50}
      >
        <Box>
          Escrito à mão por{' '}
          <Link href={'https://koens.com.br'} target={'_blank'} textDecoration={'underline'}>
            Andrey Koens
          </Link>{' '}
          num par de corujão animado, 2023
        </Box>
      </Flex>
    </>
  )
}
