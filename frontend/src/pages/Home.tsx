import { useEffect, useState } from "react"
import { redirectIfNotAuthenticated } from "../hooks/useSignIn"
import Cookies from "js-cookie"

export default function Home() {
  const cookies = Cookies.get('user')
  const user = cookies ? JSON.parse(cookies).user : null
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  async function fetchJournalEntry(id: string) {
    setIsLoading(true)
    const response = await fetch(
      `${import.meta.env.VITE_REACT_URL}/api/jot/user/${id}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )
    setIsLoading(false)
    if (response.ok) return response.json()
  }

  useEffect(() => {
    (async () => {
      if (!user) {
        redirectIfNotAuthenticated()
      } else {
        const entries = await fetchJournalEntry(user.id)
        setEntries(entries)
      }
    })().catch((error) => { console.log(error) })
  }, [])

  return (
    <div className='p-20'>
      <h1 className='w-1/2 resize-none appearance-none overflow-hidden bg-transparent text-3xl font-bold focus:outline-none'>Your Journal Entries</h1>
      <hr />
      {isLoading && <p>Loading...</p>}
      {!isLoading && entries && entries.map((entry) => (
        <a key={entry.id} href={`/jots/${entry.id}`} className='m-8 font-bold underline decoration-wavy decoration-[#FCDAAB]'>
          <h2 className='mb-2'>{entry.title}</h2>
        </a>
      ))}
    </div>
  )
}