'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { addDays, format } from 'date-fns';

export default function AddItemPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    expiry_date: format(addDays(new Date(), 7), 'yyyy-MM-dd'), // Par défaut +7 jours
    category: '🍎'
  });

  const categories = ['🍎', '🥦', '🥩', '🥛', '🧀', '🥫', '🍦', '🥤'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('items')
        .insert([{
          fridge_id: Number(id),
          name: formData.name,
          quantity: formData.quantity,
          expiry_date: formData.expiry_date,
          category: formData.category
        }]);

      if (error) throw error;

      router.back(); // Retour au frigo
    } catch (error) {
      alert('Erreur lors de l\'ajout');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Simple */}
      <div className="p-6 pt-12 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => router.back()} className="text-gray-600">
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Ajouter un aliment</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
        
        {/* Choix Emoji */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-3">Catégorie</label>
           <div className="flex gap-3 overflow-x-auto pb-2">
             {categories.map(emoji => (
               <button
                 key={emoji}
                 type="button"
                 onClick={() => setFormData({...formData, category: emoji})}
                 className={`w-12 h-12 text-2xl rounded-xl flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                   formData.category === emoji 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-gray-200 hover:border-gray-300'
                 }`}
               >
                 {emoji}
               </button>
             ))}
           </div>
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit</label>
          <input 
            required
            type="text"
            placeholder="Ex: Beurre Doux"
            className="w-full p-4 bg-gray-50 rounded-xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all outline-none border-2"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>

        {/* Quantité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
          <input 
            type="text"
            placeholder="Ex: 250g, 1L, 3 un."
            className="w-full p-4 bg-gray-50 rounded-xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all outline-none border-2"
            value={formData.quantity}
            onChange={e => setFormData({...formData, quantity: e.target.value})}
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de péremption</label>
          <input 
            required
            type="date"
            className="w-full p-4 bg-gray-50 rounded-xl border-transparent focus:border-emerald-500 focus:bg-white focus:ring-0 transition-all outline-none border-2"
            value={formData.expiry_date}
            onChange={e => setFormData({...formData, expiry_date: e.target.value})}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 mt-auto"
        >
          {loading ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Ajouter au frigo</>}
        </button>
      </form>
    </div>
  );
}