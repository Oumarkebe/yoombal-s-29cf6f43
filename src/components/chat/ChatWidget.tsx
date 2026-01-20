import React, { useState } from 'react';
import { MessageCircle, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChat } from '@/hooks/useChat';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatWindow } from './ChatWindow';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const ChatWidget = () => {
    const {
        conversations,
        activeConversation,
        setActiveConversation,
        messages,
        sendMessage,
        isSending
    } = useChat();

    const [isOpen, setIsOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);

    // Determine if we should show the full window or just the list/trigger
    const showChatWindow = activeConversation && isOpen && !minimized;

    if (showChatWindow) {
        return (
            <div className="fixed bottom-4 right-4 z-50 w-[350px] h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                <ChatWindow
                    messages={messages}
                    otherUser={activeConversation.other_user}
                    onSendMessage={sendMessage}
                    onClose={() => setActiveConversation(null)}
                    isSending={isSending}
                />
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 left-4 z-50">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                    <Button
                        size="lg"
                        className="rounded-full h-14 w-14 shadow-xl bg-amber-600 hover:bg-amber-700 text-white p-0 relative"
                    >
                        <MessageCircle className="h-6 w-6" />
                        {/* We could add generic unread badge here if we calculate total unread */}
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[100%] sm:w-[400px]">
                    <SheetHeader>
                        <SheetTitle>Messages</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-80px)] mt-4">
                        {conversations.length === 0 ? (
                            <div className="text-center text-muted-foreground mt-10">
                                Pas de conversations.
                                <br />
                                <span className="text-xs">Les discussions démarrent lors d'une commande.</span>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {conversations.map(conv => (
                                    <div
                                        key={conv.id}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                                        onClick={() => {
                                            setActiveConversation(conv);
                                            setIsOpen(false); // Close sheet to open ChatWindow popup
                                        }}
                                    >
                                        <Avatar>
                                            <AvatarImage src={conv.other_user?.avatar_url || ''} />
                                            <AvatarFallback className="bg-amber-100 text-amber-700">
                                                {conv.other_user?.first_name?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 overflow-hidden">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-semibold text-sm truncate">
                                                    {conv.other_user ? `${conv.other_user.first_name} ${conv.other_user.last_name}` : 'Utilisateur Inconnu'}
                                                </span>
                                                {conv.last_message_at && (
                                                    <span className="text-[10px] text-gray-400 shrink-0">
                                                        {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true, locale: fr })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">
                                                {/* Ideally snippet here, but we don't fetch it in list for now efficiently without join issues, defaulting generic */}
                                                Ouvrir la conversation...
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    );
};
