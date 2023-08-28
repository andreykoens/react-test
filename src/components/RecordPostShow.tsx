'use client'

import { Box, Heading, Text } from '@chakra-ui/react'
import { ContextAuth } from 'contexts/Auth'
import Link from 'next/link'
import React, { useContext, useMemo } from 'react'
import { randomDrift, randomJump } from 'styles/theme'
import { IRecordPost } from 'types/api'
import { getRandomInt } from 'utils/math'
import { CommentSection } from './CommentSection'
import { v4 } from 'uuid'

interface IRecordPostShow {
  Record: IRecordPost
}

export const RecordPostShow = ({ Record }: IRecordPostShow): JSX.Element => {
  /*================================ Constants ==============================*/
  const { nameIndex } = useContext(ContextAuth)
  /*================================ States ==============================*/
  /*================================ Functions ==============================*/
  /*================================ Effects ==============================*/
  /*================================ Memos ==============================*/
  const RecordTitle = useMemo(() => {
    return Record.title.split(' ').map((word) => (
      <Text
        display={'inline-block'}
        key={v4()}
        mb={10}
        px={2}
        transform={`rotate(${Math.random() * 5}deg)`}
        animation={randomDrift(8, 500 * 60)}
        borderBottom={'1px solid black'}
        transition={'all 150ms ease-in-out'}
        _hover={{ textShadow: `0 3px 5px rgba(0,0,0,0.35)` }}
      >
        {word}
      </Text>
    ))
  }, [Record.title])
  const RecordAuthor = useMemo(() => {
    const username = nameIndex.find((e) => e.id === Record.user_id)?.name || 'autor desconhecido'
    return username.split('').map((letter) => (
      <Text
        display={'inline-block'}
        key={v4()}
        mx={letter === ' ' ? 1.5 : 0}
        animation={randomJump(8000, 15000)}
        style={{ animationDelay: `${getRandomInt(1000, 10000)}ms` }}
      >
        {letter}
      </Text>
    ))
  }, [Record.user_id, nameIndex])
  const RecordBody = useMemo(() => {
    return Record.content.split(/\n/i).map((text) => (
      <Text key={v4()} mb={10}>
        {text}
      </Text>
    ))
  }, [Record.content])
  /*================================ Render ==============================*/
  return (
    <Box className="RecordPost" p={6} mb={100} textAlign={'center'}>
      <Box mt={100}>
        <Heading as={'span'} size={'xl'} fontWeight={300} opacity={0.8}>
          <Link href={`/post/${Record.id}`}>{RecordTitle}</Link>
        </Heading>
      </Box>
      <Box className="postAuthor" opacity={0.75} fontWeight={600} mt={-2}>
        {RecordAuthor}
      </Box>
      <Box
        mx={32}
        my={20}
        fontSize={20}
        fontWeight={200}
        lineHeight={'2em'}
        textAlign={'justify'}
        display={'block'}
      >
        {RecordBody}
      </Box>
      {Record.id && (
        <CommentSection
          comments={Record.comments}
          post_id={Record.id}
          allowPost={true}
        ></CommentSection>
      )}
    </Box>
  )
}
