'use client'

import {
  Box,
  Button,
  Flex,
  Heading,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Text,
} from '@chakra-ui/react'
import { ContextAuth } from 'contexts/Auth'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useContext } from 'react'
import { randomDrift } from 'styles/theme'
import { SeedGeneric } from 'utils/seed'
import { Wipe } from 'utils/wipe'

export const Header = ({}): JSX.Element => {
  /*================================ Constants ==============================*/
  const { isLogged, logout, user } = useContext(ContextAuth)
  const router = useRouter()
  const pathname = usePathname()
  const texture =
    "data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.30' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"
  /*================================ Effects ==============================*/
  /*================================ Render ==============================*/
  return (
    <>
      <Box
        h={'200px'}
        w={'full'}
        top={0}
        position={'fixed'}
        zIndex={31}
        background={`linear-gradient(180deg, rgba(60,41,41,0.5), rgba(0,0,0,0)), url("${texture}")`}
        backgroundImage={texture}
        filter={'contrast(370%) brightness(1000%)'}
        overflow={'hidden'}
        opacity={0.3}
      ></Box>
      <Box
        h={'200px'}
        w={'full'}
        top={0}
        position={'fixed'}
        zIndex={30}
        background={`linear-gradient(180deg, rgba(255,255,255,1), rgba(255,255,255,1), rgba(255,255,255,0))`}
      ></Box>

      <Box position={'fixed'} top={0} h={'100px'} w={'full'} zIndex={50}>
        <Heading fontSize={120} position={'fixed'} textAlign={'center'} w={'full'} mt={4}>
          {!pathname.includes('dashboard') && (
            <Button
              className="seedButton"
              variant={'ghost'}
              mr={-20}
              mt={16}
              borderRadius={50}
              animation={randomDrift(50, 150 * 60)}
              fontSize={60}
              onClick={() => {
                SeedGeneric()
              }}
            >
              🍃
            </Button>
          )}
          <Link href={'/'}>
            <Text display={'inline'} fontWeight={600}>
              Gibberish
            </Text>
            <Text display={'inline'} fontWeight={100}>
              ™️
            </Text>
          </Link>
          {!pathname.includes('dashboard') && (
            <Button
              className="nukeButton"
              variant={'ghost'}
              ml={-20}
              mt={16}
              borderRadius={50}
              animation={randomDrift(50, 150 * 60)}
              fontSize={60}
              onClick={() => {
                logout()
                Wipe()
              }}
            >
              💥
            </Button>
          )}
        </Heading>

        <Flex p={7} width={'full'}>
          <Popover placement={'bottom-start'}>
            <PopoverTrigger>
              <Button variant={'unstyled'} fontSize={30} _hover={{ opacity: 0.6 }}>
                {!isLogged ? 'Andrey Koens' : 'AK'}
              </Button>
            </PopoverTrigger>
            <PopoverContent borderRadius={20} w={'500px'}>
              <PopoverArrow />
              <PopoverBody p={10} fontWeight={400} fontSize={16} lineHeight={'2em'}>
                <Box mb={6}>
                  Andrey Koens, 31 anos, é artista e desenvolvedor de software. Desde 2010 pesquisa
                  a tecnologia e seus impactos na vitalidade humana, passando pela robótica, imagem
                  computacional e inteligência artificial. Atualmente, é mestrando no programa de
                  pós-graduação da Unesp e parte do Gaia (Grupo de Arte e Inteligência Artificial
                  FAUUSP/ InovaUSP), onde investiga as sensibilidades que subjetivam aparatos
                  tecnológicos para o desenvolvimento de críticas e poéticas afirmativas.
                </Box>
                <Button as={'a'} w={'full'} href="https://koens.com.br/" target="_blank">
                  Arte? Aqui!
                </Button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Spacer />
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

              <Button
                onClick={() => {
                  logout()
                }}
              >
                Sair
              </Button>
            </Box>
          )}
          {!isLogged && (
            // PUBLIC ITEMS
            <Box pt={2}>
              <Button
                variant={'link'}
                color={'black'}
                mr={5}
                onClick={() => {
                  router.push('/register')
                }}
              >
                Sem cadastro?
              </Button>
              <Button
                variant={'solid'}
                borderRadius={30}
                background={'white'}
                onClick={() => {
                  router.push('/login')
                }}
              >
                Entrar
              </Button>
            </Box>
          )}
        </Flex>
      </Box>
    </>
  )
}
