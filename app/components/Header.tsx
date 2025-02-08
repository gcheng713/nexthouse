import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ThemeToggle"

export default function Header() {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold futuristic-text">
          NextHouse
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/properties">
            <Button className="button-gradient">Properties</Button>
          </Link>
          <Link href="/services">
            <Button className="button-gradient">Services</Button>
          </Link>
          <Link href="/about">
            <Button className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700">
              About
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}

