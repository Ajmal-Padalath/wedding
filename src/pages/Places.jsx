import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { PlaceModal } from '../components/modals/PlaceModal';
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Phone,
  Mail,
  ExternalLink,
  Users,
  Building
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  "Bride's House",
  "Groom's House",
  "Wedding Hall",
  "Reception Hall",
  "Temple",
  "Church",
  "Mosque",
  "Hotel",
  "Auditorium",
  "Photographer Studio",
  "Decoration Shop",
  "Catering",
  "Other"
];

export const Places = () => {
  const { places, people, deletePlace } = useWedding();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showModal, setShowModal] = useState(false);
  const [placeToEdit, setPlaceToEdit] = useState(null);

  // Helper to count linked guests per place
  const getGuestCountForPlace = (placeId) => {
    return people.filter(p => p.placeId === placeId).length;
  };

  const filteredPlaces = places.filter(place => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (place.contactPerson && place.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'All Categories' || place.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEdit = (place) => {
    setPlaceToEdit(place);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setPlaceToEdit(null);
    setShowModal(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? Unassigned guests will remain.`)) {
      deletePlace(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <MapPin className="w-7 h-7 text-amber-500" />
            Wedding Places & Venues
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage all ceremony locations, reception halls, bridal houses, photo studios, and vendor hubs.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm shadow-md transition-all transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Place</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by place name, city, or contact person..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="relative w-full sm:w-64">
          <Filter className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Places Cards Grid */}
      {filteredPlaces.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-amber-100 dark:border-slate-800">
          <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-serif-heading text-lg font-semibold text-slate-700 dark:text-slate-300">
            No places found
          </h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your category filter or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map(place => {
            const guestCount = getGuestCountForPlace(place.id);
            return (
              <div
                key={place.id}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs hover:shadow-md transition-all"
              >
                <div>
                  {/* Category badge & guest count badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                      {place.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      <Users className="w-3 h-3 text-amber-500" />
                      {guestCount} Guests
                    </span>
                  </div>

                  {/* Title & Location */}
                  <h3 className="font-serif-heading text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">
                    {place.name}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{place.address ? `${place.address}, ` : ''}{place.city}{place.state ? `, ${place.state}` : ''}</span>
                  </p>

                  {/* Contact Info */}
                  <div className="mt-4 space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                    {place.contactPerson && (
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        <span className="text-slate-400">Contact: </span>{place.contactPerson}
                      </p>
                    )}
                    {place.phone && (
                      <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`tel:${place.phone}`} className="hover:text-amber-600 hover:underline">{place.phone}</a>
                      </p>
                    )}
                    {place.email && (
                      <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`mailto:${place.email}`} className="hover:text-amber-600 hover:underline truncate">{place.email}</a>
                      </p>
                    )}
                  </div>

                  {/* Notes */}
                  {place.notes && (
                    <p className="text-xs italic text-slate-500 dark:text-slate-400 mt-3 bg-amber-50/40 dark:bg-slate-800/40 p-2.5 rounded-xl border border-amber-100/50 dark:border-slate-800">
                      "{place.notes}"
                    </p>
                  )}
                </div>

                {/* Footer Controls & Google Maps Link */}
                <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {place.googleMapsLink ? (
                    <a
                      href={place.googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                    >
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400">No maps link</span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(place)}
                      className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                      title="Edit Place"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(place.id, place.name)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                      title="Delete Place"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Place Modal */}
      <PlaceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        placeToEdit={placeToEdit}
      />
    </div>
  );
};
