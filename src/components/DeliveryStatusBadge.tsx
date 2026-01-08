
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const statusConfig = {
  pending: { label: "En attente", color: "bg-yellow-500", icon: Clock },
  assigned: { label: "Assignée", color: "bg-blue-500", icon: Package },
  picked_up: { label: "Récupérée", color: "bg-orange-500", icon: Truck },
  in_transit: { label: "En transit", color: "bg-purple-500", icon: Truck },
  delivered: { label: "Livrée", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Annulée", color: "bg-red-500", icon: XCircle },
};

interface DeliveryStatusBadgeProps {
  status: string;
}

const DeliveryStatusBadge: React.FC<DeliveryStatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export default DeliveryStatusBadge;
