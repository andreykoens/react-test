'use client'

import { ContextAuth, useAuth } from 'contexts/Auth'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useContext, useState } from 'react'
import { Seeder } from './Seeder'
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
          No posts yet. Start by <Link href={'/login'}>logging in</Link>, or{' '}
          <Link href={'/register'}>register</Link>.
        </div>
      )}
      {isLoaded && isLogged && (
        <div>
          No posts yet. You can <Link href={'/dashboard/posts/new'}>create</Link>, or{' '}
          <a
            onClick={(e) => {
              e.preventDefault()
              Seed()
            }}
          >
            seed
          </a>
          .
        </div>
      )}
    </>
  )
}
