import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import PropertyCard from '../components/PropertyCard';

export default function Home() {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('properties').select('*, property_images(*)').eq('status', 'published').order('created_at', { ascending: false });
      setProperties(data || []);
    })();
  }, []);

  return (
    <div className="container py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">منصة العقارات - النسخة التجريبية</h1>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(p => <PropertyCard key={p.id} property={p} />)}
      </section>
    </div>
  );
}
