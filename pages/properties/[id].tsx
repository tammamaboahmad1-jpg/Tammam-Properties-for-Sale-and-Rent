import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../../lib/supabaseClient';

export default function PropertyPage() {
  const router = useRouter();
  const { id } = router.query;
  const [prop, setProp] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data, error } = await supabase.from('properties').select('*, property_images(*)').eq('id', id).single();
      if (error) console.error(error);
      setProp(data);
    })();
  }, [id]);

  if (!prop) return <div className="container py-10">جارٍ التحميل...</div>;

  const whatsapp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || '';
  const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`استفسار عن العقار: ${prop.title} (ID:${prop.id})`)} ` : '#';

  return (
    <div className="container py-10">
      <div className="bg-white p-4 rounded shadow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-2">
              {prop.property_images?.map((img: any) => (
                <img key={img.id} src={img.url} className="w-full object-cover rounded" />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{prop.title}</h1>
            <p className="text-indigo-600 font-bold mt-2">{prop.price} {prop.currency}</p>
            <p className="mt-2 text-gray-700">{prop.region} — {prop.city}</p>
            <div className="mt-4">
              <h3 className="font-semibold">الوصف</h3>
              <p className="text-gray-700">{prop.description}</p>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">المميزات</h3>
              <ul className="list-disc list-inside">
                {Array.isArray(prop.features) && prop.features.map((f: string, i: number) => <li key={i}>{f}</li>)}
              </ul>
            </div>
            <div className="mt-6 flex gap-2">
              <a href={waLink} target="_blank" rel="noreferrer" className="px-4 py-2 bg-green-600 text-white rounded">تواصل عبر واتساب</a>
              <a href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL || ''}?subject=${encodeURIComponent('استفسار عن عقار ' + prop.title)}`} className="px-4 py-2 bg-gray-200 rounded">أرسل بريدًا</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
