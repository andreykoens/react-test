'use client'

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiPost } from 'utils/api'
import { IRecordPost } from 'types/api'
import { CommentSection } from 'components/CommentSection'
import { v4 } from 'uuid'
import { EmptyList } from 'components/EmptyList'
import { Box, HStack, Heading, Text, VStack, keyframes } from '@chakra-ui/react'
import { randomDrift } from 'styles/theme'
import { getRandomInt } from 'utils/math'
import { RecordPostShow } from 'components/RecordPostShow'
import { Presentation } from 'components/Presentation'

export default function Home() {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, logout, user, nameIndex } = useContext(ContextAuth)
  const router = useRouter()
  /*================================ States ==============================*/
  const [recordsPosts, setRecordsPosts] = useState<any>(null)

  /*================================ Functions ==============================*/
  const getPosts = useCallback(() => {
    apiPost('/posts', {}, (data: Record<string | number, IRecordPost>) => {
      delete data['message']
      setRecordsPosts(Object.values(data))
    })
  }, [])
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
    if (!isLoaded) return
    getPosts()
    // ListaComments()
  }, [getPosts, isLoaded])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  if (recordsPosts && recordsPosts.length === 0) return <Presentation></Presentation>
  if (recordsPosts && recordsPosts.length > 0)
    return (
      <VStack>
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
