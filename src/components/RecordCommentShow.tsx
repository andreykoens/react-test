'use client'

import { Box, Heading, Text, keyframes } from '@chakra-ui/react'
import { ContextAuth, useAuth } from 'contexts/Auth'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { randomDrift } from 'styles/theme'
import { IRecordComment, IRecordPost } from 'types/api'
import { getRandomBoolean, getRandomInt } from 'utils/math'
import { Seed } from 'utils/seeder'
import { CommentSection } from './CommentSection'
import { v4 } from 'uuid'
import { ContextMouseEvents, useMouseEvents } from 'contexts/MouseEvent'
import { eventClipboardCopy } from 'utils/mouseEvents'

interface IRecordCommentShow {
  Record: IRecordComment
  EditAction: () => void
  DeleteAction: () => void
}

export const RecordCommentShow: React.FC = ({
  Record,
  EditAction,
  DeleteAction,
}: IRecordCommentShow) => {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, logout, user, nameIndex } = useContext(ContextAuth)

  /*================================ States ==============================*/
  /*================================ Functions ==============================*/
  /*================================ Memos ==============================*/

  const vSwing = useMemo(() => {
    return keyframes`
  from { transform: translateY(-40px); }
  to { transform: translateY(40px); }
`
  }, [])

  const username = useMemo(() => {
    return nameIndex.find((e) => e.id === Record.user_id).name
  }, [Record.user_id, nameIndex])
  /*================================ Effects ==============================*/
  /*================================ Render ==============================*/
  return (
    <Box
      key={`comment-${v4()}`}
      border={'1px solid rgba(0,0,0,0.35)'}
      padding={10}
      verticalAlign={'middle'}
      display={'inline-block'}
      width={'22%'}
      borderRadius={'20px'}
      my={6}
      mx={'1.5%'}
      backdropBlur={100}
      background={'#fff'}
      animation={`
                  ${vSwing}
                  ${getRandomInt(30, 50)}s
                  ${getRandomBoolean() ? 'alternate-reverse' : 'alternate'}
                  infinite
                `}
      // transition={'all 150ms ease-in-out'}
      cursor={'pointer'}
      style={{ animationDelay: `${getRandomInt(0, 350)}ms` }}
      _hover={{
        animationPlayState: 'paused',
        zIndex: 500,
        background: '#fdfdfd',
      }}
      onClick={(e) => {
        navigator.clipboard.writeText(`${username} diz: ${Record.content}`)
        eventClipboardCopy(e.pageX, e.pageY)
      }}
    >
      <Text fontWeight={500} opacity={0.8} mt={-3} mb={3}>
        {username}
      </Text>
      <Text fontWeight={300}>{Record.content}</Text>

      {user && user.id === Record.user_id && (
        <div style={{ float: 'right' }}>
          <button onClick={EditAction}>Edit</button>
          <button onClick={DeleteAction}>X</button>
        </div>
      )}
    </Box>
  )
}
