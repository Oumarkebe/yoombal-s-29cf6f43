-- 1. Fonction pour mettre à jour l'inventaire lors d'un mouvement
CREATE OR REPLACE FUNCTION public.handle_stock_movement()
RETURNS TRIGGER AS $$
DECLARE
    v_product_id UUID;
BEGIN
    v_product_id := NEW.item_id;

    -- Cas 1: Sortie d'entrepôt (OUT ou TRANSFER)
    IF NEW.type IN ('OUT', 'TRANSFER') THEN
        IF NEW.from_warehouse_id IS NULL THEN
            RAISE EXCEPTION 'from_warehouse_id est requis pour une sortie ou un transfert';
        END IF;

        UPDATE public.warehouse_inventory
        SET quantity = quantity - NEW.quantity,
            updated_at = NOW()
        WHERE warehouse_id = NEW.from_warehouse_id AND product_id = v_product_id;

        -- Vérification du stock négatif (optionnel selon règle métier)
        -- IF (SELECT quantity FROM public.warehouse_inventory WHERE warehouse_id = NEW.from_warehouse_id AND product_id = v_product_id) < 0 THEN
        --     RAISE EXCEPTION 'Stock insuffisant dans l''entrepôt source';
        -- END IF;
    END IF;

    -- Cas 2: Entrée en entrepôt (IN ou TRANSFER)
    IF NEW.type IN ('IN', 'TRANSFER') THEN
        IF NEW.to_warehouse_id IS NULL THEN
            RAISE EXCEPTION 'to_warehouse_id est requis pour une entrée ou un transfert';
        END IF;

        INSERT INTO public.warehouse_inventory (warehouse_id, product_id, quantity)
        VALUES (NEW.to_warehouse_id, v_product_id, NEW.quantity)
        ON CONFLICT (warehouse_id, product_id)
        DO UPDATE SET 
            quantity = public.warehouse_inventory.quantity + EXCLUDED.quantity,
            updated_at = NOW();
    END IF;

    -- Cas 3: Mise à jour du stock GLOBAL dans la table products
    -- On recalcule le stock global comme la somme de tous les entrepôts
    UPDATE public.products
    SET stock = (
        SELECT COALESCE(SUM(quantity), 0)
        FROM public.warehouse_inventory
        WHERE product_id = v_product_id
    )
    WHERE id = v_product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger
DROP TRIGGER IF EXISTS trigger_handle_stock_movement ON public.warehouse_movements;
CREATE TRIGGER trigger_handle_stock_movement
AFTER INSERT ON public.warehouse_movements
FOR EACH ROW
EXECUTE FUNCTION public.handle_stock_movement();
