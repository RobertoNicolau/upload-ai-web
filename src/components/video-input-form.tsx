
import { Circle, FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { api } from "@/lib/axios";
import { type } from "os";

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success' | 'error'
const statusMessages = {
  converting: 'Convertendo...',
  uploading: 'Enviando...',
  generating: 'Gerando Transcrição...',
  success: 'Sucesso!',
  error: 'Erro'
}

interface VideoInputFormProps {
  onVideoUploaded: (videoId: string) => void
}

export function VideoInputForm({onVideoUploaded}: VideoInputFormProps){

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>){
    const { files } = event.currentTarget
    if(!files) return

    const selectedFile = files[0]

    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File){
    console.log('Conversion started')
    const ffmpeg = await getFFmpeg()// Continuar aqui
    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('progress', (progress) => {
      console.log('Progress', Math.round(progress.progress * 100))
    })

    await ffmpeg.exec([
      '-i', // input
      'input.mp4', // input
      '-map', // map
      '0:a', // audio stream
      '-b:a', // bitrate
      '20k', // 20kbps
      '-acodec', // audio codec
      'libmp3lame', // mp3
      'output.mp3' // output
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mp3' })

    const audioFile = new File([audioFileBlob], 'audio.mp3', { type: 'audio/mpeg' })
    console.log('Conversion finished')

    return audioFile
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if(!videoFile){
      return
    }
    setStatus('converting')
    const audioFile = await convertVideoToAudio(videoFile)
    
    const formData = new FormData()

    formData.append('file', audioFile)

    setStatus('uploading')
    const response = await api.post('/videos', formData)

    const videoId = response.data.video.id

    setStatus('generating')
    await api.post(`/videos/${videoId}/transcription`, {
      prompt
    })

    setStatus('success')
    console.log('Finished')
    onVideoUploaded(videoId)
  }

  const previewURL = useMemo(() => {
    if(!videoFile) return null

    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    
    <form className="space-y-6" onSubmit={handleUploadVideo}>
    <label 
    htmlFor="video" 
    className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/10"
    >
      { previewURL ? (
        <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0 aspect-video"/>
      ) : (
        <>
        <FileVideo className="w-8 h-8" />
      Carregar Vídeo
        </>
      )}
      
    </label>
    <input type="file" name="video" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected}/>
    <Separator />
    <div className="space-y-1">
      <Label htmlFor="transcription-prompt">Prompt de Transcrição</Label>
      <Textarea 
        ref={promptInputRef}
        disabled={status !== 'waiting'}
        id="transcription-prompt"
        placeholder="Inclua palavras-chave mencionadas no vídeo para a IA gerar o texto"
        className="resize-none min-h-20 leading-relaxed "
      />
    </div>

    <Button
      data-success={status === 'success'}
      disabled={status !== 'waiting'} 
      type="submit"
      className="w-full data-[success=true]:bg-emerald-400">
      {status === 'waiting' ? (
        <> Carregar Vídeo <Upload className="w-4 h-4 ml-2" /> </>
        ) : (
        <> {statusMessages[status]} </>
      )}
    </Button>
  </form>
  )
}