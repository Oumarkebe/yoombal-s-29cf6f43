import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { type Database } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Product = Database['public']['Tables']['products']['Row'];
export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at?: string;
  products: Product | null;
};

// Type pour les items du panier local (utilisateurs non connectés)
export type LocalCartItem = {
  id: string;
  product_id: string;
  quantity: number;
  products: Product | null;
};

interface CartContextType {
  items: (CartItem | LocalCartItem)[];
  isLoading: boolean;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isUpdating: boolean;
  triggerAnimation: (startCoords: { x: number; y: number }, productImage?: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [flyingItems, setFlyingItems] = React.useState<
    { id: number; start: { x: number; y: number }; end: { x: number; y: number }; image?: string }[]
  >([]);

  const triggerAnimation = useCallback(
    (startCoords: { x: number; y: number }, productImage?: string) => {
      const cartIcon = document.getElementById('navbar-cart-icon');
      if (!cartIcon) return;

      const rect = cartIcon.getBoundingClientRect();
      const endCoords = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      const newItem = { id: Date.now(), start: startCoords, end: endCoords, image: productImage };
      setFlyingItems((prev) => [...prev, newItem]);

      setTimeout(() => {
        setFlyingItems((prev) => prev.filter((item) => item.id !== newItem.id));
      }, 1500); // Durée de l'animation synchronisée avec le CSS
    },
    []
  );

  const playSuccessSound = useCallback(() => {
    try {
      // Un son de "pop" discret en base64 (format WAV)
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // Note La (A5)
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1); // Descente vers La (A4)

      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio Context not supported or interaction required for sound', e);
    }
  }, []);

