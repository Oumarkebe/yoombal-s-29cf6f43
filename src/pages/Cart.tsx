import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import CartHeader from '@/components/CartHeader';

const CartPage = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center">
          <div className="max-w-md w-full text-center bg-white/80 rounded-xl shadow-lg p-10">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
            <p className="text-gray-600 mb-8">
              Découvrez nos produits et ajoutez-les à votre panier
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-violet-600 w-full">
              <Link to="/marketplace">Continuer les achats</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-violet-50 flex flex-col">
      <Navbar />
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <CartHeader />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 flex items-center gap-4 bg-white/90 border-0 shadow-md rounded-xl"
                >
                  <img
                    src={item.products?.image_url || '/placeholder.svg'}
                    alt={item.products?.name || 'Image produit'}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.products?.name}</h3>
                    <p className="text-lg font-bold text-blue-600">
                      {(item.products?.price ?? 0).toLocaleString()} CFA
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      aria-label="Diminuer la quantité"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      aria-label="Augmenter la quantité"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Supprimer l'article"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4 bg-white/90 border-0 shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Résumé de commande</h2>
                <div className="space-y-2 mb-4">
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
                <div className="space-y-3">
                  <div className="mb-4">
                    <label
                      htmlFor="discount-code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Code de réduction
                    </label>
                    <input
                      type="text"
                      id="discount-code"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Entrez votre code"
                    />
                    <Button className="mt-2 w-full bg-gradient-to-r from-blue-600 to-violet-600">
                      Appliquer
                    </Button>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="delivery-options"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Options de livraison
                    </label>
                    <select
                      id="delivery-options"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="standard">Standard - Gratuite</option>
                      <option value="express">Express - 2000 CFA</option>
                    </select>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-violet-600" asChild>
                    <Link to="/checkout">Commander maintenant</Link>
                  </Button>
                  <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600" asChild>
                    <Link
                      to="/bnpl"
                      state={{
                        cartTotal: getTotalPrice(),
                        cartItems: items,
                      }}
                    >
                      Paiement échelonné BNPL
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={clearCart}>
                    Vider le panier
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
