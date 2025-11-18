import { Link } from 'react-router-dom'

export default function PropertyCard({ p }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      {p.photos?.[0] && (
        <img src={p.photos[0]} alt={p.title} className="h-48 w-full object-cover" />
      )}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-slate-900">{p.title}</h3>
        <p className="text-sm text-slate-600">{p.areaName}, {p.city}</p>
        <div className="flex flex-wrap gap-3 text-sm text-slate-700">
          <span>{p.houseBedroomsTotal} bedrooms</span>
          <span>From £{p.monthlyRent} pcm</span>
          <span>{p.distanceToUniversityText}</span>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="px-2 py-1 rounded-full bg-slate-100 border">{p.listingType === 'HOUSE' ? 'Whole house' : 'Room in shared house'}</span>
          {p.billsIncluded && <span className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">Bills included</span>}
          {p.furnished && <span className="px-2 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">Furnished</span>}
        </div>
        <Link to={`/property/${p.id}`} className="mt-2 inline-flex justify-center items-center px-4 py-2 rounded-md bg-slate-900 text-white">View details</Link>
      </div>
    </div>
  )
}
