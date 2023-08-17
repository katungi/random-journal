import EditorJS from "@editorjs/editorjs";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { useJournalEntries } from "../hooks/useJournal";
import Cookies from 'js-cookie';

interface IJournalProps { }

export const Editor: React.FC<IJournalProps> = () => {
  const { register, handleSubmit } = useForm();
  const ref = React.useRef<EditorJS | null>(null);
  const titleRef = React.useRef<HTMLTextAreaElement>(null);
  const { user } = JSON.parse(Cookies.get('user'))

  function couldBeCounted(block) {
    return 'text' in block.data // it depends on tools you use
  }

  function getBlocksTextLen(blocks) {
    return blocks
      .filter(couldBeCounted)
      .reduce((sum, block) => {
        sum += block.data.text.length
        return sum
      }, 0)
  }

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import('@editorjs/editorjs')).default;
    const Header = (await import('@editorjs/header')).default;
    const Paragraph = (await import('@editorjs/paragraph')).default;
    const LinkTool = (await import('@editorjs/link')).default;
    const Marker = (await import('@editorjs/marker')).default;

    if (!ref.current) {
      const editor = new EditorJS({
        onChange: async (api, event: any) => {
          function couldBeCounted(block) {
            return 'text' in block.data // it depends on tools you use
          }

          function getBlocksTextLen(blocks) {
            return blocks
              .filter(couldBeCounted)
              .reduce((sum, block) => {
                sum += block.data.text.length

                return sum
              }, 0)
          }
          const limit = 500
          const content = await api.saver.save()
          const contentLen = getBlocksTextLen(content.blocks)

          if (contentLen <= limit) {
            return
          }
          const workingBlock = event.detail.target
          const workingBlockIndex = event.detail.index
          const workingBlockSaved = content.blocks.filter(block => block.id === workingBlock.id).pop()
          const otherBlocks = content.blocks.filter(block => block.id !== workingBlock.id)
          const otherBlocksLen = getBlocksTextLen(otherBlocks)
          const workingBlockLimit = limit - otherBlocksLen

          api.blocks.update(workingBlock.id, {
            text: workingBlockSaved.data.text.substr(0, workingBlockLimit)
          })

          api.caret.setToBlock(workingBlockIndex, 'end')

        },
        holder: 'editor',
        onReady: () => { ref.current = editor; },
        placeholder: 'Start writing your journal entry here...',
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          marker: Marker,
          header: {
            class: Header as any,
            config: {
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 1
            }
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
          },
          linkTool: {
            class: LinkTool,
          },
        }
      });
    }
  }, []);

  useEffect(() => {
    initializeEditor();
  }, [initializeEditor]);

  const { ref: titleInputRef, ...rest } = register('title');
  const { createJournalMutation } = useJournalEntries();

  async function onSubmit(data) {
    const { blocks } = await ref.current.save();
    const payload = {
      title: data.title,
      content: blocks,
      user: user.id
    }
    console.log(payload);
    createJournalMutation(payload);
  }

  return (
    <div className='w-full p-4 rounded-lg flex flex-col'>
      <form id={'journal-form'} onSubmit={handleSubmit(onSubmit)}>
        <div className="mx-10 mb-4">
          <TextareaAutosize
            ref={(e) => { titleRef.current = e; titleInputRef(e); }}
            placeholder='Enter Title Here'
            className='w-full resize-none appearance-none overflow-hidden bg-transparent text-3xl font-bold focus:outline-none'
            {...rest}
          />
          <hr />
        </div>
        <div className='prose prose-stone dark:prose-invert mx-10'>
          <div id='editor' className='flex mb-4' />
          <p className='text-sm text-gray-500'>
            Use{' '}
            <kbd className='rounded-md border bg-muted px-1 text-xs uppercase'>
              Tab
            </kbd>{' '}
            to open the command menu. Remember, 500 characters only
          </p>
        </div>
        <button className="mt-20 ml-10 bg-[#FCDAAB] hover:bg-[#FF494A] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Save Journal
        </button>
      </form>
    </div>
  )
}
