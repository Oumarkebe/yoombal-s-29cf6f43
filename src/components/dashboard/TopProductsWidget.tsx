import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface TopProductsWidgetProps {
    products: { id: string; name: string; sales: number; revenue: number }[];
    loading?: boolean;
}

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

export function TopProductsWidget({ products, loading }: TopProductsWidgetProps) {
    if (loading) {
        return (
            <Card className="h-full min-h-[350px] flex items-center justify-center">
                <div className="text-gray-500">Chargement...</div>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Produits (Revenus)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    {products.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={products} margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    tick={{ fontSize: 11 }}
                                    interval={0}
                                />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20}>
                                    {products.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-sm text-gray-500">
                            Aucune donnée disponible
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
