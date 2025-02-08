import DocumentFinder from "../components/DocumentFinder"

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center purple-glow">Document Search</h1>
        <DocumentFinder onSearch={(query) => console.log(query)} />
      </div>
    </div>
  )
}

