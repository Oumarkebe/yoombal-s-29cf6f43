import React, { useEffect, useRef, useState } from 'react';
import { Send, Image as ImageIcon, X, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { Message, ChatUser } from '@/hooks/useChat';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatWindowProps {
    messages: Message[];
    otherUser?: ChatUser;
    onSendMessage: (content: string) => void;
    onClose: () => void;
    isSending: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    messages,
    otherUser,
    onSendMessage,
    onClose,
    isSending
}) => {
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-amber-600 text-white rounded-t-lg">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border border-amber-200">
                        <AvatarImage src={otherUser?.avatar_url || ''} />
                        <AvatarFallback className="text-amber-700 bg-amber-100">
                            {otherUser?.first_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-sm font-semibold">
                            {otherUser ? `${otherUser.first_name || ''} ${otherUser.last_name || ''}` : 'Utilisateur'}
                        </h3>
                        <span className="text-xs text-amber-100 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 block"></span> En ligne
                        </span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-amber-700 h-8 w-8" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-slate-50">
                <div className="space-y-4">
                    {messages.map((msg) => {
                        const isMe = msg.sender_id === user?.id;
                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm text-sm ${isMe
                                            ? 'bg-amber-600 text-white rounded-br-none'
                                            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    <p>{msg.content}</p>
                                    <span
                                        className={`text-[10px] block mt-1 opacity-70 ${isMe ? 'text-amber-100 text-right' : 'text-gray-400'
                                            }`}
                                    >
                                        {format(new Date(msg.created_at), 'HH:mm', { locale: fr })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t bg-white">
                <div className="flex items-center gap-2">
                    {/* Attachment button placeholder */}
                    <Button type="button" variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 h-8 w-8">
                        <Paperclip className="h-4 w-4" />
                    </Button>

                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez un message..."
                        className="flex-1 border-gray-200 focus-visible:ring-amber-500"
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim() || isSending}
                        className="bg-amber-600 hover:bg-amber-700 text-white h-9 w-9 shrink-0"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
};
