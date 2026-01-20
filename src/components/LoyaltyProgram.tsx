import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Gift, Star, Crown, Award, Coins } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LoyaltyTier {
  name: string;
  icon: React.ReactNode;
  pointsRequired: number;
  benefits: string[];
  color: string;
}

const loyaltyTiers: LoyaltyTier[] = [
  {
    name: 'Bronze',
    icon: <Award className="w-5 h-5" />,
    pointsRequired: 0,
    benefits: ['1 point par 100 CFA', 'Accès aux promotions'],
    color: 'text-amber-600',
  },
  {
    name: 'Argent',
    icon: <Star className="w-5 h-5" />,
    pointsRequired: 1000,
    benefits: [
      '1.5 points par 100 CFA',
      'Livraison gratuite > 10K CFA',
      'Accès prioritaire aux nouveautés',
    ],
    color: 'text-gray-600',
  },
  {
    name: 'Or',
    icon: <Crown className="w-5 h-5" />,
    pointsRequired: 5000,
    benefits: [
      '2 points par 100 CFA',
      'Livraison gratuite',
      'Support prioritaire',
      'Réductions exclusives',
    ],
    color: 'text-yellow-600',
  },
];

const rewards = [
  { name: 'Réduction 5%', points: 500, type: 'discount' },
  { name: 'Livraison gratuite', points: 200, type: 'shipping' },
  { name: 'Réduction 10%', points: 1000, type: 'discount' },
  { name: 'Produit gratuit', points: 2000, type: 'product' },
];

export const LoyaltyProgram = () => {
  const { user } = useAuth();
  const [userPoints] = useState(750); // Simulation
  const [currentTier, setCurrentTier] = useState(0);

  const getCurrentTier = () => {
    for (let i = loyaltyTiers.length - 1; i >= 0; i--) {
      if (userPoints >= loyaltyTiers[i].pointsRequired) {
        return i;
      }
    }
    return 0;
  };

  const getNextTier = () => {
    const current = getCurrentTier();
    return current < loyaltyTiers.length - 1 ? loyaltyTiers[current + 1] : null;
  };

  const getProgressToNextTier = () => {
    const nextTier = getNextTier();
    if (!nextTier) return 100;

    const currentTierPoints = loyaltyTiers[getCurrentTier()].pointsRequired;
    const nextTierPoints = nextTier.pointsRequired;
    const progressPoints = userPoints - currentTierPoints;
    const totalNeeded = nextTierPoints - currentTierPoints;

    return (progressPoints / totalNeeded) * 100;
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Gift className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">Programme de Fidélité</h3>
          <p className="text-gray-600 mb-4">Connectez-vous pour accéder à vos points de fidélité</p>
          <Button>Se connecter</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-600" />
            Mes Points de Fidélité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-yellow-600">{userPoints}</div>
              <div className="text-sm text-gray-600">Points disponibles</div>
            </div>
            <Badge className={`${loyaltyTiers[getCurrentTier()].color} bg-yellow-100`}>
              {loyaltyTiers[getCurrentTier()].icon}
              {loyaltyTiers[getCurrentTier()].name}
            </Badge>
          </div>

          {getNextTier() && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progression vers {getNextTier()?.name}</span>
                <span>
                  {userPoints}/{getNextTier()?.pointsRequired} points
                </span>
              </div>
              <Progress value={getProgressToNextTier()} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Niveaux de Fidélité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loyaltyTiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`p-4 rounded-lg border ${
                  index === getCurrentTier() ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={tier.color}>{tier.icon}</span>
                  <h3 className="font-semibold">{tier.name}</h3>
                  <span className="text-sm text-gray-600">
                    {tier.pointsRequired === 0 ? 'Niveau de base' : `${tier.pointsRequired} points`}
                  </span>
                  {index === getCurrentTier() && <Badge variant="secondary">Niveau actuel</Badge>}
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-yellow-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Récompenses Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {rewards.map((reward, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{reward.name}</h4>
                  <span className="text-yellow-600 font-semibold">{reward.points} pts</span>
                </div>
                <Button size="sm" disabled={userPoints < reward.points} className="w-full">
                  {userPoints < reward.points ? 'Points insuffisants' : 'Échanger'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltyProgram;
