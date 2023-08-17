import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Output from 'editorjs-react-renderer'

export default function Entry() {
  const [entry, setEntry] = useState(null)
  const [executing, setExecuting] = useState(false)
  const [content, setContent] = useState(null)
  const entryID = useParams().id
  console.log('Id::', entryID)

  async function fetchEntry() {
    setExecuting(true)
    const response = await fetch(
      `${import.meta.env}/api/jot/${entryID}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )
    if (response.ok) {
      console.log('Response::', response)
      const data = await response.json()

      const content = {
        "blocks": data.content
      }
      setEntry(data)
      setContent(content)
    }
    setExecuting(false)
  }

  useEffect(() => {
    console.log('Fetching entry...')
    fetchEntry()
  }, [])

  return (
    <div className='m-8 '>
      {executing && <p>Loading...</p>}
      {entry && <p className='mb-8 text-3xl font-bold underline decoration-wavy decoration-[#FCDAAB]'
      >{entry.title}</p>}
      {entry && <Output data={content} />}
    </div>
  )
}