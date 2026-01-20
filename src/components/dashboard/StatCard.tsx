import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    growth?: number;
    subtext?: string;
    isCurrency?: boolean;
}

export function StatCard({ title, value, icon: Icon, growth, subtext, isCurrency }: StatCardProps) {
    const displayValue = isCurrency && typeof value === 'number' ? formatCurrency(value) : value;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{displayValue}</div>
                {(growth !== undefined || subtext) && (
                    <p className={`text-sm ${growth && growth >= 0 ? 'text-green-600' : growth && growth < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                        {growth !== undefined && (
                            <>
                                {growth >= 0 ? '+' : ''}{growth}%
                                <span className="text-gray-500 ml-1">par rapport aux 30j précédents</span>
                            </>
                        )}
                        {subtext && !growth && subtext}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
