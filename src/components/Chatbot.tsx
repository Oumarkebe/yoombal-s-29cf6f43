
import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useChatbotStatus } from '@/hooks/useChatbotStatus';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

async function getChatbotResponse(messages: Message[]) {
  const { data, error } = await supabase.functions.invoke('chatbot', {
    body: { messages },
  });

  if (error) {
    console.error('Error invoking chatbot function:', error);
    throw new Error("Désolé, une erreur de communication avec l'assistant s'est produite. Veuillez réessayer.");
  }
  
  if (data.error) {
    console.error('Chatbot function returned an error:', data.error);
    throw new Error(data.error);
  }

  if (!data.response) {
    console.error('Chatbot function returned no response and no error.');
    throw new Error("L'assistant n'a pas pu générer de réponse. Veuillez réessayer.");
  }

  return data.response;
}

export default function Chatbot() {
  const { data: isEnabled, isLoading: isStatusLoading } = useChatbotStatus();
  const { user, isLoading: authLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Bonjour ! Je suis l'assistant Yoombal. Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: getChatbotResponse,
    onSuccess: (response: string) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    },
    onError: (error: Error) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: error.message }]);
    }
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '' || mutation.isPending || !user) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: inputValue }];
    setMessages(newMessages);
    setInputValue('');

    mutation.mutate(newMessages.slice(-5));
  };
  
  if (isStatusLoading || !isEnabled) {
    return null;
  }

  const isChatDisabled = mutation.isPending || (!user && !authLoading);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white shadow-lg transition-transform hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
        <Card className="fixed bottom-20 right-4 z-50 w-full max-w-sm flex flex-col shadow-xl animate-fade-in-up">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-full">
                <Bot className="w-6 h-6 text-amber-600" />
              </div>
              <CardTitle className="text-lg">Assistant Yoombal</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1 bg-white">
            <ScrollArea className="h-96 w-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      'flex items-start gap-3',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Bot className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'p-3 rounded-lg max-w-[80%] text-sm',
                        message.role === 'user'
                          ? 'bg-amber-500 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      )}
                    >
                      {message.content}
                    </div>
                     {message.role === 'user' && (
                      <div className="p-2 bg-blue-100 rounded-full">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                ))}
                {mutation.isPending && (
                  <div className="flex items-center gap-3 justify-start">
                     <div className="p-2 bg-gray-100 rounded-full">
                        <Bot className="w-5 h-5 text-gray-600" />
                      </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                       <Loader2 className="w-5 h-5 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t pt-4 bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={!user && !authLoading ? "Connectez-vous pour discuter" : "Posez votre question..."}
                disabled={isChatDisabled}
                className="bg-white"
              />
              <Button type="submit" size="icon" disabled={isChatDisabled || !inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
