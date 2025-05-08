import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/ui/logo"
import type React from "react"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2D1674] text-white p-6">
        <div className="mb-6">
          <Logo size="md" />
        </div>
        <nav className="space-y-4">
          <Link href="/dashboard" className="block hover:text-[#00B4FF] transition-colors">
            Dashboard
          </Link>
          <Link href="/prescriptions" className="block hover:text-[#00B4FF] transition-colors">
            Prescriptions
          </Link>
          <Link href="/recommendations" className="block hover:text-[#00B4FF] transition-colors">
            Recommendations
          </Link>
          <Link href="/chat" className="block hover:text-[#00B4FF] transition-colors">
            AI Assistant
          </Link>
          <Link href="/medications" className="block hover:text-[#00B4FF] transition-colors">
            Médicaments
          </Link>
          <Link href="/profile" className="block hover:text-[#00B4FF] transition-colors">
            Profile
          </Link>
          <Link href="/ai-analysis" className="block hover:text-[#00B4FF] transition-colors">
            AI Analysis
          </Link>
          <Link href="/logout" className="block hover:text-[#00B4FF] transition-colors">
            Logout
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@johndoe" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">john.doe@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/support">Support</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}

