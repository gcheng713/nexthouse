"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Home, Newspaper, Search, Sun, Moon, LogIn, UserPlus } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from 'framer-motion'

export default function Navigation() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const isActive = (path: string) => pathname === path

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home
    },
    {
      name: 'Properties',
      path: '/property-search',
      icon: Search
    },
    {
      name: 'News',
      path: '/news',
      icon: Newspaper
    },
    {
      name: 'Developments',
      path: '/developments',
      icon: Building2
    }
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-500">
            NextHouse
          </span>
        </Link>

        <div className="flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                href={item.path}
                className={\`flex items-center space-x-2 transition-colors hover:text-foreground/80 \${
                  isActive(item.path)
                    ? 'text-foreground'
                    : 'text-foreground/60'
                }\`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>

        <div className="flex-1" />

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <div className="hidden sm:flex space-x-2">
            <Link href="/login">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>

            <Link href="/signup">
              <Button 
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </Link>
          </div>

          <div className="sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <LogIn className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link href="/login" className="flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/signup" className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
