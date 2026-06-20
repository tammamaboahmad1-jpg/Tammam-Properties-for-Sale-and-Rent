import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminIndex() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*, property_images(*)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (error) console.error(error);
    setPending(data || []);
    setLoading(false);
  }

  async function action(id: string, act: 'approve' | 'reject') {
    setLoading(true);
    const res = await fetch(`/api/admin/properties/${id}/${act}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET || '' }
    });
    const j = await res.json();
    if (!res.ok) alert('خطأ: ' + (j.error || JSON.stringify(j)));
    await fetchPending();
    setLoading(false);
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-4">لوحة الإدارة — مراجعة الإعلانات</h1>
      {loading && <div className="mb-4 text-sm text-gray-600">جارٍ التنفيذ...</div>}
      {pending.length === 0 && <div className="text-gray-600">لا توجد إعلانات بانتظار المراجعة.</div>}
      <div className="grid grid-cols-1 gap-4">
        {pending.map(p => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <div className="flex gap-4">
              <img src={p.property_images?.[0]?.url || '/placeholder.png'} className="w-36 h-24 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{p.title || '(بدون عنوان)'}</h3>
                <p className="text-sm text-gray-600">{p.region} — {p.city} — {p.listing_type}</p>
                <p className="mt-2 text-sm text-gray-700 line-clamp-3">{p.description}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => action(p.id, 'approve')} className="px-3 py-1 bg-green-600 text-white rounded">قبول ونشر</button>
                  <button onClick={() => action(p.id, 'reject')} className="px-3 py-1 bg-red-600 text-white rounded">رفض</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
