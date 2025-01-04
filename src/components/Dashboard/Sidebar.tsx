'use client'

import { useState } from 'react'
import { Home, PieChart, BarChart3, LogOut, UserCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


export default function Sidebar() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isCollapsed, setIsCollapsed] = useState(false)
  
    
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  
    
  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '4rem' }
  }

  const menuItems = [
    { icon: Home, text: "Dashboard", link: '/dashboard' },
    { icon: PieChart, text: "Stock Holding", link: '/Stock-holdings' },
    { icon: BarChart3, text: "Track Portfolio", link: '/portfolio' },
    { icon: UserCircle, text: "Profile", link: '/user' },
  ]

  return (
    <TooltipProvider>
      <motion.div 
        className="flex flex-col h-screen bg-background border-r"
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
      >
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && <h1 className="text-2xl font-bold">CapX</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 py-4">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.link}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${isCollapsed ? 'px-2' : 'px-4'}`}
                      >
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && <span className="ml-2">{item.text}</span>}
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right">{item.text}</TooltipContent>}
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t space-y-2">
          
          <Button 
            onClick={handleLogout}
            variant="destructive" 
            className="w-full justify-start"
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}

