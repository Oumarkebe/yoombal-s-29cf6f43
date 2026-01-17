
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from "@/components/ui/switch";
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
    Store, Truck, Users, TrendingUp, Zap, Sparkles,
    BarChart3, MapPin, Package, Shield, Search,
    Smartphone, ArrowRight, Loader2, CheckCircle2,
    Bot, RefreshCw, SmartphoneCharging, Calculator,
    Megaphone, Box, Bike, Car, Play, Pause, FastForward, AlertTriangle,
    HelpCircle, X, ChevronRight, ChevronLeft, Battery, Signal, Crown
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar, Legend, LineChart, Line
} from 'recharts';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

// --- ARCHITECTURE PROPRE : IMPORTS ---
import { createSimulationEngine } from '@/lib/simulations/engine';
import { triggerChaos, ChaosEffect } from '@/lib/simulations/chaos.fake';
import { simulateBNPL } from '@/lib/simulations/bnpl.fake';
import { generateProductMetadata } from '@/lib/simulations/merchant.fake';
import { generateAdsData } from '@/lib/simulations/ads.fake';
import { useAutoSimulation } from '@/hooks/useAutoSimulation';
import { SimulationEvent } from '@/lib/simulations/types';

// --- TYPES & DATA FOR GUIDE ---
interface GuideStep {
    targetId: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const GUIDE_SCENARIOS: Record<string, GuideStep[]> = {
    'merchant': [
        { targetId: 'tour-merchant-inputs', title: 'Paramétrez votre Boutique', content: 'Définissez votre volume de commandes et panier moyen. Ces sliders impactent tout le reste de la simulation.', position: 'right' },
        { targetId: 'tour-merchant-revenue', title: 'Projection Financière', content: 'Visualisez instantanément votre CA mensuel potentiel projeté sur 30 jours.', position: 'left' },
        { targetId: 'tour-merchant-ai', title: 'Générateur IA', content: 'Testez notre IA générative : elle crée titre, description et prix optimisé en un clic.', position: 'bottom' },
        { targetId: 'tour-merchant-ads', title: 'Marketing Automatisé', content: 'Simulez le ROI de vos campagnes. L\'IA ajuste le budget pour maximiser la conversion.', position: 'top' },
    ],
    'delivery': [
        { targetId: 'tour-delivery-map', title: 'Tracking Flotte', content: 'Vue en temps réel de vos livreurs. Les points verts sont vos agents actifs sur le terrain.', position: 'right' },
        { targetId: 'tour-delivery-stats', title: 'KPIs Logistiques', content: 'Suivez le taux d\'optimisation et le volume horaire pour gérer vos pics d\'activité.', position: 'top' },
        { targetId: 'tour-delivery-vehicle', title: 'Choix du Véhicule', content: 'Comparez la rentabilité entre Vélo, Moto et Fourgon selon vos trajets.', position: 'left' },
    ],
    'client': [
        { targetId: 'tour-client-bnpl', title: 'Scoring IA', content: 'Essayez le moteur de décision de crédit. Il analyse le risque en temps réel pour accorder le BNPL.', position: 'left' },
        { targetId: 'tour-client-features', title: 'Expérience Achat', content: 'Découvrez les fonctionnalités premium offertes à vos clients (Recherche visuelle, Suivi...).', position: 'right' },
    ],
    'global': [
        { targetId: 'tour-sim-controls', title: 'Moteur de Simulation', content: 'Lancez la simulation automatique ici. Tout le dashboard prendra vie.', position: 'bottom' },
        { targetId: 'tour-chaos-btn', title: 'Fail-Safe Test', content: 'Le bouton rouge déclenche une crise majeure (Chaos). Observez comment l\'IA réagit via le journal et modifie les courbes.', position: 'bottom' },
        { targetId: 'tour-timeline', title: 'Cerveau IA', content: 'Ce journal affiche toutes les décisions prises par l\'IA en temps réel.', position: 'left' },
    ]
};

// --- GUIDE COMPONENT ---
const TourGuide = ({ steps, isOpen, onClose }: { steps: GuideStep[], isOpen: boolean, onClose: () => void }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
    // popoverPosition separate from highlight position to allow smart placement
    const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

    const updatePosition = useCallback(() => {
        if (!isOpen) return;
        const step = steps[currentStep];
        const element = document.getElementById(step.targetId);

        if (element) {
            const rect = element.getBoundingClientRect();

            // Highlight Box (Viewport Coordinates)
            setPosition({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            });

            // Smart Popover Positioning
            const popoverWidth = 320;
            const popoverHeight = 220; // Estimated max height
            const margin = 16;
            const gap = 12;

            // Default: Bottom Center
            let pTop = rect.bottom + gap;
            let pLeft = rect.left + (rect.width / 2) - (popoverWidth / 2);

            // 1. Horizontal Boundary Check
            if (pLeft < margin) pLeft = margin;
            if (pLeft + popoverWidth > window.innerWidth - margin) {
                pLeft = window.innerWidth - popoverWidth - margin;
            }

            // 2. Vertical Boundary Check (Flip if needed)
            // If bottom goes off-screen AND there is space above
            if (pTop + popoverHeight > window.innerHeight - margin) {
                if (rect.top - popoverHeight - gap > margin) {
                    // Flip to Top
                    pTop = rect.top - popoverHeight - gap;
                } else {
                    // If no space above either, stick to bottom of screen (covering element slightly is better than invisible)
                    pTop = window.innerHeight - popoverHeight - margin;
                }
            }

            setPopoverPos({ top: pTop, left: pLeft });
        }
    }, [currentStep, isOpen, steps]);

    useEffect(() => {
        if (isOpen) {
            updatePosition();
            // Scroll to element initially
            const step = steps[currentStep];
            const element = document.getElementById(step.targetId);
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true); // Capture scroll to handle all scrolling parents
        }
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isOpen, updatePosition, currentStep, steps]);

