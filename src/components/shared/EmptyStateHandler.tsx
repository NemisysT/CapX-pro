'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface EmptyStateHandlerProps {
  title?: string
  message?: string
}

export default function EmptyStateHandler({ 
  title = "No Holdings Found", 
  message = "Start by adding some stocks to your portfolio" 
}: EmptyStateHandlerProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      <Button onClick={() => router.push('/Stock-holdings')}>
        Add Your First Stock
      </Button>
    </div>
  )
} 