import React from 'react';

type Props = {
  property: any
}

export default function PropertyCard({ property }: Props) {
  const image = property.property_images?.[0]?.url || '/placeholder.png';
  return (
    <div className="bg-white shadow rounded overflow-hidden">
      <img src={image} alt={property.title} className="w-full h-48 object-cover"/>
      <div className="p-4">
        <h3 className="font-semibold text-lg">{property.title}</h3>
        <p className="text-sm text-gray-600">{property.region} — {property.city}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-indigo-600 font-bold">{property.price} {property.currency}</span>
          <a href={`/properties/${property.id}`} className="text-sm text-gray-700 underline">عرض</a>
        </div>
      </div>
    </div>
  );
}
