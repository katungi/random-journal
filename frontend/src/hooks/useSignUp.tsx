import { UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { QUERY_KEY } from "../utils/queryKey";
import { User } from "./useUser";
import Cookies from 'js-cookie';

type IUserPayload = {
  email: string;
  password: string;
  username: string;
}

async function register(payload: IUserPayload) {
  const response = await fetch(`${process.env.VITE_REACT_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok)
    return { error: response.statusText }

  return await response.json()
}

type IUseSignUp = UseMutateFunction<User, unknown, {
  email: string;
  password: string;
  username: string;
}, unknown>

export function useSignUp(): IUseSignUp {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signUpMutation } = useMutation<User, unknown, { email: string, password: string, username: string }, unknown>(
    ({ email, password, username }) => register({ email, password, username }), {
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY.user], data);
      Cookies.set('token', data.token);
      Cookies.set('user', JSON.stringify(data), { expires: 1 })
      navigate('/login');
    },
    onError: (error) => {
      console.log(error)
    }
  });

  return signUpMutation
}
