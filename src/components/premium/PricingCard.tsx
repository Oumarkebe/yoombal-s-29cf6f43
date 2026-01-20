import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Zap, Star, Shield, Rocket, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
  highlight?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  onCtaClick?: () => void;
  badge?: string;
}

const PricingCard = ({
  title,
  price,
  period,
  description,
  features,
  cta,
  ctaLink,
  highlight = false,
  icon,
  loading = false,
  onCtaClick,
  badge,
}: PricingCardProps) => {
  return (
    <Card
      className={`relative flex flex-col h-full shadow-lg hover:shadow-xl transition-all duration-300 ${highlight ? 'ring-2 ring-amber-500 scale-105 z-10 bg-white' : 'bg-white/80 border-slate-200'}`}
    >
      {badge && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-amber-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-md uppercase tracking-wider">
            {badge}
          </span>
        </div>
      )}
      <CardHeader className="text-center pb-6 pt-8">
        <div className="flex justify-center mb-4">
          {icon || <Zap className="h-10 w-10 text-amber-500" />}
        </div>
        <CardTitle className="text-2xl font-bold text-slate-900">{title}</CardTitle>
        <CardDescription className="text-slate-500 mt-2 min-h-[40px]">
          {description}
        </CardDescription>
        <div className="mt-6">
          <span className="text-4xl font-extrabold text-slate-900">{price}</span>
          {period && <span className="text-slate-500 ml-1 text-lg font-medium">{period}</span>}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-4 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="bg-green-100 rounded-full p-0.5 mr-3 mt-0.5 shrink-0">
                <Check className="h-3.5 w-3.5 text-green-600" />
              </div>
              <span className="text-slate-600 text-sm leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-0 pb-8 px-6">
        {onCtaClick ? (
          <Button
            onClick={onCtaClick}
            className={`w-full h-12 text-base font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 ${highlight ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
            {cta}
          </Button>
        ) : (
          <Button
            asChild
            className={`w-full h-12 text-base font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 ${highlight ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
          >
            <Link to={ctaLink}>{cta}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
