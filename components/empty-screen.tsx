import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
        Olá Francisco! Sou o Stênio, assistente de negócios da Stone.
        </h1>
        <p className="leading-normal text-muted-foreground">
          Como posso auxiliar você a gerenciar seu negócio e encantar seus clientes hoje? Você pode tanto escrever na barra de texto abaixo ou, se preferir, pode conversar diretamente comigo apertando no ícone do telefone. Estou à disposição para ajudar!
        </p>
      </div>
    </div>
  )
}
