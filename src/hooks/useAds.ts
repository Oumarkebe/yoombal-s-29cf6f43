
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

            // Fetch generic stats (Mocking granular aggregation for now or separate query)
            // Ideally we would use a View or RPC for stats aggregation to avoid N+1 queries or massive data transfer.
            // For MVP: Fetch all analytics for these campaigns (Careful with volume!)
            // BETTER APPROACH: Just count rows per campaign.

            const campaignsWithStats = await Promise.all(
                (data || []).map(async (camp) => {
                    const { count: views } = await supabase.from('ads_analytics').select('*', { count: 'exact', head: true }).eq('campaign_id', camp.id).eq('event_type', 'VIEW');
                    const { count: clicks } = await supabase.from('ads_analytics').select('*', { count: 'exact', head: true }).eq('campaign_id', camp.id).eq('event_type', 'CLICK');
                    return { ...camp, stats: { views: views || 0, clicks: clicks || 0 } };
                })
            );

            setCampaigns(campaignsWithStats as AdCampaign[]);
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

    return { campaigns, loading, createCampaign, trackAdEvent, fetchCampaigns };
};
