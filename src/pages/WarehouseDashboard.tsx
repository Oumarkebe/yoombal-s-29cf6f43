
import { useState, useEffect } from "react";
import { useWarehouse } from "@/hooks/useWarehouse";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, ArrowLeft, Archive, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const WarehouseDashboard = () => {
    const { warehouses, inventory, loading, fetchInventory, addMovement } = useWarehouse();
    const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
    const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);

    // Movement Form State
    const [moveType, setMoveType] = useState<'IN' | 'OUT'>('IN');
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (warehouses.length > 0 && !selectedWarehouse) {
            setSelectedWarehouse(warehouses[0].id);
        }
    }, [warehouses]);

    useEffect(() => {
        if (selectedWarehouse) {
            fetchInventory(selectedWarehouse);
        }
    }, [selectedWarehouse]);

    const handleMovementSubmit = async () => {
        if (!selectedWarehouse || !productId || !quantity) return;

        await addMovement(moveType, parseInt(quantity), productId, selectedWarehouse, undefined, notes);
        setIsMovementModalOpen(false);
        setProductId('');
        setQuantity('');
        setNotes('');
        setMoveType('IN');
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Archive className="h-8 w-8 text-blue-600" />
                    Gestion des Stocks
                </h1>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Select value={selectedWarehouse || ''} onValueChange={setSelectedWarehouse}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Choisir un entrepôt" />
                        </SelectTrigger>
                        <SelectContent>
                            {warehouses.map(w => (
                                <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Dialog open={isMovementModalOpen} onOpenChange={setIsMovementModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="mr-2 h-4 w-4" /> Mouvement
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Nouveau Mouvement de Stock</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="flex gap-4">
                                    <Button
                                        variant={moveType === 'IN' ? 'default' : 'outline'}
                                        className={moveType === 'IN' ? 'bg-green-600' : ''}
                                        onClick={() => setMoveType('IN')}
                                    >
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Entrée (Réception)
                                    </Button>
                                    <Button
                                        variant={moveType === 'OUT' ? 'default' : 'outline'}
                                        className={moveType === 'OUT' ? 'bg-amber-600' : ''}
                                        onClick={() => setMoveType('OUT')}
                                    >
                                        <ArrowRight className="mr-2 h-4 w-4" /> Sortie (Expédition)
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <Label>ID Produit / SKU</Label>
                                    <Input placeholder="Scanner ou entrer ID..." value={productId} onChange={e => setProductId(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Quantité</Label>
                                    <Input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Notes</Label>
                                    <Input placeholder="Note optionnelle..." value={notes} onChange={e => setNotes(e.target.value)} />
                                </div>

                                <Button className="w-full" onClick={handleMovementSubmit}>Valider Mouvement</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">Chargement...</div>
            ) : inventory.length === 0 ? (
                <Card className="p-8 text-center text-slate-500 bg-slate-50">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>Aucun stock dans cet entrepôt ou entrepôt non sélectionné.</p>
                </Card>
            ) : (
                <Card className="overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produit</TableHead>
                                <TableHead>Quantité</TableHead>
                                <TableHead>Zone</TableHead>
                                <TableHead>Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {inventory.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            {item.product?.image_url && <img src={item.product.image_url} alt="" className="w-8 h-8 rounded object-cover" />}
                                            <div>
                                                <div>{item.product?.name || 'Produit Inconnu'}</div>
                                                <div className="text-xs text-slate-400 font-mono opacity-0 group-hover:opacity-100">{item.product_id.slice(0, 8)}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-lg font-bold">{item.quantity}</TableCell>
                                    <TableCell>{item.zone_id || '-'}</TableCell>
                                    <TableCell>
                                        {item.quantity <= item.min_threshold ? (
                                            <Badge variant="destructive">Stock Faible</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">En stock</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
};

export default WarehouseDashboard;
