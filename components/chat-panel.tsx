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
import { start } from 'repl'


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
  const [recording, setRecording] = React.useState(false)
  const [mediaRecorder, setMediaRecorder] = React.useState<MediaRecorder|null>(null);
  const audioContextRef = React.useRef<AudioContext | null>(null)
  const analyserRef = React.useRef<AnalyserNode | null>(null)
  const silenceTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const [isCallActive, setIsCallActive] = React.useState(false)

const stopRecording = () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
    setMediaRecorder(null);

    // Cleanup audio context and analyser
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;

    // Clear any remaining silence timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    setRecording(false);
  }
};

const monitorAudioLevels = () => {
  const analyser = analyserRef.current;
  if (!analyser) return;

  const dataArray = new Uint8Array(analyser.fftSize);
  let silenceStartTime = Date.now();
  const silenceThreshold = 1500; // 1 second of silence

  const checkSilence = () => {
    analyser.getByteTimeDomainData(dataArray);

    const isSilent = !dataArray.some(value => value > 128 + 5 || value < 128 - 5);

    if (isSilent) {
      if (Date.now() - silenceStartTime >= silenceThreshold) {
        stopRecording();
        return; // Stop checking once we've stopped recording
      }
    } else {
      silenceStartTime = Date.now(); // Reset silence start time when sound is detected
    }

    if (mediaRecorder && mediaRecorder.state === "recording") {
      requestAnimationFrame(checkSilence);
    }
  };

  // Wait a short time before starting to check for silence
  setTimeout(() => {
    checkSilence();
  }, 1000);
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
      setRecording(true);

      // Reset silence detection
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }

      monitorAudioLevels();
    } catch (err) {
      console.error("Error accessing microphone", err);
    }
  };

  const sendAudioToApi = async (blob: Blob) => {

    const formData = new FormData();
    formData.append('file', blob, 'recording.webm');

    try {
      const response = await fetch('https://stenio-api.fly.dev/getResponseAudio', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        // Create a blob from the response binary data
        const audioBlob = await response.blob();
        
        // Create a URL for the blob and play it
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
  
        // When the audio finishes playing, start recording again
        console.log(isCallActive)
        audio.onended = () => {
          if (isCallActive) {startRecording();}
        };
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
  };
}


  /*
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
          }, 1000); // 1.5 seconds of silence
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
  */
  // Add this function to start the call
  React.useEffect(() => {
    if (isCallActive) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isCallActive]);
  
  const startCall = () => {
    setIsCallActive(true);
  };

  const endCall = () => {
    stopRecording();
    setIsCallActive(false);
  };
  

  const exampleMessages = []

  React.useEffect(() => {
    if (recording && isCallActive) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [recording]);


  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        {!isCallActive ? 
          <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
            <PromptForm input={input} setInput={setInput} startRecording={startCall} />
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
