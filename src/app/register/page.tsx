'use client'

import React, { useCallback, useContext, useEffect, useRef } from 'react'
import { ContextAuth } from 'contexts/Auth'

import { IRegister } from 'types/api'
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
import { useApi } from 'contexts/Api'

export default function Register() {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged } = useContext(ContextAuth)
  const router = useRouter()
  const { apiPost } = useApi()
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<IRegister>()
  const password = useRef({})
  password.current = watch('password', '')
  const usernamePattern = /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/i

  /*================================ States ==============================*/
  const [passwordShow, setPasswordShow] = React.useState(false)
  const handleClick = () => setPasswordShow(!passwordShow)
  /*================================ Functions ==============================*/
  const handleRegister = useCallback(
    (props: IRegister) => {
      apiPost('/register', props, () => {
        router.push('/')
      })
    },
    [apiPost, router]
  )

  const onSubmit: SubmitHandler<IRegister> = (data) => {
    handleRegister(data)
  }
  /*================================ Effects ==============================*/
  useEffect(() => {
    if (!isLoaded) return
    if (isLogged) router.push('/')
  }, [isLoaded, isLogged, router])
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
          <Heading fontWeight={300}>Cadastro</Heading>
          <FormControl isInvalid={!!errors.username}>
            <Input
              size={'lg'}
              placeholder="Nome de usuário"
              {...register('username', {
                required: 'O nome de usuário é obrigatório',
                minLength: {
                  value: 8,
                  message: 'Inclua pelo menos 8 caracteres',
                },
                pattern: { value: usernamePattern, message: 'O nome de usuário não é válido' },
                maxLength: { value: 191, message: 'Você atingiu o limite de 191 caracteres' },
              })}
            />
            <FormErrorMessage>{errors.username && errors.username.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.name}>
            <Input
              size={'lg'}
              placeholder="Nome completo"
              {...register('name', {
                required: 'O nome é obrigatório',
                maxLength: { value: 100, message: 'Você atingiu o limite de 100 caracteres' },
              })}
            />
            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
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
                  minLength: {
                    value: 8,
                    message: 'Inclua pelo menos 8 caracteres',
                  },
                  maxLength: { value: 191, message: 'Você atingiu o limite de 191 caracteres' },
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
          <FormControl isInvalid={!!errors.passwordconfirm}>
            <Input
              size={'lg'}
              placeholder="Confirmar senha"
              {...register('passwordconfirm', {
                required: 'É necessário confirmar a senha',
                validate: (value) => value === password.current || 'As senhas são diferentes',
              })}
              type="password"
            />
            <FormErrorMessage>
              {errors.passwordconfirm && errors.passwordconfirm.message}
            </FormErrorMessage>
          </FormControl>

          <HStack w={'100%'} gap={6}>
            <Button
              variant={'unstyled'}
              onClick={() => {
                router.push('/login')
              }}
              flexGrow={1}
              fontWeight={400}
              opacity={0.5}
              textAlign={'left'}
              _hover={{ opacity: 1 }}
            >
              Lembrei! Eu tenho um cadastro
            </Button>
            {/* <Spacer></Spacer> */}
            <Button onClick={handleSubmit(onSubmit)}>Cadastrar</Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  )
}
