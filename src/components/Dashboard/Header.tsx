import { Bell, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex items-center justify-end px-6 py-4 bg-white border-b-1 border-gray-200">
      
      <div className="flex items-center ">
        <Button variant="ghost" size="icon" className="mr-4">
          <Bell className="h-5 w-5 text-gray-500" />
        </Button>
        <Link href='/user' >
          <User  className="h-5 w-5 text-gray-500" />
        </Link>
      </div>
    </header>
  )
}

