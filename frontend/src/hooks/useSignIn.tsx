import { UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "./useUser";
import { useNavigate } from "react-router-dom";
import { QUERY_KEY } from "../utils/queryKey";
import Cookies from 'js-cookie'
import { IUserResponse, useUserStore } from "../store/store";
import { toast } from "react-hot-toast";

async function signIn(payload: any): Promise<User> {
  const response = await fetch(
    `${import.meta.env.VITE_REACT_URL}/api/auth/login`,
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

/**
 * The `useSignIn` function is a custom hook that handles the sign-in process, including making a
 * sign-in mutation, updating the user data in the query cache, setting user data in local storage, and
 * navigating to the home page after successful sign-in.
 * @returns The `signInMutation` function is being returned.
 */
export function useSignIn(): ISignIn {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const setUser = useUserStore(state => state.setUser)

  const { mutate: signInMutation } = useMutation<User, unknown, { email: string; password: string; token: string; }, unknown>(({ email, password, token }) => toast.promise(signIn({ email, password, token }), {
    loading: 'Logging In...',
    success: <b>Logged In 🎉</b>,
    error: <b>Error Logging you in.</b>,
  }), {
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

/**
 * The function redirects the user to the login page if they are not authenticated.
 */
export function redirectIfNotAuthenticated() {
  const cookie = Cookies.get('token')
  if (!cookie) {
    window.location.href = '/login'
  }
}