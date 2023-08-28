'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { IRecordPost } from 'types/api'
import { v4 } from 'uuid'
import { Heading, Text, VStack } from '@chakra-ui/react'
import { randomDrift } from 'styles/theme'
import { RecordPostShow } from 'components/RecordPostShow'
import { Presentation } from 'components/Presentation'
import { useApi } from 'contexts/Api'

export default function Home() {
  /*================================ Constants ==============================*/

  const { apiGet } = useApi()

  /*================================ States ==============================*/
  const [recordsPosts, setRecordsPosts] = useState<IRecordPost[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  /*================================ Functions ==============================*/
  const getPosts = useCallback(() => {
    apiGet<unknown, Record<string | number, IRecordPost>>('/posts', {}, (data) => {
      setRecordsPosts(Object.values(data))
      setIsLoading(false)
    })
  }, [apiGet])
  const EndOfRecords = useMemo(() => {
    return 'tinha, e agora acabou'.split('').map((letter) => (
      <Text
        display={'inline-block'}
        key={v4()}
        animation={randomDrift(3, 300 * 60)}
        mx={letter === ' ' ? 4 : 0}
      >
        {letter}
      </Text>
    ))
  }, [])
  /*================================ Effects ==============================*/
  useEffect(() => {
    getPosts()
  }, [getPosts])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  if (!isLoading && recordsPosts && recordsPosts.length === 0) return <Presentation></Presentation>
  if (!isLoading && recordsPosts && recordsPosts.length > 0)
    return (
      <VStack maxW={'1200px'} mx={'auto'}>
        <>
          {recordsPosts.map((post: IRecordPost) => (
            <RecordPostShow key={`post-${v4()}`} {...{ Record: post }}></RecordPostShow>
          ))}
        </>

        {recordsPosts && recordsPosts.length > 0 && (
          <Heading fontWeight={100} fontSize={80} my={24} opacity={0.1}>
            {EndOfRecords}
          </Heading>
        )}
      </VStack>
    )
  return <></>
}
