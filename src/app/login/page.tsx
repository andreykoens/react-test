'use client'

import React, { useCallback, useContext, useRef } from 'react'
import { ContextAuth } from 'contexts/Auth'
import { ILogin } from 'types/api'
import { useRouter } from 'next/navigation'
import { useForm, SubmitHandler } from 'react-hook-form'
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from '@chakra-ui/react'

export default function Login() {
  /*================================ Constants ==============================*/
  const { login } = useContext(ContextAuth)
  const router = useRouter()
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<ILogin>()
  const password = useRef({})
  password.current = watch('password', '')
  /*================================ States ==============================*/
  const [passwordShow, setPasswordShow] = React.useState(false)
  const handleClick = () => setPasswordShow(!passwordShow)
  /*================================ Functions ==============================*/
  const handleLogin = useCallback(
    (data: ILogin) => {
      login(data)
    },
    [login]
  )

  const onSubmit: SubmitHandler<ILogin> = (data) => {
    handleLogin(data)
  }
  /*================================ Effects ==============================*/

  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  return (
    <Box
      id={'Register'}
      width={'500px'}
      mx={'auto'}
      background={'#f6f6f6'}
      borderRadius={50}
      textAlign={'center'}
      p={10}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <VStack gap={6}>
          <Heading fontWeight={300}>Login</Heading>
          <FormControl isInvalid={!!errors.username}>
            <Input
              size={'lg'}
              placeholder="Nome de usuário"
              {...register('username', {
                required: 'O nome de usuário é obrigatório',
              })}
            />
            <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
            <InputGroup size="md">
              <Input
                size={'lg'}
                pr="4.5rem"
                type={passwordShow ? 'text' : 'password'}
                placeholder="Senha"
                {...register('password', {
                  required: 'A senha é obrigatória',
                })}
              />
              <InputRightElement width="4.5rem">
                <Button
                  size={'lg'}
                  onClick={handleClick}
                  variant={'unstyled'}
                  fontSize={26}
                  mb={-1}
                  mr={-4}
                  _hover={{ transform: 'scale(1.4)' }}
                >
                  {passwordShow ? '🙈' : '👀'}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
          </FormControl>
          <HStack w={'100%'} gap={6}>
            <Button
              variant={'unstyled'}
              onClick={() => {
                router.push('/register')
              }}
              flexGrow={1}
              fontWeight={400}
              opacity={0.5}
              textAlign={'left'}
              _hover={{ opacity: 1 }}
            >
              Preciso me cadastrar
            </Button>
            <Button type={'submit'} size={'md'} onClick={handleSubmit(onSubmit)}>
              Entrar
            </Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  )
}
