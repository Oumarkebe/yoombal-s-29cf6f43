
import React from 'react';
import { useUserCredits } from '@/hooks/useUserCredits';
import { Wallet, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function CreditBalance() {
    const { balance, isLoading } = useUserCredits();
    const navigate = useNavigate();

    return (
        <div className="flex items-center gap-3 bg-secondary/50 px-4 py-2 rounded-full border border-secondary">
            <Wallet className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Mon Wallet</span>
                <div className="flex items-center gap-2">
                    {isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                        <span className="text-sm font-bold">{balance.toLocaleString()} FCFA</span>
                    )}
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-primary hover:text-primary-foreground ml-1"
                onClick={() => navigate('/premium/credits')}
            >
                <Plus className="h-3 w-3" />
            </Button>
        </div>
    );
}
