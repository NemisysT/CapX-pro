'use client'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserProfile {
  email: string | undefined
  fullName: string | undefined
}

export default function UserInfo() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: '',
    fullName: '',
  })
  const supabase = createClientComponentClient()
  
  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      setUserProfile({
        email: user?.email,
        fullName: user?.user_metadata?.full_name,
      })
    }
    getUserProfile()
  }, [supabase.auth])

  return (
    <Card className="bg-gradient-to-br from-[#1a1a1a] via-[#3a3a3a] to-[#0a0a0a] 
      border-2 border-gray-700 shadow-2xl rounded-xl 
      transition-all duration-300 hover:scale-[1.02] 
      hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
      <CardHeader>
        <CardTitle className="text-gray-100 
          bg-clip-text text-transparent 
          bg-gradient-to-r from-gray-300 to-gray-500 
          font-bold tracking-wider">
          User Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-6 p-4">
        <Avatar className="h-24 w-24 border-2 border-gray-600 
          ring-4 ring-gray-800 
          bg-gradient-to-br from-gray-700 to-gray-900">
          <AvatarImage 
            src="/placeholder.svg" 
            alt="User" 
            className="object-cover grayscale hover:grayscale-0 transition-all"
          />
          <AvatarFallback className="bg-gradient-to-br from-gray-700 to-gray-900 
            text-gray-300 font-bold text-2xl">
            {userProfile.fullName
              ? userProfile.fullName.split(' ').map(name => name[0]).join('')
              : 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h4 className="text-2xl font-semibold 
            bg-clip-text text-transparent 
            bg-gradient-to-r from-gray-200 to-gray-500 
            tracking-wide">
            {userProfile.fullName || 'Loading...'}
          </h4>
          <p className="text-gray-400 
            bg-clip-text text-transparent 
            bg-gradient-to-r from-gray-500 to-gray-600 
            font-medium tracking-wider">
            {userProfile.email || 'Loading...'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}