  // État local pour le panier des utilisateurs non connectés
  const [localCart, setLocalCart] = React.useState<LocalCartItem[]>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('guestCart');
        return saved ? JSON.parse(saved) : [];
      }
    } catch (e) {
      console.warn('Storage access blocked (initialization):', e);
    }
    return [];
  });

  // Fonction pour sauvegarder le panier local
  const saveLocalCart = useCallback((cart: LocalCartItem[]) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('guestCart', JSON.stringify(cart));
      }
    } catch (e) {
      console.warn('Storage access blocked (save):', e);
    }
    setLocalCart(cart);
  }, []);

  const fetchCartItems = async () => {
    if (!user) return [];
    const { data, error } = await (supabase.from('cart' as any) as any)
      .select(
        `
        *,
        products:product_id (*)
      `
      )
      .eq('user_id', user.id);
    if (error) {
      console.error('Error fetching cart:', error);
      throw new Error(error.message);
    }
    return (data || []) as CartItem[];
  };

  const { data: dbItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: ['cart', user?.id],
    queryFn: fetchCartItems,
    enabled: !!user,
  });

  // Fonction pour récupérer les détails d'un produit
  const fetchProductDetails = async (productId: string): Promise<Product | null> => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return null;
    }
    return data;
  };

  // Combiner les items du panier (DB + local)
  const items = user ? dbItems : localCart;

  const mutationOptions = {
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    },
  };

  const addItemMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: string; quantity?: number }) => {
      if (user) {
        // Utilisateur connecté - sauvegarder en DB
        const existingItem = dbItems.find((item) => item.product_id === productId);

        if (existingItem) {
          const { error } = await (supabase.from('cart' as any) as any)
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);
          if (error) throw error;
        } else {
          const { error } = await (supabase.from('cart' as any) as any).insert({
            user_id: user.id,
            product_id: productId,
            quantity,
          });
          if (error) throw error;
        }
      } else {
        // Utilisateur non connecté - sauvegarder localement
        const existingItemIndex = localCart.findIndex((item) => item.product_id === productId);
        const productDetails = await fetchProductDetails(productId);

        if (existingItemIndex >= 0) {
          const updatedCart = [...localCart];
          updatedCart[existingItemIndex].quantity += quantity;
          saveLocalCart(updatedCart);
        } else {
          const newItem: LocalCartItem = {
            id: `local-${Date.now()}-${Math.random()}`,
            product_id: productId,
            quantity,
            products: productDetails,
          };
          saveLocalCart([...localCart, newItem]);
        }
      }
    },
    ...mutationOptions,
    onMutate: () => {
      playSuccessSound();
      toast({
        title: '🛒 Produit ajouté !',
        description: 'Votre article a été ajouté au panier.',
        className: 'bg-amber-600 text-white border-none shadow-lg',
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (cartItemId: string) => {
      if (user) {
        const { error } = await (supabase.from('cart' as any) as any).delete().eq('id', cartItemId);
        if (error) throw error;
      } else {
        const updatedCart = localCart.filter((item) => item.id !== cartItemId);
        saveLocalCart(updatedCart);
      }
    },
    ...mutationOptions,
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      }
      toast({ title: 'Succès', description: 'Produit retiré du panier' });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      if (quantity <= 0) {
        return removeItemMutation.mutate(cartItemId);
      }

      if (user) {
        const { error } = await (supabase.from('cart' as any) as any)
          .update({ quantity })
          .eq('id', cartItemId);
        if (error) throw error;
      } else {
        const updatedCart = localCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        saveLocalCart(updatedCart);
      }
    },
    ...mutationOptions,
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (user) {
        const { error } = await (supabase.from('cart' as any) as any)
          .delete()
          .eq('user_id', user.id);
        if (error) throw error;
      } else {
        saveLocalCart([]);
      }
    },
    ...mutationOptions,
    onSuccess: () => {
      if (user) {
        queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      }
      toast({ title: 'Succès', description: 'Panier vidé' });
    },
  });

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => {
      const price = item.products?.price ?? 0;
      return total + price * item.quantity;
    }, 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const isUpdating =
    addItemMutation.isPending ||
    removeItemMutation.isPending ||
    updateQuantityMutation.isPending ||
    clearCartMutation.isPending;

  // Migrer le panier local vers la DB quand l'utilisateur se connecte
  React.useEffect(() => {
    const migrateLocalCartToDb = async () => {
      if (user && localCart.length > 0) {
        try {
          for (const item of localCart) {
            const existingItem = dbItems.find((dbItem) => dbItem.product_id === item.product_id);

            if (existingItem) {
              await (supabase.from('cart' as any) as any)
                .update({ quantity: existingItem.quantity + item.quantity })
                .eq('id', existingItem.id);
            } else {
              await (supabase.from('cart' as any) as any).insert({
                user_id: user.id,
                product_id: item.product_id,
                quantity: item.quantity,
              });
            }
          }

          // Vider le panier local après migration
          saveLocalCart([]);
          queryClient.invalidateQueries({ queryKey: ['cart', user.id] });

          toast({
            title: 'Panier synchronisé',
            description: 'Vos articles ont été ajoutés à votre compte',
          });
        } catch (error) {
          console.error('Error migrating cart:', error);
        }
      }
    };

    migrateLocalCartToDb();
  }, [user, localCart, dbItems, queryClient, toast, saveLocalCart]);

  return (
    <CartContext.Provider
      value={{
        items,
        isLoading: user ? isLoading : false,
        addItem: (productId, quantity) => addItemMutation.mutate({ productId, quantity }),
        removeItem: (cartItemId) => removeItemMutation.mutate(cartItemId),
        updateQuantity: (cartItemId, quantity) =>
          updateQuantityMutation.mutate({ cartItemId, quantity }),
        clearCart: () => clearCartMutation.mutate(),
        getTotalPrice,
        getTotalItems,
        isUpdating,
        triggerAnimation,
      }}
    >
      {children}
      {/* Animation Layer */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
        {flyingItems.map((item) => (
          <div
            key={item.id}
            className="fixed w-14 h-14 rounded-full bg-amber-600 flex items-center justify-center shadow-lg border-2 border-white animate-fly-to-cart overflow-hidden"
            style={
              {
                '--start-x': `${item.start.x}px`,
                '--start-y': `${item.start.y}px`,
                '--end-x': `${item.end.x}px`,
                '--end-y': `${item.end.y}px`,
                left: 0,
                top: 0,
              } as React.CSSProperties
            }
          >
            {item.image ? (
              <img src={item.image} className="w-full h-full object-cover" alt="" />
            ) : (
              <span className="text-white text-[10px] font-bold">🛒</span>
            )}
          </div>
        ))}
      </div>
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
