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
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback>
            {userProfile.fullName
              ? userProfile.fullName.split(' ').map(name => name[0]).join('')
              : 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-xl font-semibold">{userProfile.fullName || 'Loading...'}</h4>
          <p className="text-gray-500">{userProfile.email || 'Loading...'}</p>
          
        </div>
      </CardContent>
    </Card>
  )
}

