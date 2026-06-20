import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import clsx from 'clsx';

type Props = { propertyId?: string; onUploaded?: (url: string) => void };

export default function ImageUploader({ propertyId, onUploaded }: Props) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  async function upload() {
    if (!files || files.length === 0) return alert('اختر صورة أولاً');
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = `${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from('property-images').upload(path, file, { cacheControl: '3600', upsert: false });
      if (error) {
        console.error(error);
        alert('خطأ في الرفع: ' + error.message);
        continue;
      }
      const { publicURL } = supabase.storage.from('property-images').getPublicUrl(path);
      if (onUploaded && publicURL) onUploaded(publicURL);
    }
    setUploading(false);
    setFiles(null);
    alert('انتهى الرفع');
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">صور العقار</label>
      <input type="file" multiple accept="image/*" onChange={(e) => setFiles(e.target.files)} className="mt-2" />
      <div className="mt-2">
        <button onClick={upload} disabled={uploading} className={clsx('px-3 py-1 rounded text-white', uploading ? 'bg-gray-400' : 'bg-indigo-600')}>
          {uploading ? 'جارٍ الرفع...' : 'رفع الصور'}
        </button>
      </div>
    </div>
  );
}
