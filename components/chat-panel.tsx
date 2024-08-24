'use client'
import * as React from 'react'

import { shareChat } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconShare } from '@/components/ui/icons'
import { ChatShareDialog } from '@/components/chat-share-dialog'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'
import { PhoneOff } from 'lucide-react'
import { LiveAudioVisualizer } from 'react-audio-visualize';


export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom
}: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)
  const [calling, setCalling] = React.useState(false)
  const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder>();


  const exampleMessages = []

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        {!calling ? 
          <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
            <PromptForm input={input} setInput={setInput} calling={calling} setCalling={setCalling} setMediaRecorder={setMediaRecorder} />
          </div>
        : 
          <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
            <div className='flex justify-end'>
              <div className='px-6 py-3'>
                {mediaRecorder && (
                  <LiveAudioVisualizer
                    mediaRecorder={mediaRecorder}
                    width={500}
                    height={75}
                    barColor={'#00a868'}
                  />
                )}
              </div>
              <Button
                variant='destructive'
                size='icon'
                onClick={(e) => setCalling(false)}
                className='my-auto'
              >
                <PhoneOff 
                  //color="#ffffff"
                  strokeWidth={1.75}
                />
              </Button>
            </div>
          </div>
        }
      </div>
    </div>
  )
}
