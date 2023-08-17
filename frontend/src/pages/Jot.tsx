import { Editor } from "../components/Editor";

export default function Jot() {
  return (
    <div className="w-full h-1/2">
      <h1 className="text-3xl font-bold mb-10 ml-10">What is your Entry Today?</h1>
      <Editor />
    </div>
  )
}