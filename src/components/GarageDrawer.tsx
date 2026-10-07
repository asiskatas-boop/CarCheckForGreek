import React, { useState } from 'react';
import { Vehicle, Currency, MarketplaceListing } from '../types';
import { VEHICLES } from '../data/vehicles';
import { MARKETPLACE_LISTINGS } from '../data/listings';
import { formatPrice, formatPriceRange } from '../services/currency';
import {
  X,
  Bookmark,
  Star,
  Trash2,
  Scale,
  Edit3,
  Check,
  ChevronRight,
  Car
} from 'lucide-react';

interface GarageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedVehicleIds: string[];
  savedListingIds: string[];
  onRemoveVehicle: (id: string) => void;
  onRemoveListing: (id: string) => void;
  currency: Currency;
  onOpenDetails: (vehicle: Vehicle) => void;
  onStartComparison: (vehicles: Vehicle[]) => void;
}

export const GarageDrawer: React.FC<GarageDrawerProps> = ({
  isOpen,
  onClose,
  savedVehicleIds,
  savedListingIds,
  onRemoveVehicle,
  onRemoveListing,
  currency,
  onOpenDetails,
  onStartComparison
}) => {
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('carcheck_garage_notes');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');

  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('carcheck_garage_favorites');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const handleSaveNote = (id: string) => {
    const updated = { ...notes, [id]: noteDraft };
    setNotes(updated);
    localStorage.setItem('carcheck_garage_notes', JSON.stringify(updated));
    setEditingNoteId(null);
  };

  const toggleFavorite = (id: string) => {
    const updated = { ...favorites, [id]: !favorites[id] };
    setFavorites(updated);
    localStorage.setItem('carcheck_garage_favorites', JSON.stringify(updated));
  };

  if (!isOpen) return null;

  const savedVehicles = VEHICLES.filter((v) => savedVehicleIds.includes(v.id));
  const savedListings = MARKETPLACE_LISTINGS.filter((l) => savedListingIds.includes(l.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Saved Garage
                </h3>
                <p className="text-xs text-slate-500">
                  {savedVehicles.length} car{savedVehicles.length === 1 ? '' : 's'} · {savedListings.length} listing{savedListings.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-6 flex-1">
            {savedVehicles.length === 0 && savedListings.length === 0 ? (
              <div className="text-center py-16 px-4">
                <Car className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Your Garage is empty
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Save vehicle recommendations or individual marketplace listings to build your personal shortlist.
                </p>
              </div>
            ) : (
              <>
                {/* Saved Vehicles Section */}
                {savedVehicles.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Saved Vehicles ({savedVehicles.length})
                      </span>
                      {savedVehicles.length >= 2 && (
                        <button
                          onClick={() => {
                            onStartComparison(savedVehicles.slice(0, 3));
                            onClose();
                          }}
                          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span>Compare All</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {savedVehicles.map((v) => {
                        const isFav = !!favorites[v.id];
                        const note = notes[v.id] || '';
                        const isEditing = editingNoteId === v.id;

                        return (
                          <div
                            key={v.id}
                            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2.5"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-3">
                                <div className="w-14 h-11 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                                  <img
                                    src={v.imageUrl}
                                    alt={v.model}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                    {v.make} {v.model}
                                  </div>
                                  <div className="text-[11px] text-slate-500">
                                    Under {formatPrice(v.goodBuyPrice, currency)}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => toggleFavorite(v.id)}
                                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                                    isFav ? 'text-amber-400' : 'text-slate-400 hover:text-slate-600'
                                  }`}
                                  title="Mark as favorite"
                                >
                                  <Star className="w-4 h-4 fill-current" />
                                </button>
                                <button
                                  onClick={() => onRemoveVehicle(v.id)}
                                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 cursor-pointer"
                                  title="Remove from garage"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Personal Note */}
                            <div className="text-xs">
                              {isEditing ? (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    value={noteDraft}
                                    onChange={(e) => setNoteDraft(e.target.value)}
                                    placeholder="Add inspection or test drive note..."
                                    className="flex-1 px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                                  />
                                  <button
                                    onClick={() => handleSaveNote(v.id)}
                                    className="p-1 bg-emerald-600 text-white rounded-lg cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between text-slate-500">
                                  <span className="italic truncate max-w-[240px]">
                                    {note ? `“${note}”` : 'No notes added'}
                                  </span>
                                  <button
                                    onClick={() => {
                                      setEditingNoteId(v.id);
                                      setNoteDraft(note);
                                    }}
                                    className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>{note ? 'Edit' : '+ Note'}</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => {
                                onOpenDetails(v);
                                onClose();
                              }}
                              className="w-full py-1.5 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors border-t border-slate-200/60 dark:border-slate-700/60 pt-2 block"
                            >
                              View Specs & Checklist →
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Saved Marketplace Listings */}
                {savedListings.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Saved Listings ({savedListings.length})
                    </span>

                    <div className="space-y-3">
                      {savedListings.map((l) => (
                        <div
                          key={l.id}
                          className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                {l.title}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {l.mileageKm.toLocaleString()} km · {l.location}
                              </div>
                              <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                                {formatPrice(l.price, currency)}
                              </div>
                            </div>

                            <button
                              onClick={() => onRemoveListing(l.id)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-rose-500 cursor-pointer"
                              title="Remove listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
