
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
    Coffee
} from 'lucide-react';

interface CategoryBadgeProps {
    name: string;
    className?: string;
    showIcon?: boolean;
}

const CATEGORY_MAP: Record<string, { icon: any, color: string, bgColor: string }> = {
    // 1. Courses & Quotidien
    'Courses & Quotidien': { icon: ShoppingBasket, color: 'text-emerald-700', bgColor: 'bg-emerald-50 border-emerald-100' },
    'Alimentation': { icon: Apple, color: 'text-emerald-600', bgColor: 'bg-emerald-50 border-emerald-100' },
    'Boissons': { icon: Coffee, color: 'text-blue-500', bgColor: 'bg-blue-50 border-blue-100' },
    'Légumes': { icon: Apple, color: 'text-green-600', bgColor: 'bg-green-50 border-green-100' },

    // 2. Mode & Style
    'Mode & Style': { icon: Shirt, color: 'text-rose-600', bgColor: 'bg-rose-50 border-rose-100' },
    'Mode & Accessoires': { icon: Shirt, color: 'text-rose-600', bgColor: 'bg-rose-50 border-rose-100' },

    // 3. Maison & Espace
    'Maison & Espace': { icon: Home, color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-100' },
    'Maison & Cuisine': { icon: Home, color: 'text-amber-600', bgColor: 'bg-amber-50 border-amber-100' },

    // 4. High-Tech & Digital
    'High-Tech & Digital': { icon: Smartphone, color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-100' },
    'Électronique & High-Tech': { icon: Cpu, color: 'text-blue-600', bgColor: 'bg-blue-50 border-blue-100' },

    // 5. BTP & Infrastructures
    'BTP & Infrastructures': { icon: HardHat, color: 'text-slate-700', bgColor: 'bg-slate-100 border-slate-200' },

    // 6. Services & Artisans
    'Services & Artisans': { icon: Wrench, color: 'text-teal-700', bgColor: 'bg-teal-50 border-teal-100' },
    'Services & Prestations': { icon: Settings, color: 'text-teal-600', bgColor: 'bg-teal-50 border-teal-100' },

    // 7. Auto & Mobilité
    'Auto & Mobilité': { icon: Car, color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-100' },
    'Automobile & Moto': { icon: Car, color: 'text-indigo-600', bgColor: 'bg-indigo-50 border-indigo-100' },

    // 8. Santé & Vitalité
    'Santé & Vitalité': { icon: Activity, color: 'text-red-700', bgColor: 'bg-red-50 border-red-100' },
    'Santé & Bien-être': { icon: Activity, color: 'text-red-600', bgColor: 'bg-red-50 border-red-100' },
    'Hygiène': { icon: Sparkles, color: 'text-cyan-600', bgColor: 'bg-cyan-50 border-cyan-100' },

    // 9. Éducation & Business
    'Éducation & Business': { icon: GraduationCap, color: 'text-violet-700', bgColor: 'bg-violet-50 border-violet-100' },

    // 10. Loisirs & Évasion
    'Loisirs & Évasion': { icon: PartyPopper, color: 'text-pink-600', bgColor: 'bg-pink-50 border-pink-100' },
    'Sport & Loisirs': { icon: PartyPopper, color: 'text-fuchsia-600', bgColor: 'bg-fuchsia-50 border-fuchsia-100' },

    // 11. Agri & Environnement
    'Agri & Environnement': { icon: Sprout, color: 'text-green-700', bgColor: 'bg-green-50 border-green-100' },

    // 12. Yoombal Finance
    'Yoombal Finance': { icon: CreditCard, color: 'text-blue-900', bgColor: 'bg-blue-100 border-blue-200' },
};

export function CategoryBadge({ name, className = "", showIcon = true }: CategoryBadgeProps) {
    const config = CATEGORY_MAP[name] || { icon: HelpCircle, color: 'text-gray-600', bgColor: 'bg-gray-50 border-gray-100' };
    const Icon = config.icon;

    return (
        <Badge
            variant="outline"
            className={`flex items-center gap-1.5 py-1 px-2.5 font-medium transition-all ${config.bgColor} ${config.color} ${className}`}
        >
            {showIcon && <Icon className="w-3.5 h-3.5" />}
            {name}
        </Badge>
    );
}
