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
  const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder|null>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null)
  const analyserRef = React.useRef<AnalyserNode | null>(null)
  const silenceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const sendAudioToApi = async (blob: Blob) => {
    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');

    try {
      const response = await fetch('https://stenio-api.fly.dev/transcribeAudio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json(); // Parse the JSON from the response
        console.log('Audio file uploaded successfully');
        console.log(data.message); // Access and log the message from the response
    
      } else {
        console.error('Failed to upload audio file');
      }
    } catch (error) {
      console.error('Error uploading audio file', error);
    }
  };

  const handleDataAvailable = (event: BlobEvent) => {
    if (event.data.size > 0) {
      console.log("Audio chunk captured");

      // Send the audio chunk to the API
      sendAudioToApi(event.data);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = handleDataAvailable;
      recorder.start();

      setMediaRecorder(recorder);
      setCalling(true)

      monitorAudioLevels();
    } catch (err) {
      console.error("Error accessing microphone", err);
    }
  };

  const monitorAudioLevels = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;

    const dataArray = new Uint8Array(analyser.fftSize);
    const checkSilence = () => {
      analyser.getByteTimeDomainData(dataArray);

      const isSilent = !dataArray.some(value => value > 128 + 5 || value < 128 - 5); // Detect silence

      if (isSilent) {
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            stopRecording();
            // Optionally, call your API here with the recorded data
          }, 1500); // 1.5 seconds of silence
        }
      } else {
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      }

      if (mediaRecorder) {
        requestAnimationFrame(checkSilence); // Continue monitoring if recording is active
      }
    };

    checkSilence();
  };


  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setMediaRecorder(null);

      // Cleanup audio context and analyser
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    }
  };

  const endCall = () => {
    setCalling(false);
    stopRecording();
  };
  

  const exampleMessages = []

  React.useEffect(() => {
    if (calling) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [calling]);


  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        {!calling ? 
          <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
            <PromptForm input={input} setInput={setInput} startRecording={startRecording} />
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
                onClick={(e) => endCall()}
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
