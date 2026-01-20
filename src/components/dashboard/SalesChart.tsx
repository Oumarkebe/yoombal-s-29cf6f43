import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/formatters';

interface SalesChartProps {
    data: { date: string; revenue: number; orders: number }[];
    loading?: boolean;
}

export function SalesChart({ data, loading }: SalesChartProps) {
    // Can add period toggle here later if API supports it

    if (loading) {
        return (
            <Card className="h-full min-h-[350px] flex items-center justify-center">
                <div className="text-gray-500">Chargement des données...</div>
            </Card>
        );
    }

    return (
        <Card className="col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle>Revenus & Ventes</CardTitle>
                <div className="flex gap-2">
                    {/* Placeholders for future filters */}
                    <Button variant="outline" size="sm" className="h-8">7J</Button>
                    <Button variant="ghost" size="sm" className="h-8">30J</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#888' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#888' }}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                formatter={(value: number) => [formatCurrency(value), 'Revenu']}
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
