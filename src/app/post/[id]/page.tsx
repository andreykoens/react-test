'use client'

import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ContextAuth } from 'contexts/Auth'
import { useParams } from 'next/navigation'
import { apiGet } from 'utils/api'
import { IRecordPost } from 'types/api'
import { v4 } from 'uuid'
import { VStack } from '@chakra-ui/react'
import { RecordPostShow } from 'components/RecordPostShow'

export default function RecordsShowPost() {
  /*================================ Constants ==============================*/
  const { isLoaded } = useContext(ContextAuth)
  const params = useParams()
  /*================================ States ==============================*/

  const [recordPost, setRecordPost] = useState<IRecordPost>()

  /*================================ Functions ==============================*/
  const getPost = useCallback(() => {
    apiGet<{ post_id: number }, IRecordPost>(
      '/posts/view',
      { post_id: Number(params.id) },
      (data: IRecordPost) => {
        setRecordPost(data)
      }
    )
  }, [params.id])
  /*================================ Effects ==============================*/
  useEffect(() => {
    if (!isLoaded) return
    getPost()
  }, [getPost, isLoaded])
  /*================================ Memos ==============================*/
  /*================================ Render ==============================*/
  return (
    <VStack maxW={'1200px'} mx={'auto'}>
      {/*================== SINGLE POST =================*/}

      {recordPost && (
        <RecordPostShow key={`post-${v4()}`} {...{ Record: recordPost }}></RecordPostShow>
      )}
    </VStack>
  )
}