    if (!isOpen) return null;
    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {/* Backdrop with fade */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-500" />

            {/* Highlight Box */}
            <div
                className="absolute transition-all duration-300 ease-out border-2 border-amber-500 rounded-xl shadow-[0_0_0_9999px_rgba(15,23,42,0.6)] bg-transparent"
                style={{
                    top: position.top - 4,
                    left: position.left - 4,
                    width: position.width + 8,
                    height: position.height + 8
                }}
            />

            {/* Popover Card */}
            <div
                className="absolute pointer-events-auto transition-all duration-300 ease-out"
                style={{
                    top: popoverPos.top,
                    left: popoverPos.left
                }}
            >
                <Card className="w-80 shadow-2xl border-amber-500/20 animate-in fade-in zoom-in-95 duration-200 bg-slate-950/95 backdrop-blur text-white border-white/10 ring-1 ring-black/50">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <CardTitle className="text-base text-amber-400 flex items-center gap-2">
                                <span className="flex h-5 w-5 items-center justify-center rounded bg-amber-500/10 text-xs font-bold text-amber-500 ring-1 ring-amber-500/20">
                                    {currentStep + 1}
                                </span>
                                Guide Interactive
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2 text-slate-500 hover:text-white" onClick={onClose}><X className="h-4 w-4" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                        <div>
                            <h4 className="font-bold text-lg mb-1.5 leading-tight">{step.title}</h4>
                            <p className="text-sm text-slate-300 leading-relaxed opacity-90">{step.content}</p>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-4">
                            <div className="flex gap-1">
                                {steps.map((_, i) => (
                                    <div key={i} className={`h-1.5 rounded-full transition-all ${i === currentStep ? 'w-6 bg-amber-500' : 'w-1.5 bg-slate-700'}`} />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentStep === 0}
                                    onClick={() => setCurrentStep(p => p - 1)}
                                    className="border-slate-700 bg-transparent hover:bg-slate-800 text-slate-300 h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        if (currentStep < steps.length - 1) setCurrentStep(p => p + 1);
                                        else onClose();
                                    }}
                                    className="bg-amber-600 hover:bg-amber-700 text-white h-8 px-4"
                                >
                                    {currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS WITH FAKE DATA INTEGRATION ---

const SimulationTimeline = ({ events }: { events: SimulationEvent[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [events]);

    return (
        <Card className="bg-slate-950 border-slate-800 h-full flex flex-col" id="tour-timeline">
            <CardHeader className="py-3 border-b border-slate-800">
                <CardTitle className="text-sm font-mono text-slate-400 flex items-center gap-2"><Bot className="h-4 w-4 text-purple-500" /> JOURNAL SYSTÈME IA</CardTitle>
            </CardHeader>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs max-h-[300px] lg:max-h-none">
                {events.length === 0 && <div className="text-slate-600 italic">En attente de démarrage...</div>}
                {events.map((e, i) => (
                    <div key={i} className={`flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300 ${e.level === "critical" ? "text-red-400 bg-red-950/20 p-2 rounded border border-red-900/50" : e.level === "warning" ? "text-amber-400" : "text-slate-300"}`}>
                        <span className="opacity-50 select-none">[{e.time}]</span><span>{e.message}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const BNPLSimulatorWidget = ({ autoMode, chaosMultiplier }: { autoMode: boolean, chaosMultiplier: number }) => {
    const [amount, setAmount] = useState([120000]);
    const [result, setResult] = useState<ReturnType<typeof simulateBNPL> | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!autoMode) return;
        const interval = setInterval(() => {
            setAmount([Math.round(50000 + Math.random() * 200000 * chaosMultiplier)]);
        }, 4500); // Slower interval to allow reading
        return () => clearInterval(interval);
    }, [autoMode, chaosMultiplier]);

    const handleSimulate = () => {
        setLoading(true);
        setTimeout(() => {
            setResult(simulateBNPL(amount[0]));
            setLoading(false);
        }, 800);
    };

    useEffect(() => {
        if (autoMode && !loading) {
            const timer = setTimeout(handleSimulate, 1000); // Trigger after amount change
            return () => clearTimeout(timer);
        }
    }, [amount, autoMode]);

    return (
        <Card className="border-amber-100 bg-amber-50/50 backdrop-blur-sm h-full flex flex-col justify-between" id="tour-client-bnpl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-amber-600" /> Simulateur Scoring Crédit IA</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex justify-between"><Label>Montant du panier</Label><span className="font-bold text-lg text-amber-700">{amount[0].toLocaleString()} F</span></div>
                    <Slider value={amount} onValueChange={setAmount} min={10000} max={500000} step={5000} disabled={autoMode} />
                    <Button onClick={handleSimulate} disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-200">{loading ? <Loader2 className="animate-spin mr-2" /> : "Lancer Scoring"}</Button>
                </div>
                {result && (
                    <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-4"><span className="text-sm text-slate-500">Décision IA</span><Badge className={result.decision === 'ACCEPTÉ' ? 'bg-green-600' : 'bg-red-600'}>{result.decision}</Badge></div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div><div className="text-xs text-slate-400">Score de risque</div><div className="text-2xl font-bold text-slate-900">{result.score}/100</div></div>
                            <div><div className="text-xs text-slate-400">Indice Confiance</div><div className="text-2xl font-bold text-blue-600">{result.confidence}%</div></div>
                        </div>
                    </div>
                )}
                <div className="pt-4 border-t border-amber-200/50 mt-4">
                    <Button className="w-full bg-slate-900 text-white hover:bg-slate-800" asChild>
                        <Link to="/pricing?plan=scale">
                            <Crown className="w-4 h-4 text-amber-400 mr-2" /> Activer BNPL sur mon site
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const MerchantAISimulator = ({ autoMode }: { autoMode: boolean }) => {
    const [productName, setProductName] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResult, setGeneratedResult] = useState<any>(null);
    const typingInterval = useRef<NodeJS.Timeout | null>(null);

    // GHOST TYPING LOGIC
    useEffect(() => {
        if (!autoMode) {
            if (typingInterval.current) clearInterval(typingInterval.current);
            return;
        }

        const words = ["Robe Bazin Riche", "Montre Connectée", "iPhone 15 Pro", "Sac à main cuir", "Thieboudienne Traiteur"];
        let currentWordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentWord = words[currentWordIndex];

            if (isDeleting) {
                setProductName(currentWord.substring(0, charIndex - 1));
                charIndex--;
            } else {
                setProductName(currentWord.substring(0, charIndex + 1));
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                // Typed full word, trigger generate
                clearInterval(typingInterval.current!);
                handleGenerate().then(() => {
                    setTimeout(() => {
                        isDeleting = true;
                        typingInterval.current = setInterval(type, 50);
                    }, 3000); // View result for 3s
                });
                return;
            }

            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                currentWordIndex = (currentWordIndex + 1) % words.length;
                setGeneratedResult(null); // Clear result
            }
        };

        typingInterval.current = setInterval(type, 100);

        return () => { if (typingInterval.current) clearInterval(typingInterval.current); };
    }, [autoMode]);

    const handleGenerate = async () => {
        if (!productName && !autoMode) return; // Allow empty in autoMode logic internal call
        setIsGenerating(true);
        // Use current productName state
        const nameToUse = productName || "Produit Mystère";
        const result = await generateProductMetadata(nameToUse);
        setGeneratedResult(result);
        setIsGenerating(false);
    };

    return (
        <Card className="border-slate-200 bg-white shadow-md overflow-hidden h-full flex flex-col" id="tour-merchant-ai">
            <CardHeader className="bg-slate-900 text-white">
                <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-purple-400" /> Générateur Fiche Produit IA</CardTitle>
                <CardDescription className="text-slate-400">Tapez un nom de produit basique, notre IA fait le reste.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6 flex-1 flex flex-col">
                <div className="flex gap-4">
                    <Input placeholder="Ex: Baskets Rouges" value={productName} onChange={(e) => setProductName(e.target.value)} className="bg-white" />
                    <Button onClick={handleGenerate} disabled={isGenerating || !productName} className="bg-purple-600 hover:bg-purple-700 text-white min-w-[120px]">{isGenerating ? <Loader2 className="animate-spin h-4 w-4" /> : <><Sparkles className="mr-2 h-4 w-4" /> Go</>}</Button>
                </div>
                {generatedResult && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 rounded-xl border border-purple-100 bg-purple-50/50 p-4 flex-1">
                        <div className="space-y-1"><Label className="text-xs text-purple-600 font-bold uppercase">Titre Optimisé</Label><div className="font-semibold text-slate-900 text-sm">{generatedResult.title}</div></div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-white p-2 rounded border border-slate-100 shadow-sm text-center"><Label className="text-[10px] text-slate-400">Marché</Label><div className="font-mono text-slate-500 line-through text-xs">{generatedResult.price}</div></div>
                            <div className="bg-green-50 p-2 rounded border border-green-100 shadow-sm text-center"><Label className="text-[10px] text-green-600 font-bold flex items-center justify-center gap-1"><Zap className="h-3 w-3" /> IA</Label><div className="font-bold text-green-700 text-sm">{generatedResult.optimizedPrice}</div></div>
                        </div>
                    </div>
                )}
                <div className="mt-auto pt-4">
                    <Button className="w-full border-purple-200 hover:bg-purple-50 text-purple-700" variant="outline" asChild>
                        <Link to="/pricing?plan=growth">
                            Essayer l'Assistant Marchand
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

const StockPredictor = ({ chaosStockLevel, autoMode }: { chaosStockLevel: number, autoMode: boolean }) => {
    // LIVE DEPLEATING STOCK
    const [data, setData] = useState([
        { day: 'Lun', stock: 100 }, { day: 'Mar', stock: 85 }, { day: 'Mer', stock: 65 }, { day: 'Jeu', stock: 40 }, { day: 'Ven', stock: 25 }, { day: 'Sam', stock: 10 }, { day: 'Dim', stock: 5 },
    ]);

    useEffect(() => {
        if (chaosStockLevel < 1) {
            // CRASH STOCK
            setData(prev => prev.map(d => ({ ...d, stock: Math.max(0, d.stock * 0.2) })));
        } else if (autoMode) {
            // LIVE DEPLETION
            const interval = setInterval(() => {
                setData(prev => {
                    // Decrease active day (let's say we are 'Jeu')
                    const newData = [...prev];
                    const activeIdx = 3; // Jeu
                    if (newData[activeIdx].stock > 10) {
                        newData[activeIdx].stock -= 2; // Deplete
                        // Ripple effect to subsequent days
                        for (let i = activeIdx + 1; i < newData.length; i++) {
                            newData[i].stock = Math.max(0, newData[i - 1].stock - 15);
                        }
                    } else {
                        // Restock trigger
                        newData.forEach((d, i) => d.stock = 100 - (i * 15));
                    }
                    return newData;
                });
            }, 800);
            return () => clearInterval(interval);
        } else {
            // Restore default
            setData([
                { day: 'Lun', stock: 100 }, { day: 'Mar', stock: 85 }, { day: 'Mer', stock: 65 }, { day: 'Jeu', stock: 40 }, { day: 'Ven', stock: 25 }, { day: 'Sam', stock: 10 }, { day: 'Dim', stock: 5 },
            ]);
        }
    }, [chaosStockLevel, autoMode]);

    return (
        <Card className="border-slate-200 bg-white shadow-md">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2"><Box className="h-5 w-5 text-orange-500" /> Prédictif de Stock (IA)</CardTitle>
                <CardDescription>Anticipez les ruptures avant qu'elles n'arrivent.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full relative">
                    {chaosStockLevel < 1 && (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-red-500 text-center animate-in zoom-in duration-500 z-10 w-[80%]">
                            <div className="flex items-center justify-center gap-2 text-red-600 font-bold mb-1"><TrendingUp className="h-4 w-4" /> RUPTURE IMMINETE</div>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white w-full animate-pulse">Commander Express (IA)</Button>
                        </div>
                    )}
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                            <Line type="stepAfter" dataKey="stock" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} isAnimationActive={!autoMode} />
                            <line x1="0" y1="170" x2="100%" y2="170" stroke="#ef4444" strokeDasharray="3 3" />
                            <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

const AdsSimulator = ({ budget }: { budget: number }) => {
    const data = generateAdsData(budget);
    return (
        <Card className="border-slate-200 bg-white shadow-md" id="tour-merchant-ads">
            <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Megaphone className="h-5 w-5 text-pink-500" /> Simulateur Publicitaire</CardTitle><CardDescription>Estimez portée vs budget.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs><linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} /><stop offset="95%" stopColor="#ec4899" stopOpacity={0} /></linearGradient></defs>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <RechartsTooltip />
                            <Area type="monotone" dataKey="Payant" stroke="#ec4899" fillOpacity={1} fill="url(#colorPaid)" />
                            <Area type="monotone" dataKey="Organique" stroke="#cbd5e1" fill="#f1f5f9" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

// --- MAIN PAGE ---
const DemoHub = () => {
    // Engine State
    const [engine] = useState(() => createSimulationEngine({ speed: 1, chaosLevel: 0.1, objective: "growth" }));
    const [events, setEvents] = useState<SimulationEvent[]>([]);
    const [simulationActive, setSimulationActive] = useState(false);
    const [simSpeed, setSimSpeed] = useState<1 | 2 | 5>(1);
    const [activeTab, setActiveTab] = useState('merchant');
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [guideSteps, setGuideSteps] = useState<GuideStep[]>(GUIDE_SCENARIOS['global']);

    // State Variables for Visuals
    const [dailyOrders, setDailyOrders] = useState([15]);
    const [avgOrderValue, setAvgOrderValue] = useState([12500]);
    const [adsBudget, setAdsBudget] = useState([5000]);

    // Chaos Effect State
    const [chaosMultiplier, setChaosMultiplier] = useState(1.0); // 1.0 = Normal
    const [stockLevel, setStockLevel] = useState(1.0); // 1.0 = Normal
    const [deliveryEfficiency, setDeliveryEfficiency] = useState(0.98);

    const updateLogs = useCallback(() => { setEvents([...engine.events]); }, [engine]);

    const handleChaos = () => {
        const { event, effect } = triggerChaos(engine);

        // 1. Log the crash
        updateLogs();
        toast.error("CRISE DÉTECTÉE !", { description: event.message });

        // 2. Apply Visual Effects (THE MISSING LINK)
        if (effect) {
            if (effect.target === 'orders') {
                setDailyOrders([Math.floor(dailyOrders[0] * effect.magnitude)]);
                setChaosMultiplier(effect.magnitude);
            } else if (effect.target === 'stock') {
                setStockLevel(0); // Crash stock
            } else if (effect.target === 'delivery') {
                setDeliveryEfficiency(0.40); // Traffic jam
            }

            // 3. AI Resolution (Auto-heal after 5s)
            const healTime = 5000 / simSpeed;
            setTimeout(() => {
                engine.log("✔ IA : Contre-mesures déployées. Retour à la normale.", "info");
                updateLogs();
                // Reset visuals
                setChaosMultiplier(1.0);
                setStockLevel(1.0);
                setDeliveryEfficiency(0.98);
                if (effect.target === 'orders') setDailyOrders([15]); // Reset orders
            }, healTime);
        }
    };

    useAutoSimulation(simulationActive, simSpeed, [
        () => {
            // Only jitter if not in chaos mode (keep chaos spike visible)
            if (chaosMultiplier === 1.0) {
                const newOrders = Math.max(1, Math.min(100, engine.randomFactor(dailyOrders[0])));
                setDailyOrders([newOrders]);
            }
            if (Math.random() > 0.7) {
                const msgs = ["Nouvelle commande confirmée", "Ajustement prix dynamique", "Livraison terminée", "Visiteur converti"];
                engine.log(msgs[Math.floor(Math.random() * msgs.length)]);
                updateLogs();
            }
        },
        () => {
            if (Math.random() > 0.9) {
                // Ads budget shift
                setAdsBudget(prev => [Math.round(prev[0] * (0.9 + Math.random() * 0.2))]);
            }
        }
    ]);

    const startGuide = () => {
        let steps = [...GUIDE_SCENARIOS['global']];
        if (activeTab === 'merchant') steps = [...steps, ...GUIDE_SCENARIOS['merchant']];
        if (activeTab === 'delivery') steps = [...steps, ...GUIDE_SCENARIOS['delivery']];
        if (activeTab === 'client') steps = [...steps, ...GUIDE_SCENARIOS['client']];
        setGuideSteps(steps);
        setIsGuideOpen(true);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-amber-100 selection:text-amber-900 font-sans">
            <Navbar />
            <TourGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} steps={guideSteps} />

            <main className="flex-1 pb-12">
                {/* Control Bar */}
                <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
                    <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Badge variant="outline" className={`bg-slate-100 border-slate-300 ${chaosMultiplier > 1.5 ? 'animate-pulse bg-red-100 text-red-600 border-red-400' : 'text-slate-600'}`}>
                                {chaosMultiplier > 1.5 ? '⚠️ ALERT MODE' : '🧪 MODE LABORATOIRE'}
                            </Badge>
                            <h1 className="text-xl font-bold text-slate-900 hidden md:block">Yoombal Simulation Engine</h1>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200" id="tour-sim-controls">
                            <Button variant={simulationActive ? "destructive" : "default"} size="sm" onClick={() => setSimulationActive(!simulationActive)} className={simulationActive ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}>{simulationActive ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Lancer Simulation</>}</Button>
                            <div className="h-6 w-px bg-slate-300 mx-1"></div>
                            {[1, 2, 5].map((speed) => (<button key={speed} onClick={() => setSimSpeed(speed as 1 | 2 | 5)} disabled={!simulationActive} className={`px-3 py-1 rounded text-xs font-bold transition-all ${simSpeed === speed ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>x{speed}</button>))}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={startGuide} className="hidden md:flex"><HelpCircle className="mr-2 h-4 w-4" /> Guide Interactif</Button>
                            <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200" onClick={handleChaos} id="tour-chaos-btn"><AlertTriangle className="mr-2 h-4 w-4" /> CRISE</Button>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 space-y-8">
                        {/* KPI CARDS */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* KPIS REACT TO STATE */}
                            <Card className={`border-slate-100 shadow-sm transition-all ${chaosMultiplier > 1.5 ? 'bg-red-50 border-red-200 scale-105' : ''}`}>
                                <CardContent className="p-4 flex flex-col items-center text-center">
                                    <Package className={`h-6 w-6 mb-2 text-blue-600`} />
                                    <div className="text-2xl font-bold text-slate-900">{dailyOrders[0]}</div>
                                    <div className="text-xs text-slate-500 uppercase font-medium">Commandes /j</div>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-100 shadow-sm"><CardContent className="p-4 flex flex-col items-center text-center"><Store className="h-6 w-6 mb-2 text-purple-600" /><div className="text-2xl font-bold text-slate-900">{(avgOrderValue[0] / 1000).toFixed(1)}k</div><div className="text-xs text-slate-500 uppercase font-medium">Panier Moyen</div></CardContent></Card>
                            <Card className="border-slate-100 shadow-sm"><CardContent className="p-4 flex flex-col items-center text-center"><Megaphone className="h-6 w-6 mb-2 text-pink-600" /><div className="text-2xl font-bold text-slate-900">{(adsBudget[0] / 1000).toFixed(1)}k</div><div className="text-xs text-slate-500 uppercase font-medium">Budget Pub</div></CardContent></Card>
                            <Card className="border-slate-100 shadow-sm"><CardContent className="p-4 flex flex-col items-center text-center"><TrendingUp className="h-6 w-6 mb-2 text-green-600" /><div className="text-2xl font-bold text-slate-900">{((dailyOrders[0] * avgOrderValue[0] * 30) / 1000000).toFixed(2)}M</div><div className="text-xs text-slate-500 uppercase font-medium">CA Mensuel</div></CardContent></Card>
                        </div>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="bg-white border border-slate-200 shadow-sm w-full justify-start p-1 h-auto">
                                <TabsTrigger value="merchant" className="px-6 py-2.5">Espace Marchand</TabsTrigger>
                                <TabsTrigger value="client" className="px-6 py-2.5">Crédit IA (BNPL)</TabsTrigger>
                                <TabsTrigger value="delivery" className="px-6 py-2.5">Hyper-Logistique</TabsTrigger>
                            </TabsList>

                            <TabsContent value="merchant" className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card className="h-full border-slate-200 shadow-md">
                                        <CardHeader><CardTitle>Marchand : Revenus & Pubs</CardTitle><CardDescription>Corrélation automatique Budget Pub / Commandes</CardDescription></CardHeader>
                                        <CardContent className="space-y-6">
                                            <div className="space-y-3" id="tour-merchant-inputs">
                                                <div className="flex justify-between text-sm"><span className="text-slate-600">Commandes Quotidiennes</span> <b>{dailyOrders[0]}</b></div>
                                                <Slider value={dailyOrders} onValueChange={setDailyOrders} min={0} max={100} className="py-2" disabled={simulationActive} />
                                            </div>
                                            <div className="h-40 mt-4 bg-slate-50 rounded-xl border border-slate-100 flex items-end justify-between px-4 pb-2 overflow-hidden relative" id="tour-merchant-revenue">
                                                {Array.from({ length: 12 }).map((_, i) => {
                                                    const height = Math.min(100, Math.max(10, dailyOrders[0] + (Math.sin(i) * 10) + (Math.random() * 20)));
                                                    return <div key={i} className={`w-[6%] rounded-t-sm transition-all duration-500 ${chaosMultiplier > 1.5 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ height: `${height}%` }}></div>
                                                })}
                                                <div className="absolute top-2 right-2 text-xs font-bold text-slate-400">ACTIVITÉ TEMPS RÉEL</div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <MerchantAISimulator autoMode={simulationActive} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <AdsSimulator budget={adsBudget[0]} />
                                    <StockPredictor chaosStockLevel={stockLevel} autoMode={simulationActive} />
                                </div>
                            </TabsContent>

                            <TabsContent value="client" className="animate-in fade-in slide-in-from-bottom-4">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <BNPLSimulatorWidget autoMode={simulationActive} chaosMultiplier={chaosMultiplier} />
                                    <div className="space-y-8 p-4" id="tour-client-features">
                                        <h3 className="font-bold text-xl">Expérience Premium</h3>
                                        <ul className="space-y-4">
                                            <li className="flex items-center gap-2"><CheckCircle2 className="text-green-500" /> Recherche Visuelle</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="text-green-500" /> Suivi Livreur Live</li>
                                            <li className="flex items-center gap-2"><CheckCircle2 className="text-green-500" /> Chatbot Support IA 24/7</li>
                                        </ul>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="delivery" className="animate-in fade-in slide-in-from-bottom-4">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card className="h-full border-slate-200 shadow-md overflow-hidden" id="tour-delivery-map">
                                        <CardHeader className="bg-slate-900/5 pb-4"><CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-emerald-600" /> Live Fleet Tracking</CardTitle></CardHeader>
                                        <CardContent className="p-0 relative h-[350px] bg-slate-900">
                                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px]"></div>
                                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border rounded-full animate-ping [animation-duration:3s] ${deliveryEfficiency < 0.5 ? 'border-red-500/50' : 'border-emerald-500/20'}`}></div>
                                            {Array.from({ length: 8 }).map((_, i) => (
                                                <div key={i} className="group absolute w-4 h-4"
                                                    style={{ transition: 'all 2s linear', top: `${simulationActive ? 20 + Math.random() * 60 : 50}%`, left: `${simulationActive ? 20 + Math.random() * 60 : 50 + (i * 5) - 20}%` }}>
                                                    {/* Driver Dot */}
                                                    <div className={`relative w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] cursor-pointer ${deliveryEfficiency < 0.5 ? 'bg-red-500 text-red-500' : 'bg-emerald-500 text-emerald-500'}`}>
                                                        <div className="w-full h-full bg-white rounded-full opacity-50 animate-ping"></div>
                                                    </div>
                                                    {/* Tooltip Card (Shown on Hover) */}
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-slate-800 text-white text-[10px] p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none border border-slate-700">
                                                        <div className="font-bold text-emerald-400">Livreur #{100 + i}</div>
                                                        <div className="flex items-center gap-1 text-slate-400"><Battery className="h-3 w-3" /> {85 - (i * 5)}%</div>
                                                        <div className="flex items-center gap-1 text-slate-400"><Signal className="h-3 w-3" /> 4G Good</div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2" id="tour-delivery-stats">
                                                <div className="bg-slate-800/90 backdrop-blur p-2 rounded-lg text-center border border-slate-700"><div className="text-xs text-slate-400">Livreurs</div><div className="font-bold text-emerald-400">{simulationActive ? '142' : '15'}</div></div>
                                                <div className="bg-slate-800/90 backdrop-blur p-2 rounded-lg text-center border border-slate-700"><div className="text-xs text-slate-400">Cmd/h</div><div className="font-bold text-blue-400">{simulationActive ? Math.round(850 * chaosMultiplier) : '0'}</div></div>
                                                <div className="bg-slate-800/90 backdrop-blur p-2 rounded-lg text-center border border-slate-700"><div className="text-xs text-slate-400">Optim.</div><div className={`font-bold ${deliveryEfficiency < 0.5 ? 'text-red-500' : 'text-purple-400'}`}>{(deliveryEfficiency * 100).toFixed(1)}%</div></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="h-full border-slate-200 shadow-md" id="tour-delivery-vehicle">
                                        <CardHeader><CardTitle className="flex items-center gap-2"><Car className="h-5 w-5 text-blue-600" /> Comparatif Véhicules</CardTitle></CardHeader>
                                        <CardContent className="flex flex-col h-full">
                                            <div className="space-y-4 flex-1">
                                                {[{ name: 'Moto', val: 450000, color: 'bg-emerald-500' }, { name: 'Vélo', val: 150000, color: 'bg-blue-500' }, { name: 'Fourgon', val: 1200000, color: 'bg-purple-500' }].map(v => (
                                                    <div key={v.name} className="space-y-1"><div className="flex justify-between text-sm"><span>{v.name}</span> <span>{v.val.toLocaleString()} F</span></div><div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${v.color}`} style={{ width: `${v.val / 15000}%` }}></div></div></div>
                                                ))}
                                                <p className="text-xs text-slate-400 mt-4">Revenu net mensuel estimé après déduction carburant.</p>
                                            </div>
                                            <div className="pt-6">
                                                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                                                    <Link to="/pricing?plan=starter">
                                                        <Truck className="w-4 h-4 mr-2" /> Numériser ma Flotte
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <SimulationTimeline events={events} />
                        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Sparkles className="h-4 w-4 text-yellow-300" /> Yoombal Vision</h3>
                                <p className="text-indigo-100 text-sm mb-4">L'IA analyse en permanence 140+ points de données pour optimiser votre business.</p>
                                <div className="space-y-2">
                                    {["Analyse de la concurrence locale", "Météo & Impact Livraison", "Tendances de recherche Google", "Solvabilité micro-crédit"].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs bg-white/10 p-2 rounded"><div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>{item}</div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default DemoHub;
