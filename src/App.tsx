import { Github,  Wand2 } from "lucide-react";

import { Button } from "./components/ui/button";
import { Separator } from "./components/ui/separator";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { VideoInputForm } from "./components/video-input-form";


export function App() {

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-3 flex items-center justify-between border-b">
        <h1 className="text-xl font-bold">upload.ai</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Desenvolvido com ❤️ pelo Robertonha</span>
          <Separator orientation="vertical" className="h-6" />
          <Button variant="outline">
            <Github className="w-4 h-4 mr-2" />
            Github</Button>
        </div>
      </div>

      <main className="flex-1 p-6 flex gap-6">
      <div className="flex flex-col flex-1 gap-4">
      <div className="grid grid-rows-2 gap-4 flex-1">
      <Textarea 
        placeholder="Inclua o prompt para a IA..."
        className="resize-none p-5 leading-relaxed"
        />
      <Textarea 
        placeholder="Resultado gerado pela IA"
        className="resize-none p-5 leading-relaxed"
        readOnly
        />
      </div>

      <p className="text-sm text-muted-foreground">Lembre-se: Você pode utilizar a variável <code className="text-violet-400">{'{transcription}'}</code>  no seu prompt para adiocionar o conteudo da transcrição do vídeo selecionado</p>
      </div>

      {/* Sidebar */}
      <aside className="w-80 space-y-6">
        <VideoInputForm />

        <Separator />
        <form className="space-y-6">
          
        <div className="space-y-1">
            <Label>Prompt</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um prompt"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">
                  Título do Youtube
                </SelectItem>
                <SelectItem value="description">
                  Descrição do Youtube
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Selecione o Modelo</Label>
            <Select disabled defaultValue="gpt3.5">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt3.5">
                  GPT 3.5-Turbo 16k
                </SelectItem>
              </SelectContent>
            </Select>
            <span className="block text-xs text-muted-foreground italic">Você podera customizar essa opção em breve</span>
          </div>
          
          <div
            className="space-y-4"
          >
            <Label>Temperatura</Label>
            <Slider 
              min={0.1}
              max={1}
              step={0.1}
              defaultValue={[0.5]}
              className="w-full"
            />
            <span className="block text-xs text-muted-foreground italic">
              Valores mais altos geram resultados mais criativos, mas menos precisos
              </span>
          </div>

          <Separator />

          <Button className="w-full">
            Executar
            <Wand2 className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </aside>
      </main>
    </div>
  )
}
