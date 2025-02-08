'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface FormResult {
  name: string;
  description: string;
  url: string;
  pdfUrl?: string;
  jurisdiction: string;
  requiredFor?: string[];
  lastUpdated?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  forms?: FormResult[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({ state: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          location: location.state ? { state: location.state } : undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          forms: data.forms
        }]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormList = (forms: FormResult[]) => (
    <div className="mt-4 space-y-4">
      {forms.map((form, index) => (
        <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
          <h3 className="font-semibold text-lg">{form.name}</h3>
          <p className="text-gray-600 mt-1">{form.description}</p>
          <div className="mt-2 space-y-1 text-sm">
            <p><span className="font-medium">Jurisdiction:</span> {form.jurisdiction}</p>
            {form.lastUpdated && (
              <p><span className="font-medium">Last Updated:</span> {form.lastUpdated}</p>
            )}
            {form.requiredFor && (
              <p><span className="font-medium">Required For:</span> {form.requiredFor.join(', ')}</p>
            )}
          </div>
          <div className="mt-3 space-x-2">
            <a
              href={form.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Form
            </a>
            {form.pdfUrl && (
              <a
                href={form.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download PDF
              </a>
            )}
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Real Estate Forms Assistant</h1>
        
        {/* Location Selection */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Enter your state (e.g., California)"
            value={location.state}
            onChange={(e) => setLocation({ state: e.target.value })}
            className="max-w-md"
          />
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index}>
              <div
                className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-100 ml-12'
                    : 'bg-gray-100 mr-12'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.forms && message.forms.length > 0 && renderFormList(message.forms)}
            </div>
          ))}
          {isLoading && (
            <div className="bg-gray-100 p-4 rounded-lg mr-12">
              <p>Searching for forms...</p>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about specific forms or requirements..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>

        {/* Helper Text */}
        <p className="text-sm text-gray-500 mt-4">
          Enter your state above and ask about specific forms, contracts, or documentation requirements.
          I'll find official forms and resources for your jurisdiction.
        </p>
      </Card>
    </div>
  );
}
