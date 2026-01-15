import { z } from 'zod';

// Schema pour souscription
export const subscriptionSchema = z.object({
    planId: z.string().uuid('ID de plan invalide'),
    billingPeriod: z.enum(['monthly', 'yearly'], {
        errorMap: () => ({ message: 'Période invalide (monthly ou yearly)' })
    }),
    paymentMethod: z.enum(['mobile_money', 'wallet', 'card'], {
        errorMap: () => ({ message: 'Méthode de paiement invalide' })
    }),
    amount: z.number().positive('Le montant doit être positif'),
    status: z.enum(['active', 'pending']).optional(),
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;

// Schema pour changement de plan
export const changePlanSchema = z.object({
    newPlanId: z.string().uuid('ID de plan invalide'),
    applyProrata: z.boolean().default(true),
    paymentMethod: z.enum(['mobile_money', 'wallet', 'card']).optional(),
    amount: z.number().optional(),
});

export type ChangePlanInput = z.infer<typeof changePlanSchema>;

// Schema pour annulation
export const cancelSubscriptionSchema = z.object({
    reason: z.string().min(10, 'Raison trop courte (min 10 caractères)').optional(),
    immediate: z.boolean().default(false), // false = cancel à la fin de la période
});

export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;

// Validation helper
export const validateSubscription = (data: unknown) => {
    try {
        return {
            success: true as const,
            data: subscriptionSchema.parse(data)
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false as const,
                errors: error.errors.map(e => ({
                    field: e.path.join('.'),
                    message: e.message
                }))
            };
        }
        return {
            success: false as const,
            errors: [{ field: 'unknown', message: 'Erreur de validation' }]
        };
    }
};
