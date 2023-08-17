import { UseMutateFunction, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { QUERY_KEY } from "../utils/queryKey";
import { toast } from "react-hot-toast";

export type JournalEntry = {
  id: number;
  title: string;
  content: string[];
  createdAt: Date;
  userId: string;
}
export async function fetchJournalEntries() {
  const response = await fetch(
    `${import.meta.env.VITE_REACT_URL}/api/jot`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  )

  if (response.ok) return response.json()
}

export async function createJournalEntry(payload: any) {
  const response = await fetch(
    `${import.meta.env.VITE_REACT_URL}/api/jot`,
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

/**
 * The `useJournalEntries` function is a custom hook that handles the creation and fetching of journal
 * entries, and returns the necessary data and functions for managing journal entries in a React
 * component.
 * @returns The function `useJournalEntries` returns an object with three properties:
 */
export function useJournalEntries() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutate: createJournalMutation } = useMutation<JournalEntry, unknown, any, unknown>((payload) => toast.promise(createJournalEntry(payload), {
    loading: 'Creating Journal...',
    success: <b>Journal saved!</b>,
    error: <b>Could not created.</b>,
  }), {
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
