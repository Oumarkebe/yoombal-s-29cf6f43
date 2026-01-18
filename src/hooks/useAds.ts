
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface AdCampaign {
    id: string;
    merchant_id: string;
    product_id: string;
    start_date: string;
    end_date: string;
    daily_budget: number;
    status: 'active' | 'paused' | 'completed' | 'pending_payment';
    current_spend: number;
    created_at: string;
    product?: {
        name: string;
        image_url?: string;
        price?: number;
    };
    stats?: {
        views: number;
        clicks: number;
    };
}

export const useAds = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
    const [dailyStats, setDailyStats] = useState<{ date: string, views: number, clicks: number }[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCampaigns = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('ads_campaigns')
                .select(`
                    *,
                    product:products(name, image_url, price)
                `)
                .eq('merchant_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const campaignIds = (data || []).map(c => c.id);

            const campaignsWithStats = await Promise.all(
                (data || []).map(async (camp) => {
                    const { count: views } = await supabase.from('ads_analytics').select('*', { count: 'exact', head: true }).eq('campaign_id', camp.id).eq('event_type', 'VIEW');
                    const { count: clicks } = await supabase.from('ads_analytics').select('*', { count: 'exact', head: true }).eq('campaign_id', camp.id).eq('event_type', 'CLICK');
                    return { ...camp, stats: { views: views || 0, clicks: clicks || 0 } };
                })
            );

            // Fetch daily analytics for the last 7 days
            const last7Days = Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return d.toISOString().split('T')[0];
            });

            const daily = await Promise.all(last7Days.map(async (date) => {
                if (campaignIds.length === 0) return { date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }), views: 0, clicks: 0 };

                const { count: views } = await supabase.from('ads_analytics')
                    .select('*', { count: 'exact', head: true })
                    .in('campaign_id', campaignIds)
                    .eq('event_type', 'VIEW')
                    .gte('created_at', `${date}T00:00:00`)
                    .lte('created_at', `${date}T23:59:59`);

                const { count: clicks } = await supabase.from('ads_analytics')
                    .select('*', { count: 'exact', head: true })
                    .in('campaign_id', campaignIds)
                    .eq('event_type', 'CLICK')
                    .gte('created_at', `${date}T00:00:00`)
                    .lte('created_at', `${date}T23:59:59`);

                return {
                    date: new Date(date).toLocaleDateString('fr-FR', { weekday: 'short' }),
                    views: views || 0,
                    clicks: clicks || 0
                };
            }));

            setCampaigns(campaignsWithStats as AdCampaign[]);
            setDailyStats(daily);
        } catch (error) {
            console.error('Error fetching campaigns:', error);
            toast({ title: "Erreur", description: "Impossible de charger les campagnes", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const createCampaign = async (productId: string, dailyBudget: number, daysDuration: number) => {
        if (!user) return;
        try {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(startDate.getDate() + daysDuration);

            const { error } = await supabase.from('ads_campaigns').insert([{
                merchant_id: user.id,
                product_id: productId,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                daily_budget: dailyBudget,
                status: 'active', // Direct active for MVP (Assume payment sorted or free tier)
                current_spend: 0
            }]);

            if (error) throw error;
            toast({ title: "Succès", description: "Campagne créée avec succès 🚀" });
            fetchCampaigns();
            return true;
        } catch (error) {
            console.error('Create campaign error:', error);
            toast({ title: "Erreur", description: "Création échouée", variant: "destructive" });
            return false;
        }
    };

    // Function to track view/click (Public use)
    const trackAdEvent = async (campaignId: string, type: 'VIEW' | 'CLICK') => {
        try {
            await supabase.from('ads_analytics').insert([{
                campaign_id: campaignId,
                event_type: type,
                viewer_id: user?.id || null // Optional tracking
            }]);
        } catch (e) {
            console.error("Tracking error", e);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, [user]);

    return { campaigns, dailyStats, loading, createCampaign, trackAdEvent, fetchCampaigns };
};
