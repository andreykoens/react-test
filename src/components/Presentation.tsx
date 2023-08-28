import React, { useCallback, useState } from 'react'

import { Box, Flex, Link, Text } from '@chakra-ui/react'

export const Presentation = ({}): JSX.Element => {
  /*================================ Constants ==============================*/

  /*================================ States ==============================*/

  const [mobileFailHover, setMobileFailHover] = useState<boolean>(false)

  /*================================ Functions ==============================*/
  const noMobileShock = useCallback((e) => {
    const el = document.createElement('div')
    el.id = 'MobileShockEmo'
    setTimeout(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(-120px) scale(1.1) rotate(5deg)'
    }, 50)

    Object.assign(el.style, {
      display: 'block',
      position: 'absolute',
      pointerEvents: 'none',
      fontSize: '120px',
      opacity: 0,
      top: String(`${e.pageY - 80}px`),
      left: String(`${e.pageX - 80}px`),
      zIndex: String(999999),
      transform: 'scale(0.6) rotate(-30deg)',
      transition: 'all 100ms ease-in-out',
    })
    el.textContent = '😨'
    document.getElementById('LayoutWrap').append(el)
  }, [])
  /*================================ Memos ==============================*/
  // const jumpingEs = useMemo(() => {
  //   const es = 'éééééééééééé...'
  //   return es.split('').map((letter, i) => (
  //     <Text
  //       display={'inline-block'}
  //       key={v4()}
  //       mx={letter === ' ' ? 1.5 : 0}
  //       animation={randomJump(8000, 15000)}
  //       opacity={mapRange(i, { start: 0, stop: es.length }, { start: 1, stop: 0.05 })}
  //       style={{ animationDelay: `${getRandomInt(1000, 10000)}ms` }}
  //     >
  //       {letter}
  //     </Text>
  //   ))
  // }, [])
  /*================================ Effects ==============================*/
  /*================================ Render ==============================*/
  return (
    <Flex id={'Presentation'} height={'500px'} alignContent={'center'}>
      <Box
        position={'fixed'}
        top={0}
        left={0}
        h={'100vh'}
        w={'100vw'}
        background={'url(/bg.jpg)'}
        backgroundPosition={'center'}
        backgroundSize={'cover'}
        zIndex={-1}
      ></Box>
      <Flex w={'50%'} flexDir={'row'} justifyContent={'flex-end'}>
        <Box fontSize={20} lineHeight={'2.4em'} w={'450px'} textAlign={'right'} mr={6}>
          <b>Gibberish™️</b> é um breve site para ler lorem ipsum, e em passear por ele, ver que
          aqui tem um{' '}
          <Text as={'span'} textDecoration={'line-through'}>
            excesso?
          </Text>{' '}
          pouco de tudo: rest, cadastro, auth, crud, listagem, dashboard, validação, feedback,
          letrinha que pula, emoji que rebola, seed, wipe,{' '}
          <Text
            background={'#f6f6f6'}
            borderRadius={100}
            px={2}
            cursor={'pointer'}
            display={'inline-block'}
            onMouseEnter={(e) => {
              noMobileShock(e)
              setMobileFailHover(true)
            }}
            onMouseLeave={() => {
              const emo = document.getElementById('MobileShockEmo')
              if (!emo) return
              emo.style.opacity = '0'
              setTimeout(() => {
                emo.remove()
              }, 200)
              setMobileFailHover(false)
            }}
          >
            mobile last
          </Text>
          <Text
            display={'inline-block'}
            transition={'all 250ms ease-in-out'}
            opacity={mobileFailHover ? 1 : 0}
          >
            (...nem tudo é perfeito!)
          </Text>{' '}
          e bom humor 🙃.
          <br /> A parafernalha técnica{' '}
          <Link href={'https://github.com/andreykoens/react-test'} textDecor={'underline'}>
            ficou no git
          </Link>
          .
        </Box>
      </Flex>
      <Flex w={'50%'} flexDir={'column'} textAlign={'right'} justifyContent={'flex-end'}>
        <Box w={'250px'} textAlign={'left'} ml={6}>
          Você pode ver conteúdo gerado automaticamente, fazer login, publicar novas sopas de
          letrinha, comentar e gerenciar suas informações no dashboard. <br />
          <br />
          Todo o conteúdo é local!
        </Box>
      </Flex>
    </Flex>
  )
}
