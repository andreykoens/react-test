'use client'

import { Box, Text, keyframes } from '@chakra-ui/react'
import { ContextAuth } from 'contexts/Auth'
import React, { useContext, useMemo } from 'react'
import { IRecordComment } from 'types/api'
import { getRandomBoolean, getRandomInt } from 'utils/math'
import { v4 } from 'uuid'
import { eventClipboardCopy } from 'utils/mouseEvents'
import { RecordCommentActions } from './RecordCommentActions'

interface IRecordCommentShow {
  postId: number
  Record: IRecordComment
}

export const RecordCommentShow = ({ Record, postId }: IRecordCommentShow): JSX.Element => {
  /*================================ Constants ==============================*/
  const { user, nameIndex } = useContext(ContextAuth)

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
      padding={10}
      verticalAlign={'middle'}
      display={'inline-block'}
      width={'22%'}
      borderRadius={25}
      my={6}
      mx={'1.5%'}
      background={'#f6f6f6'}
      animation={`
                  ${vSwing}
                  ${getRandomInt(30, 50)}s
                  ${getRandomBoolean() ? 'alternate-reverse' : 'alternate'}
                  infinite
                `}
      // transition={'all 150ms ease-in-out'}
      cursor={'pointer'}
      style={{ animationDelay: `${getRandomInt(0, 350)}ms` }}
      transition={'background 150ms ease-in-out'}
      _hover={{
        animationPlayState: 'paused',
        zIndex: 500,
        background: '#f0f0f0',
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
        <RecordCommentActions
          commentId={1}
          postId={postId}
          position={'bottom'}
        ></RecordCommentActions>
        // <div style={{ float: 'right' }}>
        //   <button onClick={EditAction}>Edit</button>
        //   <button onClick={DeleteAction}>X</button>
        // </div>
      )}
    </Box>
  )
}
