import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useWedding } from '../../context/WeddingContext';
import { MapPin, Building, User, Phone, Mail, Link as LinkIcon, FileText } from 'lucide-react';

const CATEGORIES = [
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

export const PlaceModal = ({ isOpen, onClose, placeToEdit = null }) => {
  const { addPlace, updatePlace } = useWedding();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Wedding Hall',
    address: '',
    city: '',
    state: '',
    country: 'USA',
    contactPerson: '',
    phone: '',
    email: '',
    googleMapsLink: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (placeToEdit) {
      setFormData({
        name: placeToEdit.name || '',
        category: placeToEdit.category || 'Wedding Hall',
        address: placeToEdit.address || '',
        city: placeToEdit.city || '',
        state: placeToEdit.state || '',
        country: placeToEdit.country || 'USA',
        contactPerson: placeToEdit.contactPerson || '',
        phone: placeToEdit.phone || '',
        email: placeToEdit.email || '',
        googleMapsLink: placeToEdit.googleMapsLink || '',
        notes: placeToEdit.notes || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Wedding Hall',
        address: '',
        city: '',
        state: '',
        country: 'USA',
        contactPerson: '',
        phone: '',
        email: '',
        googleMapsLink: '',
        notes: ''
      });
    }
    setErrors({});
  }, [placeToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Place name is required.';
    if (!formData.category) newErrors.category = 'Category is required.';
    if (!formData.city.trim()) newErrors.city = 'City is required.';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (placeToEdit) {
      updatePlace(placeToEdit.id, formData);
    } else {
      addPlace(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={placeToEdit ? 'Edit Wedding Place' : 'Add New Place'}
      icon={MapPin}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Place Name */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Place / Venue Name *
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Grand Rosewood Ballroom"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none ${errors.name ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'}`}
              />
            </div>
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. New York"
              className={`w-full px-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none ${errors.city ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'}`}
            />
            {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city}</p>}
          </div>

          {/* Address */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Street Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 450 Park Avenue, Midtown"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* State & Country */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              State / Province
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g. NY"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. USA"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Contact Person
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="Manager / Contact"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 212-555-0199"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@venue.com"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none ${errors.email ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'}`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
          </div>

          {/* Google Maps Link */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Google Maps URL
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="url"
                name="googleMapsLink"
                value={formData.googleMapsLink}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Notes & Guidelines
            </label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional details, parking guidelines, booking notes..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Form Controls */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-xl shadow-md transition-all transform active:scale-95"
          >
            {placeToEdit ? 'Save Changes' : 'Add Place'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
