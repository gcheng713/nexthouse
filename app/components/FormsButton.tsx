"use client"

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

export default function FormsButton() {
  const router = useRouter()

  return (
    <motion.button
      onClick={() => router.push('/forms')}
      className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-xl flex items-center space-x-2 group transition-all duration-300 z-50 backdrop-blur-sm bg-opacity-90"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <DocumentTextIcon className="h-6 w-6" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap">
        Forms Library
      </span>
    </motion.button>
  )
}
