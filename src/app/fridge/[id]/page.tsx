'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Fridge, Item } from '@/types';
import { differenceInDays, parseISO, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, ArrowLeft, Loader2, ChefHat, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

export default function FridgeDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [fridge, setFridge] = useState<Fridge | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [view, setView] = useState<'items' | 'recipes'>('items');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    // 1. Récupérer le frigo
    const { data: fridgeData } = await supabase
      .from('fridges')
      .select('*')
      .eq('id', id)
      .single();

    setFridge(fridgeData);

    // 2. Récupérer les items triés par date d'expiration
    const { data: itemsData } = await supabase
      .from('items')
      .select('*')
      .eq('fridge_id', id)
      .order('expiry_date', { ascending: true });

    if (itemsData) {
      // Calculer le statut d'urgence
      const processedItems = itemsData.map((item: any) => {
        const daysLeft = differenceInDays(parseISO(item.expiry_date), new Date());
        let status: Item['status'] = 'good';
        if (daysLeft < 0) status = 'urgent'; // Périmé
        else if (daysLeft <= 2) status = 'urgent'; // Très bientôt
        else if (daysLeft <= 5) status = 'warning'; // Bientôt
        
        return { ...item, status };
      });
      setItems(processedItems);
    }
    setLoading(false);
  };

  const deleteItem = async (itemId: number) => {
     const confirm = window.confirm("Supprimer cet item ?");
     if(!confirm) return;

     await supabase.from('items').delete().eq('id', itemId);
     setItems(items.filter(i => i.id !== itemId));
  }

  if (loading || !fridge) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* En-tête Dynamique */}
      <div className={`bg-gradient-to-br ${fridge.color} p-6 pt-12 pb-8 rounded-b-[2.5rem] shadow-lg`}>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => router.push('/')} className="text-white hover:bg-white/20 p-2 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
          <div className="bg-white/20 px-3 py-1 rounded-full text-white text-xs font-medium backdrop-blur-sm">
            ID: {fridge.id}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{fridge.name}</h1>
            <p className="text-white/90 text-sm font-medium flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">{items.length} items</span>
              {items.some(i => i.status === 'urgent') && (
                <span className="bg-orange-500/80 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                   <AlertCircle size={10} /> Attention requise
                </span>
              )}
            </p>
          </div>
          <div className="text-6xl animate-bounce-slow">{fridge.avatar}</div>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex gap-2 px-6 py-4 bg-white sticky top-0 z-10 border-b border-gray-50">
        {['items', 'recipes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setView(tab as any)}
            className={clsx(
              "flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all capitalize",
              view === tab 
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md transform scale-105"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            )}
          >
            {tab === 'items' ? 'Frigo' : 'Recettes'}
          </button>
        ))}
      </div>

      {/* Liste des items */}
      <div className="flex-1 px-6 py-2 space-y-3 pb-32">
        {view === 'items' && (
          <>
            {items.length === 0 && (
              <div className="text-center mt-10 text-gray-400">
                <div className="text-4xl mb-2">🕸️</div>
                <p>Le frigo est vide...</p>
              </div>
            )}

            {items.map((item) => (
              <div 
                key={item.id} 
                className="group bg-white border border-gray-100 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl">
                    {item.category}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.quantity}</div>
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end gap-1">
                   <div className={clsx(
                      "text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide",
                      item.status === 'urgent' ? "bg-red-100 text-red-600" :
                      item.status === 'warning' ? "bg-orange-100 text-orange-600" :
                      "bg-emerald-100 text-emerald-600"
                    )}>
                      {item.status === 'urgent' ? 'Périmé / Urgent' : formatDistanceToNow(parseISO(item.expiry_date), { locale: fr, addSuffix: true })}
                    </div>
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Supprimer
                    </button>
                </div>
              </div>
            ))}
          </>
        )}

        {view === 'recipes' && (
          <div className="text-center py-10">
            <ChefHat className="mx-auto w-12 h-12 text-purple-300 mb-3" />
            <h3 className="font-bold text-gray-700">Bientôt disponible</h3>
            <p className="text-sm text-gray-500">Génération de recettes IA en cours de développement...</p>
          </div>
        )}
      </div>

      {/* Bouton Ajouter (Lien vers la page Add) */}
      <Link href={`/fridge/${id}/add`}>
        <button className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform z-20 border-4 border-white">
          <Plus className="w-8 h-8 text-white" />
        </button>
      </Link>
    </div>
  );
}