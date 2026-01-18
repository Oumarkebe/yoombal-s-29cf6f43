
import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
    Shirt,
    Smartphone,
    Home,
    Sparkles,
    Apple,
    ShoppingBasket,
    Wrench,
    HardHat,
    Car,
    Activity,
    GraduationCap,
    PartyPopper,
    Sprout,
    CreditCard,
    Cpu,
    Briefcase,
    Settings,
    HelpCircle,
    Coffee,
    LucideIcon
} from 'lucide-react';

interface CategoryBadgeProps {
    name: string;
    className?: string;
    showIcon?: boolean;
    isActive?: boolean;
    onClick?: () => void;
    variant?: 'default' | 'mini';
}

interface CategoryTheme {
    icon: LucideIcon;
    color: string;
    activeBg: string;
    activeBorder: string;
    activeText: string;
    glow: string;
}

const CATEGORY_THEMES: Record<string, CategoryTheme> = {
    'Courses & Quotidien': {
        icon: ShoppingBasket,
        color: 'text-emerald-500',
        activeBg: 'bg-emerald-600',
        activeBorder: 'border-emerald-700',
        activeText: 'text-white',
        glow: 'shadow-emerald-200/50'
    },
    'Alimentation': {
        icon: Apple,
        color: 'text-emerald-500',
        activeBg: 'bg-emerald-500',
        activeBorder: 'border-emerald-600',
        activeText: 'text-white',
        glow: 'shadow-emerald-100/50'
    },
    'Boissons': {
        icon: Coffee,
        color: 'text-blue-500',
        activeBg: 'bg-blue-500',
        activeBorder: 'border-blue-600',
        activeText: 'text-white',
        glow: 'shadow-blue-100/50'
    },
    'Légumes': {
        icon: Apple,
        color: 'text-green-500',
        activeBg: 'bg-green-500',
        activeBorder: 'border-green-600',
        activeText: 'text-white',
        glow: 'shadow-green-100/50'
    },
    'Mode & Style': {
        icon: Shirt,
        color: 'text-rose-500',
        activeBg: 'bg-rose-600',
        activeBorder: 'border-rose-700',
        activeText: 'text-white',
        glow: 'shadow-rose-200/50'
    },
    'Mode & Accessoires': {
        icon: Shirt,
        color: 'text-rose-500',
        activeBg: 'bg-rose-500',
        activeBorder: 'border-rose-600',
        activeText: 'text-white',
        glow: 'shadow-rose-100/50'
    },
    'Maison & Espace': {
        icon: Home,
        color: 'text-amber-600',
        activeBg: 'bg-amber-600',
        activeBorder: 'border-amber-700',
        activeText: 'text-white',
        glow: 'shadow-amber-200/50'
    },
    'High-Tech & Digital': {
        icon: Smartphone,
        color: 'text-blue-600',
        activeBg: 'bg-blue-600',
        activeBorder: 'border-blue-700',
        activeText: 'text-white',
        glow: 'shadow-blue-200/50'
    },
    'BTP & Infrastructures': {
        icon: HardHat,
        color: 'text-slate-600',
        activeBg: 'bg-slate-700',
        activeBorder: 'border-slate-800',
        activeText: 'text-white',
        glow: 'shadow-slate-200/50'
    },
    'Services & Artisans': {
        icon: Wrench,
        color: 'text-teal-600',
        activeBg: 'bg-teal-600',
        activeBorder: 'border-teal-700',
        activeText: 'text-white',
        glow: 'shadow-teal-200/50'
    },
    'Auto & Mobilité': {
        icon: Car,
        color: 'text-indigo-600',
        activeBg: 'bg-indigo-600',
        activeBorder: 'border-indigo-700',
        activeText: 'text-white',
        glow: 'shadow-indigo-200/50'
    },
    'Santé & Vitalité': {
        icon: Activity,
        color: 'text-red-600',
        activeBg: 'bg-red-600',
        activeBorder: 'border-red-700',
        activeText: 'text-white',
        glow: 'shadow-red-200/50'
    },
    'Hygiène': {
        icon: Sparkles,
        color: 'text-cyan-500',
        activeBg: 'bg-cyan-500',
        activeBorder: 'border-cyan-600',
        activeText: 'text-white',
        glow: 'shadow-cyan-100/50'
    },
    'Éducation & Business': {
        icon: GraduationCap,
        color: 'text-violet-600',
        activeBg: 'bg-violet-600',
        activeBorder: 'border-violet-700',
        activeText: 'text-white',
        glow: 'shadow-violet-200/50'
    },
    'Loisirs & Évasion': {
        icon: PartyPopper,
        color: 'text-pink-500',
        activeBg: 'bg-pink-600',
        activeBorder: 'border-pink-700',
        activeText: 'text-white',
        glow: 'shadow-pink-200/50'
    },
    'Agri & Environnement': {
        icon: Sprout,
        color: 'text-green-600',
        activeBg: 'bg-green-600',
        activeBorder: 'border-green-700',
        activeText: 'text-white',
        glow: 'shadow-green-200/50'
    },
    'Yoombal Finance': {
        icon: CreditCard,
        color: 'text-blue-800',
        activeBg: 'bg-blue-900',
        activeBorder: 'border-blue-950',
        activeText: 'text-white',
        glow: 'shadow-blue-300/50'
    },
};

export function CategoryBadge({ name, className = "", showIcon = true, isActive = false, onClick, variant = 'default' }: CategoryBadgeProps) {
    const theme = CATEGORY_THEMES[name] || {
        icon: HelpCircle,
        color: 'text-slate-500',
        activeBg: 'bg-slate-900',
        activeBorder: 'border-black',
        activeText: 'text-white',
        glow: 'shadow-slate-200/50'
    };
    const Icon = theme.icon;
    const isMini = variant === 'mini';

    if (name === "Tous les produits") {
        return (
            <button
                onClick={onClick}
                data-active={isActive}
                className={`
                    group flex items-center gap-2 px-6 h-11 rounded-full cursor-pointer
                    border transition-all duration-200 ease-out
                    ${isActive
                        ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-400/40'
                        : 'border-slate-200 bg-white/70 backdrop-blur shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300 text-slate-700'
                    }
                    active:scale-[0.98]
                    ${className}
                `}
            >
                <span className="text-sm font-semibold tracking-wide">
                    {name}
                </span>
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            data-active={isActive}
            className={`
                group flex items-center gap-2.5 rounded-full cursor-pointer
                border transition-all duration-200 ease-out
                ${isMini ? 'px-3 h-8' : 'px-5 h-11'}
                ${isActive
                    ? `${isMini ? 'bg-blue-600 border-blue-700' : theme.activeBg} ${isMini ? '' : theme.activeBorder} text-white shadow-lg ${theme.glow} ring-1 ring-white/20`
                    : 'border-slate-200 bg-white/70 backdrop-blur shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300'
                }
                active:scale-[0.98]
                ${className}
            `}
        >
            <span className={`${isMini ? 'text-xs' : 'text-sm'} font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>
                {name}
            </span>
            {showIcon && !isMini && (
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : theme.color}`} />
            )}
        </button>
    );
}
