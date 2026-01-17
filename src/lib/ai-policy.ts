
export enum AIActionLevel {
    L0 = 0, // Information uniquement
    L1 = 1, // Suggestion sans exécution
    L2 = 2, // Action avec confirmation utilisateur
    L3 = 3  // Action automatique (Voice Zero-Touch)
}

export interface AIContext {
    user: {
        isAuthenticated: boolean;
        role: 'guest' | 'customer' | 'admin' | string;
        subscriptionActive: boolean;
        authorityOverride?: 'L1' | 'L2' | 'L3' | null;
    };
    session: {
        voiceEnabled: boolean;
        voiceConfidence?: number;
        isDegradedMode: boolean;
    };
    intent: {
        type: 'add_cart' | 'checkout' | 'delivery_query' | 'compare' | string;
        confidence: number;
        targetId?: string;
    };
    environment: {
        networkStatus: 'ok' | 'slow' | 'offline';
        pageContext?: string;
    };
}

export interface AIPolicyDecision {
    allowed: boolean;
    requiredLevel: AIActionLevel;
    reason?: string;
    requireConfirmation?: boolean;
}

/**
 * AI Policy Layer - C'est la seule entité autorisée à valider ou bloquer une action IA.
 */
export function evaluateAIPolicy(ctx: AIContext): AIPolicyDecision {

    // 🔴 Règle 1 : Intention ambiguë (Seuil de base)
    const baseThreshold = ctx.session.voiceEnabled ? 0.85 : 0.70;

    if (ctx.intent.confidence < baseThreshold) {
        return {
            allowed: false,
            requiredLevel: AIActionLevel.L1,
            reason: `Intent confidence too low (${ctx.intent.confidence} < ${baseThreshold})`,
            requireConfirmation: true
        };
    }

    // 🔴 Règle 2 : Checkout sécurisé (Jamais auto, Toujours auth)
    if (ctx.intent.type === 'checkout') {
        if (!ctx.user.isAuthenticated) {
            return {
                allowed: false,
                requiredLevel: AIActionLevel.L2,
                reason: 'User not authenticated for checkout',
                requireConfirmation: true
            };
        }

        if (ctx.session.isDegradedMode) {
            return {
                allowed: false,
                requiredLevel: AIActionLevel.L1,
                reason: 'Checkout disabled in degraded mode'
            };
        }

        // Le checkout est TOUJOURS L2 (avec confirmation visuelle/manuelle)
        return {
            allowed: true,
            requiredLevel: AIActionLevel.L2,
            requireConfirmation: true
        };
    }

    // 🔴 Règle 3 : Voice Zero-Touch (L3)
    if (ctx.session.voiceEnabled) {
        if (ctx.session.voiceConfidence && ctx.session.voiceConfidence < 0.8) {
            return {
                allowed: false,
                requiredLevel: AIActionLevel.L2,
                reason: 'Voice confidence too low for L3',
                requireConfirmation: true
            };
        }

        // Pas d'action de suppression ou de paiement en L3 par sécurité
        if (['payment', 'delete', 'clear'].some(term => ctx.intent.type.includes(term))) {
            return {
                allowed: false,
                requiredLevel: AIActionLevel.L2,
                reason: 'Critical action prohibited in L3',
                requireConfirmation: true
            };
        }
    }

    // 🔴 Règle 4 : Abonnement / Features Premium
    if (!ctx.user.subscriptionActive && ['add_cart', 'compare'].includes(ctx.intent.type)) {
        // Optionnel : On peut limiter certaines actions métier aux premium
        // Pour l'instant on laisse passer mais on pourrait forcer L2
    }

    // ✅ Autorisation par défaut
    // Si surcharge admin présente, on l'utilise, sinon calcul auto
    let level = (ctx.session.voiceEnabled && ctx.intent.confidence >= 0.85)
        ? AIActionLevel.L3
        : AIActionLevel.L2;

    if (ctx.user.authorityOverride) {
        const overrideMap: Record<string, AIActionLevel> = {
            'L1': AIActionLevel.L1,
            'L2': AIActionLevel.L2,
            'L3': AIActionLevel.L3
        };
        level = overrideMap[ctx.user.authorityOverride] ?? level;
    }

    return {
        allowed: level > AIActionLevel.L1, // On bloque l'exécution automatique si L1 (Conseil uniquement)
        requiredLevel: level,
        requireConfirmation: level === AIActionLevel.L2
    };
}
