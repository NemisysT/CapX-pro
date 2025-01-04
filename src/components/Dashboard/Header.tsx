import { User } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex items-center justify-end px-6 py-4 bg-white border-b-1 border-gray-200">
      
      <div className="flex items-center ">
        
        <Link href='/user' >
          <User  className="h-5 w-5 text-gray-500" />
        </Link>
      </div>
    </header>
  )
}

