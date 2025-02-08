'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
          location: location ? { state: location } : undefined
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message 
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

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Real Estate Forms Assistant</h1>
        
        {/* Location Input */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Enter your state (e.g., California)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100 ml-12'
                  : 'bg-gray-100 mr-12'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
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
          I'll help you find official forms and resources for your jurisdiction.
        </p>
      </Card>
    </div>
  );
}
