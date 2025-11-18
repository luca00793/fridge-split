'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Fridge } from '@/types';
import { ShoppingCart, Plus, Loader2 } from 'lucide-react';

export default function HomePage() {
  const [fridges, setFridges] = useState<Fridge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFridges();
  }, []);

  const fetchFridges = async () => {
    try {
      // Récupère les frigos et compte les items (count)
      const { data, error } = await supabase
        .from('fridges')
        .select('*, items(count)');
      
      if (error) throw error;

      // Transformation pour aplatir le compteur
      const formatted = data.map((f: any) => ({
        ...f,
        item_count: f.items[0]?.count || 0
      }));
      
      setFridges(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>;
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="p-6 pb-4 pt-12">
        <h1 className="text-2xl font-bold text-gray-800">Hello Chef! 👋</h1>
        <p className="text-gray-600 text-sm mt-1">Qu'est-ce qu'on cuisine aujourd'hui ?</p>
      </div>

      {/* Stats */}
      <div className="px-6 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs text-gray-500">Total Items</div>
            <div className="text-xl font-bold text-gray-800">
              {fridges.reduce((acc, curr) => acc + (curr.item_count || 0), 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Liste des Frigos */}
      <div className="px-6 pb-2 mt-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Vos Frigos</h2>
      </div>
      
      <div className="px-6 pb-4 space-y-4">
        {fridges.map(fridge => (
          <Link href={`/fridge/${fridge.id}`} key={fridge.id} className="block">
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
              <div className={`h-28 bg-gradient-to-br ${fridge.color} p-5 flex items-center justify-between`}>
                <div>
                   <h3 className="text-xl font-bold text-white">{fridge.name}</h3>
                   <div className="flex -space-x-2 mt-2">
                      <div className="w-6 h-6 rounded-full bg-white/30 border border-white flex items-center justify-center text-[10px] text-white">You</div>
                      <div className="w-6 h-6 rounded-full bg-white/30 border border-white flex items-center justify-center text-[10px] text-white">+2</div>
                   </div>
                </div>
                <div className="text-5xl drop-shadow-md">{fridge.avatar}</div>
              </div>
              
              <div className="p-4 flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-gray-800">{fridge.item_count}</span>
                  <span className="text-xs text-gray-500 ml-2">items au frais</span>
                </div>
                <div className="text-emerald-500 text-sm font-medium">Ouvrir →</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Bouton Flottant (Fake Action pour l'instant) */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-gray-900 rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}