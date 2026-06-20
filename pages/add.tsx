import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ImageUploader from '../../components/ImageUploader';

export default function AddProperty() {
  const [form, setForm] = useState({
    title: '', description: '', price: '', currency: 'EGP', property_type: '', listing_type: 'sale', region: '', city: '', address: '', features: ''
  });
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function onUploaded(url: string) {
    setUploadedUrls(prev => [...prev, url]);
  }

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price || 0),
        currency: form.currency,
        property_type: form.property_type,
        listing_type: form.listing_type,
        region: form.region,
        city: form.city,
        address: form.address,
        features: form.features.split(',').map(s => s.trim()).filter(Boolean)
      };
      const res = await fetch('/api/properties', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Failed to create');
      const propertyId = j.property.id;
      // attach images
      for (const url of uploadedUrls) {
        await fetch('/api/properties/attach-image', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ property_id: propertyId, url }) });
      }
      alert('تم إرسال الإعلان للمراجعة');
      setForm({ title: '', description: '', price: '', currency: 'EGP', property_type: '', listing_type: 'sale', region: '', city: '', address: '', features: '' });
      setUploadedUrls([]);
    } catch (err: any) {
      alert('خطأ: ' + (err.message || err));
    }
    setLoading(false);
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-4">أضف عقارك</h1>
      <form onSubmit={submit} className="grid grid-cols-1 gap-4 max-w-2xl">
        <input placeholder="عنوان الإعلان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="p-2 border rounded" />
        <textarea placeholder="وصف" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="p-2 border rounded h-28" />
        <div className="grid grid-cols-3 gap-2">
          <input placeholder="السعر" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="p-2 border rounded col-span-2" />
          <input placeholder="العملة" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="p-2 border rounded" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="نوع العقار" value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className="p-2 border rounded" />
          <select value={form.listing_type} onChange={(e) => setForm({ ...form, listing_type: e.target.value })} className="p-2 border rounded">
            <option value="sale">بيع</option>
            <option value="rent">إيجار</option>
            <option value="offplan">أوف بلان</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="المنطقة" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="p-2 border rounded" />
          <input placeholder="المدينة" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="p-2 border rounded" />
        </div>
        <input placeholder="العنوان (اختياري)" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="p-2 border rounded" />
        <input placeholder="مميزات (افصل بفواصل)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="p-2 border rounded" />

        <ImageUploader onUploaded={onUploaded} />

        <div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">{loading ? 'جارٍ الإرسال...' : 'أرسل للمراجعة'}</button>
        </div>
      </form>
    </div>
  );
}
