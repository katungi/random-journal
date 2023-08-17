import { UseMutateFunction, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { User } from "./useUser";
import { useNavigate } from "react-router-dom";
import { QUERY_KEY } from "../utils/queryKey";

export type JournalEntry = {
  id: number;
  title: string;
  content: string[];
  createdAt: Date;
  userId: string;
}
export async function fetchJournalEntries() {
  const response = await fetch(
    `${process.env.VITE_REACT_URL}/api/jot`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  if (response.ok) return response.json()
}

export async function createJournalEntry(payload: any) {
  const response = await fetch(
    `${process.env.VITE_REACT_URL}/api/jot`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }
  )

  if (response.ok) {
    return response.json()
  }
}

export type IJournal = UseMutateFunction<JournalEntry, unknown, any, unknown>

export function useJournalEntries() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: createJournalMutation } = useMutation<JournalEntry, unknown, any, unknown>((payload) => createJournalEntry(payload), {
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY.journal], data)
      navigate('/')
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const { data: journalEntries, isLoading } = useQuery<JournalEntry[], unknown, JournalEntry[]>([QUERY_KEY.journal], fetchJournalEntries, {
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY.journal], data)
    }
  })
  return { createJournalMutation, isLoading, journalEntries }
}
