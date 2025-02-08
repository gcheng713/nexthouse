"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const documents = [
  { id: 1, name: "Purchase Agreement" },
  { id: 2, name: "Disclosure Statement" },
  { id: 3, name: "Mortgage Application" },
]

export default function DocumentSigning() {
  const [signedDocs, setSignedDocs] = useState<number[]>([])

  const handleSign = (docId: number) => {
    setSignedDocs((prev) => [...prev, docId])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the signed documents to your backend
    console.log("Submitting signed documents:", signedDocs)
  }

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Document Signing</h2>
      <form onSubmit={handleSubmit}>
        {documents.map((doc) => (
          <div key={doc.id} className="mb-4 flex items-center">
            <Checkbox
              id={`doc-${doc.id}`}
              checked={signedDocs.includes(doc.id)}
              onCheckedChange={() => handleSign(doc.id)}
            />
            <Label htmlFor={`doc-${doc.id}`} className="ml-2">
              {doc.name}
            </Label>
          </div>
        ))}
        <Button type="submit" className="w-full">
          Submit Signed Documents
        </Button>
      </form>
    </div>
  )
}

