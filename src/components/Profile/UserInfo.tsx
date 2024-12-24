import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserInfo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Information</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="text-xl font-semibold">John Doe</h4>
          <p className="text-gray-500">john.doe@example.com</p>
          <p className="text-gray-500">Member since: Jan 1, 2023</p>
        </div>
      </CardContent>
    </Card>
  )
}

