import { UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "./useUser";
import { useNavigate } from "react-router-dom";
import { QUERY_KEY } from "../utils/queryKey";
import Cookies from 'js-cookie'
import { IUserResponse, useUserStore } from "../store/store";

async function signIn(payload: any): Promise<User> {
  const response = await fetch(
    `${process.env.VITE_REACT_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  )
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}
export type ISignIn = UseMutateFunction<User, unknown, {
  email: string;
  password: string;
  token: string;
}, unknown>

export function useSignIn(): ISignIn {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const setUser = useUserStore(state => state.setUser)

  const { mutate: signInMutation } = useMutation<User, unknown, { email: string; password: string; token: string; }, unknown>(({ email, password, token }) => signIn({ email, password, token }), {
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY.user], data)
      setUser(data as IUserResponse)
      Cookies.set('token', data.token, { expires: 1 })
      Cookies.set('user', JSON.stringify(data), { expires: 1 })
      navigate('/')
    },
    onError: (error) => {
      console.log(error)
    }
  })
  return signInMutation
}

export function redirectIfNotAuthenticated() {
  const cookie = Cookies.get('token')
  console.log("found cookie", cookie)
  if (!cookie) {
    window.location.href = '/login'
  }
}