'use client'

import { Box, HStack, Text, useToast } from '@chakra-ui/react'
import React, { createContext, useCallback, useContext, useMemo } from 'react'
import { IResponse } from 'types/api'
import FakerApi from 'utils/fakerApi'
const fakerApi = new FakerApi()

interface IContextApi {
  // False positive
  // eslint-disable-next-line no-unused-vars
  apiGet: <T, K>(url: string, props: T, action: (data: K) => void) => void
  // eslint-disable-next-line no-unused-vars
  apiPost: <T>(url: string, props: T, action: () => void) => void
  // eslint-disable-next-line no-unused-vars
  apiDelete: <T>(url: string, props: T, action: () => void) => void
  // eslint-disable-next-line no-unused-vars
  apiPut: <T>(url: string, props: T, action: () => void) => void
}

interface FCProps {
  children: React.ReactNode
}

export const ContextApi = createContext({} as IContextApi)

export const ContextApiProvider: React.FC<FCProps> = ({
  children,
}: {
  children: React.ReactNode
}) => {
  /*================================ Constants ==============================*/
  const toast = useToast()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toastIdRef = React.useRef<any>()
  /*================================ States ==============================*/

  /*================================ Functions ==============================*/

  const alertFeedback = useCallback(
    <T,>(response: IResponse<T>, method?: string, url?: string) => {
      const reference = method && url ? `REF: ${method} @ ${url}` : ''
      if (!response) return
      toastIdRef.current = toast({
        duration: 7 * 1000,
        position: 'bottom-right',
        isClosable: true,
        render: () => (
          <HStack
            borderRadius={25}
            pt={3}
            pb={4}
            pl={4}
            pr={10}
            mx={6}
            my={2}
            fontWeight={600}
            cursor={'pointer'}
            color={'#fff'}
            background={response.success ? '#7a6b18' : '#c45238'}
            transition={'all 150ms ease-in-out'}
            _hover={{ opacity: 0.75 }}
            onClick={() => {
              if (toastIdRef.current) {
                toast.close(toastIdRef.current)
              }
            }}
          >
            <Box fontSize={60}>{response.success ? '😀' : '⚠️'}</Box>
            <Box>
              <Text fontSize={16} fontWeight={600}>
                {response.message}
              </Text>
              <Text as={'small'} fontWeight={300}>
                {reference}
              </Text>
            </Box>
          </HStack>
        ),
      })
    },
    [toast]
  )

  const apiGet = useCallback(
    // eslint-disable-next-line no-unused-vars
    <T, K>(url: string, props: T, action: (data: K) => void) => {
      fakerApi
        .get(url, props)
        .catch((error: IResponse<void>) => {
          alertFeedback(error, 'GET', url)
        })
        .then((response: IResponse<K>) => {
          action(response.data)
        })
    },
    [alertFeedback]
  )

  const apiPost = useCallback(
    <T,>(url: string, props: T, action: () => void) => {
      fakerApi
        .post(url, props)
        .catch((error: IResponse<void>) => {
          alertFeedback(error, 'POST', url)
        })
        .then((response: IResponse<void>) => {
          alertFeedback<void>(response)
          action()
        })
    },
    [alertFeedback]
  )

  const apiDelete = useCallback(
    <T,>(url: string, props: T, action: () => void) => {
      fakerApi
        .delete(url, props)
        .catch((error: IResponse<void>) => {
          alertFeedback(error, 'DELETE', url)
        })
        .then((response: IResponse<void>) => {
          if (!response) return
          alertFeedback<void>(response)
          action()
        })
    },
    [alertFeedback]
  )

  const apiPut = useCallback(
    <T,>(url: string, props: T, action: () => void) => {
      fakerApi
        .put(url, props)
        .catch((error: IResponse<void>) => {
          alertFeedback(error, 'PUT', url)
        })
        .then((response: IResponse<void>) => {
          alertFeedback<void>(response)
          action()
        })
    },
    [alertFeedback]
  )

  /*================================ Effects ==============================*/

  /*================================ Memos ==============================*/
  const contextApiValue: IContextApi = useMemo(
    () => ({
      apiGet,
      apiPost,
      apiPut,
      apiDelete,
    }),
    [apiDelete, apiGet, apiPost, apiPut]
  )

  /*================================ Render ==============================*/
  return <ContextApi.Provider value={contextApiValue}>{children}</ContextApi.Provider>
}

export function useApi() {
  const context = useContext(ContextApi)
  return context
}
