'use client'

import { ContextAuth, useAuth } from 'contexts/Auth'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useContext, useState } from 'react'
import { Seed } from 'utils/seeder'

export const EmptyList: React.FC = ({}) => {
  /*================================ Constants ==============================*/
  const { isLogged, isLoaded } = useContext(ContextAuth)
  /*================================ States ==============================*/
  /*================================ Functions ==============================*/
  /*================================ Effects ==============================*/
  /*================================ Render ==============================*/
  return (
    <>
      {isLoaded && !isLogged && (
        <div>
          Nenhum post. Comece pelo <Link href={'/login'}>login</Link>, ou{' '}
          <Link href={'/register'}>registre-se</Link>.
        </div>
      )}
      {isLoaded && isLogged && (
        <div>
          Nenhum post. Você pode <Link href={'/dashboard/posts/new'}>criar</Link>, ou{' '}
          <a
            onClick={(e) => {
              e.preventDefault()
              Seed()
            }}
          >
            seedar
          </a>
          .
        </div>
      )}
    </>
  )
}
