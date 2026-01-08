
import React from 'react';
import { Users, Store, Truck, Loader2 } from 'lucide-react';
import { PublicStatsSettings } from '@/hooks/usePlatformSettings';
import { PublicStats } from '@/hooks/usePublicStats';

interface PublicStatsProps {
  stats: PublicStats | undefined;
  settings: PublicStatsSettings | undefined;
  isLoading: boolean;
}

const Stat = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) => (
    <div className="flex flex-col items-center text-center p-4">
        <div className="mb-3 text-blue-500">{icon}</div>
        <p className="text-3xl font-bold text-gray-900 dark:text-white">{value.toLocaleString()}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </div>
);


const PublicStatsDisplay: React.FC<PublicStatsProps> = ({ stats, settings, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!stats || !settings) return null;

  return (
    <div className="py-12 bg-gray-100 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
                {settings.showUserCount && <Stat icon={<Users className="w-8 h-8" />} label="Clients Heureux" value={stats.clientCount} />}
                {settings.showMerchantCount && <Stat icon={<Store className="w-8 h-8" />} label="Marchands Partenaires" value={stats.merchantCount} />}
                {settings.showDeliveryCount && <Stat icon={<Truck className="w-8 h-8" />} label="Livreurs Actifs" value={stats.deliveryCount} />}
            </div>
        </div>
    </div>
  );
};

export default PublicStatsDisplay;
