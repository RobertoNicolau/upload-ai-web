
import { FileVideo, Upload } from "lucide-react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";

export function VideoInputForm(){

  const [videoFile, setVideoFile] = useState<File | null>(null)
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>){
    const { files } = event.currentTarget
    if(!files) return

    const selectedFile = files[0]

    setVideoFile(selectedFile)
  }

  function convertVideoToAudio(video: File){
    const ffmpeg = getFFmpeg()// Continuar aqui
  }

  function handleUploadVideo(event: FormEvent<HTMLFormElement>){
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if(!videoFile){
      return
    }
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
        id="transcription-prompt"
        placeholder="Inclua palavras-chave mencionadas no vídeo para a IA gerar o texto"
        className="resize-none min-h-20 leading-relaxed "
      />
    </div>

    <Button type="submit" className="w-full">
      Carregar Vídeo
      <Upload className="w-4 h-4 ml-2" />
    </Button>
  </form>
  )
}