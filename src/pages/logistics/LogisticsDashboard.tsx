
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PremiumFeatureGate } from '@/components/premium/PremiumFeatureGate';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Map, Truck, Package, Clock, Navigation, BarChart3, RotateCw, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

// MOCK DATA: DRIVERS
const MOCK_DRIVERS = [
    { id: 1, name: "Ibrahima Fall", status: "en_livraison", zone: "Plateau", efficiency: 98, deliveries: 12 },
    { id: 2, name: "Samba Diallo", status: "disponible", zone: "Mermoz", efficiency: 92, deliveries: 8 },
    { id: 3, name: "Fatou Kante", status: "en_livraison", zone: "Parcelles", efficiency: 88, deliveries: 15 },
];

export default function LogisticsDashboard() {

    const handleOptimizeRoutes = () => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: 'Calcul des itinéraires IA en cours...',
            success: 'Optimisation terminée ! 15km économisés.',
            error: 'Erreur lors de l\'optimisation',
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Truck className="w-8 h-8 text-blue-600" />
                            Logistique Intelligente
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Optimisation de flotte, gestion d'entrepôts et prédictions de trafic.
                        </p>
                    </div>
                    <PremiumFeatureGate featureKey="optimisation_tournees">
                        <Button onClick={handleOptimizeRoutes} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                            <RotateCw className="w-4 h-4 mr-2" />
                            Lancer Optimisation IA
                        </Button>
                    </PremiumFeatureGate>
                </div>

                <Tabs defaultValue="map" className="space-y-6">
                    <TabsList className="grid w-full md:w-[600px] grid-cols-3">
                        <TabsTrigger value="map">Carte en Direct</TabsTrigger>
                        <TabsTrigger value="drivers">Flotte & Livreurs</TabsTrigger>
                        <TabsTrigger value="warehouses">Entrepôts</TabsTrigger>
                    </TabsList>

                    {/* MAP VIEW TAB */}
                    <TabsContent value="map" className="space-y-6">
                        <PremiumFeatureGate featureKey="optimisation_tournees">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Card className="lg:col-span-2 h-[500px] overflow-hidden relative border-0 shadow-lg">
                                    {/* Fake Map Background */}
                                    <div className="absolute inset-0 bg-slate-200 opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Dakar_Senegal_OpenStreetMap.png/640px-Dakar_Senegal_OpenStreetMap.png')] bg-cover bg-center grayscale contrast-50"></div>

                                    {/* Fake UI Overlay */}
                                    <div className="absolute inset-x-4 top-4 flex justify-between">
                                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm border text-xs font-semibold flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                            Trafic Fluide (VDN, Corniche)
                                        </div>
                                        <div className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-sm border text-xs font-semibold flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-blue-600" />
                                            ETA Moyen: 18 min
                                        </div>
                                    </div>

                                    {/* Fake Markers */}
                                    <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                                        <div className="relative group cursor-pointer">
                                            <div className="absolute -inset-2 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                                            <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
                                                <Truck className="w-5 h-5" />
                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Livreur #42 (Ibrahima)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute top-1/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
                                        <div className="bg-orange-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Card>

                                <div className="space-y-4">
                                    <Card>
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm">Métriques du Jour</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Livraisons effectuées</span>
                                                <span className="font-bold text-lg">124</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Km économisés (IA)</span>
                                                <span className="font-bold text-lg text-green-600">42.5 km</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Temps moyen/livr.</span>
                                                <span className="font-bold text-lg">22 min</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="bg-blue-50 border-blue-100">
                                        <CardContent className="pt-6">
                                            <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                                <Navigation className="w-4 h-4" /> Routage Zone Rurale
                                            </h4>
                                            <p className="text-sm text-blue-700/80 mb-3">
                                                L'algo "Piste" a détecté 4 livraisons en zone difficile. Véhicules 4x4 assignés.
                                            </p>
                                            <Button size="sm" variant="outline" className="w-full bg-white text-blue-700 border-blue-200 hover:bg-blue-50">
                                                Voir détails
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </PremiumFeatureGate>
                    </TabsContent>

                    {/* DRIVERS TAB */}
                    <TabsContent value="drivers">
                        <PremiumFeatureGate featureKey="optimisation_tournees">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Gestion de la Flotte</CardTitle>
                                    <CardDescription>Suivi des performances et assignation.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {MOCK_DRIVERS.map(driver => (
                                            <div key={driver.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                                                <div className="flex items-center gap-4">
                                                    <Avatar>
                                                        <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{driver.name}</p>
                                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                                            {driver.status === 'en_livraison' ? (
                                                                <span className="flex items-center gap-1 text-green-600"><span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> En route</span>
                                                            ) : (
                                                                <span className="flex items-center gap-1 text-gray-400"><span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Pause</span>
                                                            )}
                                                            • {driver.zone}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold text-gray-900">{driver.efficiency}% Efficacité</div>
                                                    <div className="text-xs text-gray-500">{driver.deliveries} courses ce jour</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </PremiumFeatureGate>
                    </TabsContent>

                    {/* WAREHOUSE TAB */}
                    <TabsContent value="warehouses">
                        <PremiumFeatureGate featureKey="gestion_entrepots">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Entrepôt Principal (Dakar)</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                                            <span className="text-gray-400 font-medium">Heatmap de Stock (Vue 3D)</span>
                                        </div>
                                        <div className="mt-4 flex gap-4 text-sm">
                                            <div>
                                                <span className="block font-bold text-lg">85%</span>
                                                <span className="text-gray-500">Occupation</span>
                                            </div>
                                            <div>
                                                <span className="block font-bold text-lg">A1</span>
                                                <span className="text-gray-500">Zone Optimale</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="opacity-75">
                                    <CardHeader>
                                        <CardTitle>Hub Secondaire (Thiès)</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-48 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                                            <span className="text-gray-400 font-medium whitespace-pre-wrap text-center">Connection Capteur...{'\n'}Flux Vidéo Inactif</span>
                                        </div>
                                        <Button variant="outline" className="mt-4 w-full">Configurer IoT</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </PremiumFeatureGate>
                    </TabsContent>

                </Tabs>
            </main>
            <Footer />
        </div>
    );
}
