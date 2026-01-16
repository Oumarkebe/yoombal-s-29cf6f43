import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SpecField {
    id: string;
    key: string;
    value: string;
}

interface DynamicSpecsFormProps {
    specs: Record<string, any>;
    onChange: (specs: Record<string, any>) => void;
    categoryId?: string;
}

const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
    // Adaptation simplifiée pour demo
    'Alimentation': ['origine', 'composition', 'date_peremption', 'poids_net', 'allergenes'],
    'Consommables': ['marque', 'modele', 'compatibilité', 'garantie'],
    'default': ['couleur', 'dimension', 'poids', 'marque', 'reference', 'matière']
};

export function DynamicSpecsForm({ specs, onChange, categoryId }: DynamicSpecsFormProps) {
    const [specFields, setSpecFields] = useState<SpecField[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const fields = Object.entries(specs || {}).map(([key, value], index) => ({
            id: `spec-${index}`,
            key,
            value: String(value)
        }));

        if (fields.length === 0) {
            // Pas de champ vide par défaut pour ne pas polluer si rien n'est ajouté
        }

        setSpecFields(fields);
    }, [specs]);

    useEffect(() => {
        setSuggestions(CATEGORY_SUGGESTIONS['default']);
        // Todo: Logic to fetch category name from ID if needed
    }, [categoryId]);

    const addField = () => {
        const newField: SpecField = {
            id: `spec-${Date.now()}`,
            key: '',
            value: ''
        };
        setSpecFields([...specFields, newField]);
    };

    const removeField = (id: string) => {
        const newFields = specFields.filter(field => field.id !== id);
        setSpecFields(newFields);
        updateSpecs(newFields);
    };

    const updateField = (id: string, field: 'key' | 'value', newValue: string) => {
        const newFields = specFields.map(fieldItem =>
            fieldItem.id === id ? { ...fieldItem, [field]: newValue } : fieldItem
        );
        setSpecFields(newFields);
        updateSpecs(newFields);
    };

    const updateSpecs = (fields: SpecField[]) => {
        const newSpecs: Record<string, any> = {};

        fields.forEach(field => {
            if (field.key.trim()) {
                newSpecs[field.key.trim()] = field.value;
            }
        });

        onChange(newSpecs);
    };

    const useSuggestion = (suggestion: string) => {
        // Check duplication
        if (specFields.some(f => f.key.toLowerCase() === suggestion.toLowerCase())) return;

        const newField: SpecField = {
            id: `spec-${Date.now()}`,
            key: suggestion,
            value: ''
        };
        const newFields = [...specFields, newField];
        setSpecFields(newFields);
        // On n'appelle pas updateSpecs ici car value est vide, on attend que l'user remplisse
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center text-lg">
                    <span>Caractéristiques Techniques</span>
                    <Button type="button" variant="outline" size="sm" className="hidden">
                        <Sparkles className="h-4 w-4 mr-2" />
                        IA Auto-Fill
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Suggestions */}
                <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Suggestions rapides:</Label>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((suggestion, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-slate-100 transition-colors px-3 py-1"
                                onClick={() => useSuggestion(suggestion)}
                            >
                                + {suggestion}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Fields */}
                <div className="space-y-3">
                    {specFields.map((field) => (
                        <div key={field.id} className="flex gap-3 items-start">
                            <div className="flex-1">
                                <Input
                                    placeholder="Attribut (ex: Couleur)"
                                    value={field.key}
                                    onChange={(e) => updateField(field.id, 'key', e.target.value)}
                                    className="font-medium bg-slate-50"
                                />
                            </div>
                            <div className="flex-1">
                                <Input
                                    placeholder="Valeur (ex: Rouge)"
                                    value={field.value}
                                    onChange={(e) => updateField(field.id, 'value', e.target.value)}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeField(field.id)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    {specFields.length === 0 && (
                        <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
                            Aucune caractéristique définie. Ajoutez-en une ou utilisez les suggestions.
                        </div>
                    )}
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={addField}
                    className="w-full border-dashed"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une ligne
                </Button>
            </CardContent>
        </Card>
    );
}
