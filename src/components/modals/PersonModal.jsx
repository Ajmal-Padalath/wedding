import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useWedding } from '../../context/WeddingContext';
import { User, Phone, Mail, MapPin, Heart, CheckCircle } from 'lucide-react';

const RELATIONSHIPS = ['Bride Side', 'Groom Side', 'Relative', 'Friend', 'Vendor', 'Staff'];
const GENDERS = ['Male', 'Female', 'Other'];
const RSVP_OPTIONS = ['Pending', 'Attending', 'Declined'];

export const PersonModal = ({ isOpen, onClose, personToEdit = null }) => {
  const { places, addPerson, updatePerson } = useWedding();

  const [formData, setFormData] = useState({
    fullName: '',
    nickname: '',
    mobileNumber: '',
    email: '',
    gender: 'Male',
    relationship: 'Bride Side',
    placeId: '',
    address: '',
    notes: '',
    rsvpStatus: 'Pending',
    invitationSent: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (personToEdit) {
      setFormData({
        fullName: personToEdit.fullName || '',
        nickname: personToEdit.nickname || '',
        mobileNumber: personToEdit.mobileNumber || '',
        email: personToEdit.email || '',
        gender: personToEdit.gender || 'Male',
        relationship: personToEdit.relationship || 'Bride Side',
        placeId: personToEdit.placeId || '',
        address: personToEdit.address || '',
        notes: personToEdit.notes || '',
        rsvpStatus: personToEdit.rsvpStatus || 'Pending',
        invitationSent: personToEdit.invitationSent || false
      });
    } else {
      setFormData({
        fullName: '',
        nickname: '',
        mobileNumber: '',
        email: '',
        gender: 'Male',
        relationship: 'Bride Side',
        placeId: places.length > 0 ? places[0].id : '',
        address: '',
        notes: '',
        rsvpStatus: 'Pending',
        invitationSent: false
      });
    }
    setErrors({});
  }, [personToEdit, isOpen, places]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
    if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'Mobile Number is required.';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let res;
    if (personToEdit) {
      res = updatePerson(personToEdit.id, formData);
    } else {
      res = addPerson(formData);
    }

    if (res && res.success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={personToEdit ? 'Edit Guest / Contact' : 'Add New Guest'}
      icon={User}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Jonathan Elegant"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none ${errors.fullName ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'}`}
              />
            </div>
            {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Nickname / Alias (Optional)
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="e.g. Dad, Uncle Art"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {GENDERS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                placeholder="+1 914-555-0101"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none ${errors.mobileNumber ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'}`}
              />
            </div>
            {errors.mobileNumber && <p className="text-xs text-rose-500 mt-1">{errors.mobileNumber}</p>}
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
                placeholder="guest@example.com"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none ${errors.email ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'}`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
          </div>

          {/* Relationship */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Relationship *
            </label>
            <div className="relative">
              <Heart className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select
                name="relationship"
                value={formData.relationship}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                {RELATIONSHIPS.map(rel => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Associated Place */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Associated Place / Venue
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select
                name="placeId"
                value={formData.placeId}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="">-- None / Unassigned --</option>
                {places.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Residential Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 88 Heritage Drive, Scarsdale, NY"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* RSVP Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              RSVP Status
            </label>
            <select
              name="rsvpStatus"
              value={formData.rsvpStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              {RSVP_OPTIONS.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Invitation Sent Checkbox */}
          <div className="flex items-center pt-6">
            <label className="relative flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                name="invitationSent"
                checked={formData.invitationSent}
                onChange={handleChange}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300 dark:border-slate-700"
              />
              <span>Invitation Sent (Physical/Digital)</span>
            </label>
          </div>

          {/* Notes */}
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Special Notes / Dietary Preferences
            </label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Vegetarian diet, toast speech speaker..."
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
            {personToEdit ? 'Save Changes' : 'Add Guest'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
