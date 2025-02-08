import AIRecommendations from "../components/AIRecommendations"
import DocumentAnalytics from "../components/DocumentAnalytics"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center purple-glow">Document Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="light-card rounded-lg p-6 hover-glow">
            <AIRecommendations searchQuery="" />
          </div>
          <div className="light-card rounded-lg p-6 hover-glow">
            <DocumentAnalytics searchQuery="" />
          </div>
        </div>
      </div>
    </div>
  )
}

