import React, { useState } from 'react';
import { useWedding } from '../context/WeddingContext';
import { PersonModal } from '../components/modals/PersonModal';
import { downloadCSV } from '../utils/formatters';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MapPin,
  Edit,
  Trash2,
  Phone,
  Mail,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Send
} from 'lucide-react';

const RELATIONSHIPS = ['All Relationships', 'Bride Side', 'Groom Side', 'Relative', 'Friend', 'Vendor', 'Staff'];
const RSVP_FILTER = ['All RSVP', 'Attending', 'Pending', 'Declined'];

export const People = () => {
  const { people, places, deletePerson, toggleRSVP, toggleInvitation } = useWedding();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRelationship, setSelectedRelationship] = useState('All Relationships');
  const [selectedPlaceId, setSelectedPlaceId] = useState('All Places');
  const [selectedRSVP, setSelectedRSVP] = useState('All RSVP');
  const [showModal, setShowModal] = useState(false);
  const [personToEdit, setPersonToEdit] = useState(null);

  const filteredPeople = people.filter(person => {
    const matchesSearch =
      person.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (person.nickname && person.nickname.toLowerCase().includes(searchQuery.toLowerCase())) ||
      person.mobileNumber.includes(searchQuery) ||
      (person.email && person.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRel =
      selectedRelationship === 'All Relationships' || person.relationship === selectedRelationship;

    const matchesPlace =
      selectedPlaceId === 'All Places' || person.placeId === selectedPlaceId;

    const matchesRSVP =
      selectedRSVP === 'All RSVP' || person.rsvpStatus === selectedRSVP;

    return matchesSearch && matchesRel && matchesPlace && matchesRSVP;
  });

  const handleEdit = (person) => {
    setPersonToEdit(person);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setPersonToEdit(null);
    setShowModal(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the guest list?`)) {
      deletePerson(id);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Full Name', 'Nickname', 'Mobile Number', 'Email', 'Gender', 'Relationship', 'Associated Place', 'RSVP Status', 'Invitation Sent', 'Address', 'Notes'];
    const rows = filteredPeople.map(p => {
      const placeObj = places.find(pl => pl.id === p.placeId);
      return [
        p.fullName,
        p.nickname || '',
        p.mobileNumber,
        p.email || '',
        p.gender,
        p.relationship,
        placeObj ? placeObj.name : 'Unassigned',
        p.rsvpStatus,
        p.invitationSent ? 'Yes' : 'No',
        p.address || '',
        p.notes || ''
      ];
    });
    downloadCSV('Wedding_Guest_List', headers, rows);
  };

  const getPlaceName = (placeId) => {
    const p = places.find(item => item.id === placeId);
    return p ? p.name : 'Unassigned';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Users className="w-7 h-7 text-rose-500" />
            Guest & Contact Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track RSVP responses, invitation cards, associated venues, and guest contact details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleAddNew}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold text-sm shadow-md transition-all transform active:scale-95 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/50 dark:border-slate-800 shadow-xs">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, nickname, phone..."
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Relationship Filter */}
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <select
            value={selectedRelationship}
            onChange={(e) => setSelectedRelationship(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {RELATIONSHIPS.map(rel => (
              <option key={rel} value={rel}>{rel}</option>
            ))}
          </select>
        </div>

        {/* Place Filter */}
        <div className="relative">
          <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <select
            value={selectedPlaceId}
            onChange={(e) => setSelectedPlaceId(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All Places">All Places / Venues</option>
            {places.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* RSVP Filter */}
        <div className="relative">
          <select
            value={selectedRSVP}
            onChange={(e) => setSelectedRSVP(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {RSVP_FILTER.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Guest Table / List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200/50 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredPeople.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-serif-heading text-lg font-semibold text-slate-700 dark:text-slate-300">
              No guests found
            </h3>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-50/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-amber-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">Guest Name & Relationship</th>
                  <th className="px-4 py-4">Mobile & Email</th>
                  <th className="px-4 py-4">Associated Place</th>
                  <th className="px-4 py-4">RSVP Status</th>
                  <th className="px-4 py-4">Invitation</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredPeople.map(person => (
                  <tr key={person.id} className="hover:bg-amber-50/30 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Name & Rel */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {person.fullName.substring(0, 2)}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                            {person.fullName}
                            {person.nickname && (
                              <span className="text-slate-400 text-xs font-normal ml-1.5">({person.nickname})</span>
                            )}
                          </div>
                          <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100/70 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300">
                            {person.relationship}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="px-4 py-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`tel:${person.mobileNumber}`} className="hover:text-amber-600 font-medium">{person.mobileNumber}</a>
                      </div>
                      {person.email && (
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <a href={`mailto:${person.email}`} className="hover:text-amber-600">{person.email}</a>
                        </div>
                      )}
                    </td>

                    {/* Associated Place */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-medium">{getPlaceName(person.placeId)}</span>
                      </div>
                    </td>

                    {/* RSVP Toggle Badge */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleRSVP(person.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] transition-transform active:scale-95 ${
                          person.rsvpStatus === 'Attending'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : person.rsvpStatus === 'Declined'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                        title="Click to toggle RSVP status"
                      >
                        {person.rsvpStatus === 'Attending' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {person.rsvpStatus === 'Declined' && <XCircle className="w-3.5 h-3.5" />}
                        {person.rsvpStatus === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                        <span>{person.rsvpStatus}</span>
                      </button>
                    </td>

                    {/* Invitation Sent Toggle Badge */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleInvitation(person.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[11px] transition-transform active:scale-95 ${
                          person.invitationSent
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                        title="Click to toggle invitation sent"
                      >
                        <Send className="w-3 h-3" />
                        <span>{person.invitationSent ? 'Sent' : 'Not Sent'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEdit(person)}
                          className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                          title="Edit Guest"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(person.id, person.fullName)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                          title="Delete Guest"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Guest Modal */}
      <PersonModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        personToEdit={personToEdit}
      />
    </div>
  );
};
