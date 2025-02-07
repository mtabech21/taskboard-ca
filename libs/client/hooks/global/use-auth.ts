import { useEffect, useMemo, useState } from "react";
import { QueryClient } from "@tanstack/react-query";

import { Authenticated, Authentication, User } from "@taskboard/types";
import axios from "axios";
import Contextor from "../contextor";
import { useSecret } from "./use-secret";







export const useAuth = new Contextor((config: { url: string, queryClient: QueryClient }): Authentication => {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const secret = useSecret(config.queryClient)

  const server = useMemo(() => axios.create({
    baseURL: config.url,
    withCredentials: true
  }), [user])

  useEffect(() => {
    get()
      .catch(() => {
        if (!location.href.includes(import.meta.env.VITE_HUB_URL + '/login'))
          goToSignInPage()
      })
  }, [])

  function goToSignInPage(redirect?: boolean) {
    const withRedirect = redirect == undefined ? true : redirect
    const currentPage = withRedirect ? encodeURIComponent(location.href) : null
    location.href = import.meta.env.VITE_HUB_URL + '/login?' + (currentPage ? `redirect=${currentPage}` : '')
  }

  async function get(): Promise<User> {
    setIsLoading(true)
    return new Promise<User>((resolve, reject) => {
      server.get('/', {}).then((res) => {
        const user = res.data as User
        setUser(user)
        resolve(user)
      }).catch((err) => {
        setUser(null)
        reject(err)
      }).finally(() => { setIsLoading(false) })
    })
  }

  async function signIn(login_data: { email: string, password: string }): Promise<User> {
    if (secret.isSuccess) {
      const enc_pass = await secret.encrypt(login_data.password)
      return new Promise<User>((resolve, reject) => {
        const data = {
          email: login_data.email,
          enc_pass
        }

        server.post(`/login`, data)
          .then((res) => {
            const searchParams = new URLSearchParams(window.location.search);
            const redirect = searchParams.get('redirect')
            if (redirect) {
              location.href = decodeURIComponent(redirect)
            }
            const user = res.data as User
            setUser(user)
            resolve(user)
          })
          .catch((err) => {
            reject(err)
          })
          .finally(() => { setIsLoading(false) })

      })
    } else {
      secret.refetch()
      throw new Error('NO PUBLIC KEY')
    }
  }


  async function signUp(register_data: { first_name: string, last_name: string, email: string, phone: string, password: string }): Promise<User> {
    if (!secret.isSuccess) { secret.refetch(); throw new Error('NO PUBLIC KEY') } else {
      const enc_pass = await secret.encrypt(register_data.password)
      return new Promise<User>((resolve, reject) => {
        const data = {
          first_name: register_data.first_name,
          last_name: register_data.last_name,
          email: register_data.email,
          phone: register_data.phone,
          enc_pass: enc_pass
        }
        server.post('/register', data).then((res) => {
          const user = res.data as User
          setUser(user)
          resolve(user)
        }).catch((err) => {
          console.log(err)
          reject(err)
        })
      }).finally(() => { setIsLoading(false) })
    }
  }

  async function signOut(): Promise<void> {
    setIsLoading(true)
    return new Promise<void>((resolve, reject) => {
      server.delete('/logout').then(() => {
        localStorage.clear()
        setUser(null)
        goToSignInPage(false)
        resolve()
      }).catch((err) => {
        reject(err)
      })

    }).finally(() => { setIsLoading(false) })
  }

  return { user, get, signIn, signOut, signUp, goToSignInPage, isLoading }
})

export const useAuthenticated = new Contextor((config: { auth: Authenticated }) =>
  config.auth
)
