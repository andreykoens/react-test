'use client'

import { ContextAuth } from 'contexts/Auth'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback, useContext, useState } from 'react'
import { Nuke, Seed } from 'utils/seeder'

export const Header: React.FC = ({}) => {
  /*================================ Constants ==============================*/
  const { isLoaded, isLogged, logout, user } = useContext(ContextAuth)
  const router = useRouter()
  const pathname = usePathname()
  /*================================ States ==============================*/
  const [valueBuscaPost, SetValueBuscaPost] = useState<any>(null)
  /*================================ Functions ==============================*/
  const BuscaPost = useCallback(() => {
    window.FakerApi.get('/posts/view', { post_id: 1 })
      .catch((error: any) => {
        console.error(error)
      })
      .then((response: any) => {
        SetValueBuscaPost(response)
      })
  }, [])

  /*================================ Effects ==============================*/
  /*================================ Render ==============================*/
  return (
    <div>
      <h1>
        <Link href={'/'}>React Test</Link>
        <button
          onClick={() => {
            Seed()
          }}
        >
          Seed
        </button>
        <button
          onClick={() => {
            logout()
            Nuke()
          }}
        >
          Nuke
        </button>
      </h1>
      {isLogged && (
        <div>
          {JSON.stringify(user, null, 2)}
          {!pathname.includes('dashboard') && (
            <button
              onClick={() => {
                router.push('/dashboard/posts/list')
              }}
            >
              Dashboard
            </button>
          )}
          {pathname.includes('dashboard') && (
            <span>
              <button
                onClick={() => {
                  router.push('/dashboard/posts/list')
                }}
              >
                View Posts
              </button>
              <button
                onClick={() => {
                  router.push('/dashboard/comments')
                }}
              >
                View Comments
              </button>
            </span>
          )}
          <button
            onClick={() => {
              logout()
            }}
          >
            Logout
          </button>
        </div>
      )}
      {!isLogged && (
        <div>
          <button
            onClick={() => {
              router.push('/login')
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              router.push('/register')
            }}
          >
            Register
          </button>
        </div>
      )}

      <br />
      {/* <hr />
      <button
        onClick={() => {
          BuscaPost()
        }}
      >
        BuscaPost
      </button>
      <div>{JSON.stringify(valueBuscaPost, null, 2)}</div>
      <hr /> */}
    </div>
  )
}
