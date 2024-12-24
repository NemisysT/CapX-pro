import { Bell, Search, User } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b-1 border-gray-200">
      <div className="flex items-center">
        <Input type="text" placeholder="Search..." className="text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent" />
        <Button variant="ghost" size="icon" className="ml-2">
          <Search className="h-5 w-5 text-gray-500" />
        </Button>
      </div>
      <div className="flex items-center">
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

