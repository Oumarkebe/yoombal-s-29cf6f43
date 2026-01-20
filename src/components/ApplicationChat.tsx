import React, { useState, useRef, useEffect } from 'react';
import { useApplicationMessages } from '@/hooks/useApplicationMessages';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Loader2, Check, CheckCheck, Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ApplicationChatProps {
  applicationId: string;
  isMerchant?: boolean; // To show Quick Replies
}

const QUICK_REPLIES = [
  'Bonjour, merci pour votre demande.',
  "Votre dossier est incomplet, merci d'ajouter une photo lisible de la CNI.",
  'Votre demande a été approuvée, félicitations !',
  "Merci de procéder au paiement de l'apport.",
  'Désolé, nous ne pouvons pas accepter ce dossier pour le moment.',
  "C'est noté, merci.",
];

const ApplicationChat: React.FC<ApplicationChatProps> = ({ applicationId, isMerchant = false }) => {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useApplicationMessages(applicationId);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setIsSending(true);
    await sendMessage(newMessage);
    setNewMessage('');
    setIsSending(false);
  };

  const handleQuickReply = (reply: string) => {
    setNewMessage(reply);
    // Optionally auto-send or just fill input
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[500px] border rounded-lg bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-10">
            Aucun message. Démarrez la conversation !
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;

          if (msg.message_type === 'system') {
            return (
              <div key={msg.id} className="flex justify-center my-4">
                <span className="bg-gray-200 text-gray-600 text-xs py-1 px-3 rounded-full">
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <div
                  className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {isMe && (
                    <span>
                      {msg.is_read ? (
                        <CheckCheck className="h-3 w-3" />
                      ) : (
                        <Check className="h-3 w-3" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t rounded-b-lg flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600">
          <Paperclip className="h-5 w-5" />
        </Button>

        {isMerchant && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-600">
                <Zap className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {QUICK_REPLIES.map((reply, i) => (
                <DropdownMenuItem key={i} onClick={() => handleQuickReply(reply)}>
                  <span className="truncate">{reply}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1 bg-gray-50 border-0 focus-visible:ring-1 focus-visible:ring-blue-100"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        <Button
          size="icon"
          onClick={handleSend}
          disabled={!newMessage.trim() || isSending}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-10 w-10 shrink-0"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4 ml-0.5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ApplicationChat;
