'use client'

import { Home, PieChart, BarChart3, LogOut, UserCircle } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const router = useRouter()
  const supabase = createClientComponentClient()
    
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }
    
  return (
    <div className="flex flex-col w-64 bg-white h-screen">
      <div className="flex items-center justify-center h-20 shadow-md">
        <h1 className="text-3xl uppercase text-black">CapX</h1>
      </div>
      <ul className="flex flex-col py-4 flex-1">
        {[
          { icon: Home, text: "Dashboard", link: '/dashboard' },
          { icon: PieChart, text: "Stock Holding", link: '/Stock-holdings' },
          { icon: BarChart3, text: "Track your Portfolio", link: '/portfolio' },
          { icon: UserCircle, text: "Profile", link: '/user' },
        ].map((item, index) => (
          <li key={index}>
            <Link href={item.link} className="w-full justify-start text-black hover:bg-gray-200">
              <span className='flex flex-row m-4'>
                <item.icon className="mr-3 h-5 w-5" />
                {item.text}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {/* Logout Button at bottom */}
      <div className="p-4 border-t">
        <Button 
          onClick={handleLogout}
          variant="ghost" 
          className="w-full flex items-center justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}

