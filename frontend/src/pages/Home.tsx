import { useEffect } from "react"
import { redirectIfNotAuthenticated } from "../hooks/useSignIn"
import { useJournalEntries } from "../hooks/useJournal"

export default function Home() {
  const { isLoading, journalEntries } = useJournalEntries()
  console.log(journalEntries)
  useEffect(() => {
    redirectIfNotAuthenticated()
  }, [])
  return (
    <div className='p-20'>
      <h1>Your Journal Entries</h1>
      {isLoading && <p>Loading...</p>}
      {!isLoading && journalEntries && journalEntries.map((entry) => (
        <a key={entry.id} href={`/jots/${entry.id}`}>
          <h2>{entry.title}</h2>
        </a>
      ))}
    </div>
  )
}