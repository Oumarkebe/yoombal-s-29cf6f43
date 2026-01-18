
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutHeader from '@/components/CheckoutHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/hooks/useOrders';
import { useGuestCheckout } from '@/hooks/useGuestCheckout';
import { CreditCard, Smartphone, Building2, User } from 'lucide-react';
import { Link } from 'react-router-dom';

import { KYCVerificationDialog } from '@/components/KYCVerificationDialog';
import { PaymentDialog } from '@/components/PaymentDialog';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const { createGuestOrder } = useGuestCheckout();

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    phone: '',
    notes: ''
  });

  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isKYCOpen, setIsKYCOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Payment Success Handler - Actually creates the order
  const handlePaymentSuccess = async (method: 'orange_money' | 'wave', phoneNumber: string) => {
    // Keep the specific method for order creation
    await processOrderCreation(method);
    setIsPaymentOpen(false);
  };

  const processOrderCreation = async (specificPaymentMethod?: string) => {
    setIsProcessing(true);
    const finalPaymentMethod = specificPaymentMethod || paymentMethod;

    try {
      if (user) {
        // Utilisateur connecté
        const orderItems = items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.products?.price || 0,
          merchant_id: item.products?.merchant_id || ''
        }));

        const result = await createOrder(orderItems, deliveryInfo, finalPaymentMethod);

        if (result.data) {
          clearCart();
          navigate(`/order-confirmation?orderId=${result.data.id}`);
        }
      } else {
        // Utilisateur invité
        const orderItems = items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.products?.price || 0,
          merchant_id: item.products?.merchant_id || ''
        }));

        const result = await createGuestOrder(guestInfo, orderItems, finalPaymentMethod);

        if (result.data) {
          // Vider le panier local
          if (typeof window !== 'undefined') {
            try {
              localStorage.removeItem('guestCart');
            } catch (e) {
              console.warn('Storage access blocked (clear guest cart):', e);
            }
          }
          clearCart();
          navigate(`/order-confirmation?orderId=${result.data.id || 'GUEST'}`);
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="max-w-md w-full text-center bg-white/80 rounded-xl shadow-lg p-10">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8">Ajoutez des produits à votre panier pour continuer</p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-violet-600 w-full">
              <Link to="/marketplace">Continuer les achats</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // BNPL Checks
    if (paymentMethod === 'bnpl') {
      if (!user) {
        alert("Vous devez être connecté pour utiliser le paiement en plusieurs fois.");
        navigate('/login?redirect=/checkout');
        return;
      }

      // Check KYC Status
      if (user.kyc_status !== 'verified') {
        setIsKYCOpen(true);
        return;
      }

      // Check Credit Limit
      const total = getTotalPrice();
      const debt = user.current_debt || 0;
      const limit = user.credit_limit || 0;

      if ((debt + total) > limit) {
        alert(`Plafond de crédit dépassé. Votre limite est de ${limit} FCFA et votre dette actuelle est de ${debt} FCFA.`);
        return;
      }
    }

    // If Payment Method is Digital (Card or Mobile), Require Payment First
    if (['card', 'mobile'].includes(paymentMethod)) {
      setIsPaymentOpen(true);
      return;
    }

    // Cash or BNPL -> Proceed directly
    processOrderCreation();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50">
      <Navbar />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CheckoutHeader />

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {!user && (
                <Card className="p-6 bg-blue-50 border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">Informations personnelles</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        required
                        value={guestInfo.firstName}
                        onChange={(e) => setGuestInfo({ ...guestInfo, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        required
                        value={guestInfo.lastName}
                        onChange={(e) => setGuestInfo({ ...guestInfo, lastName: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                      />
                    </div>
                  </div>
                </Card>
              )}

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Informations de livraison</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={user ? "address" : "guestAddress"}>Adresse de livraison *</Label>
                    <Input
                      id={user ? "address" : "guestAddress"}
                      required
                      value={user ? deliveryInfo.address : guestInfo.address}
                      onChange={(e) => {
                        if (user) {
                          setDeliveryInfo({ ...deliveryInfo, address: e.target.value });
                        } else {
                          setGuestInfo({ ...guestInfo, address: e.target.value });
                        }
                      }}
                    />
                  </div>

                  {!user && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">Ville *</Label>
                        <Input
                          id="city"
                          required
                          value={guestInfo.city}
                          onChange={(e) => setGuestInfo({ ...guestInfo, city: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Code postal *</Label>
                        <Input
                          id="postalCode"
                          required
                          value={guestInfo.postalCode}
                          onChange={(e) => setGuestInfo({ ...guestInfo, postalCode: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor={user ? "phone" : "guestPhone"}>Téléphone *</Label>
                    <Input
                      id={user ? "phone" : "guestPhone"}
                      required
                      value={user ? deliveryInfo.phone : guestInfo.phone}
                      onChange={(e) => {
                        if (user) {
                          setDeliveryInfo({ ...deliveryInfo, phone: e.target.value });
                        } else {
                          setGuestInfo({ ...guestInfo, phone: e.target.value });
                        }
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor={user ? "notes" : "guestNotes"}>Notes de livraison</Label>
                    <Textarea
                      id={user ? "notes" : "guestNotes"}
                      placeholder="Instructions spéciales pour la livraison..."
                      value={user ? deliveryInfo.notes : guestInfo.notes}
                      onChange={(e) => {
                        if (user) {
                          setDeliveryInfo({ ...deliveryInfo, notes: e.target.value });
                        } else {
                          setGuestInfo({ ...guestInfo, notes: e.target.value });
                        }
                      }}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Mode de paiement</h3>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Carte bancaire
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mobile" id="mobile" />
                    <Label htmlFor="mobile" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Mobile Money
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Paiement à la livraison
                    </Label>
                  </div>

                  {/* Option BNPL */}
                  <div className={`flex items-start space-x-2 p-3 rounded-lg border ${paymentMethod === 'bnpl' ? 'border-purple-500 bg-purple-50' : 'border-transparent'}`}>
                    <RadioGroupItem value="bnpl" id="bnpl" className="mt-1" />
                    <div className="grid gap-1.5">
                      <Label htmlFor="bnpl" className="flex items-center gap-2 font-semibold">
                        <CreditCard className="h-4 w-4 text-purple-600" />
                        Paiement en 3x (BNPL)
                      </Label>
                      <p className="text-xs text-slate-500">
                        Payez 33% aujourd'hui, le reste sur 2 mois. <br />
                        <span className="text-purple-600 font-medium">Inscription et validation d'identité requises.</span>
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </Card>
            </div>

            <KYCVerificationDialog
              isOpen={isKYCOpen}
              onOpenChange={setIsKYCOpen}
              onSuccess={() => {
                // Refresh profile or allow proceed
                window.location.reload(); // Simple refresh to fetch new status
              }}
            />

            <PaymentDialog
              isOpen={isPaymentOpen}
              onClose={() => setIsPaymentOpen(false)}
              amount={getTotalPrice()}
              description="Paiement Commande"
              type="product_purchase"
              metadata={{ itemsCount: items.length }}
              onSuccess={handlePaymentSuccess}
            />

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Résumé de commande</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.products?.name}</h3>
                        <p className="text-sm text-gray-500">Quantité: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">
                        {((item.products?.price || 0) * item.quantity).toLocaleString()} CFA
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{getTotalPrice().toLocaleString()} CFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="text-green-600">Gratuite</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>{getTotalPrice().toLocaleString()} CFA</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-violet-600"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Traitement...' : 'Finaliser la commande'}
                </Button>

                {!user && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Vous avez un compte ?{' '}
                      <Link to="/login" className="text-blue-600 hover:underline">
                        Connectez-vous
                      </Link>
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
