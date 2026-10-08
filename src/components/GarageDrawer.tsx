import React, { useEffect, useRef, useState } from 'react';
import { Vehicle, Currency, MarketRegion } from '../types';
import { VEHICLES } from '../data/vehicles';
import { MARKETPLACE_LISTINGS } from '../data/listings';
import { formatPrice } from '../services/currency';
import { AccessibleDialog } from './AccessibleDialog';
import { VehicleImage } from './VehicleImage';
import { X, Bookmark, Star, Trash2, Scale, Edit3, Check, Car, ArrowRight } from 'lucide-react';
import { loadBooleanRecord, loadStringRecord, safeSetItem } from '../services/storage';
import { formatNumber, plural } from '../services/format';

interface GarageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedVehicleIds: string[];
  savedListingIds: string[];
  onRemoveVehicle: (id: string) => void;
  onRemoveListing: (id: string) => void;
  currency: Currency;
  marketRegion?: MarketRegion;
  onOpenDetails: (vehicle: Vehicle) => void;
  onStartComparison: (vehicles: Vehicle[]) => void;
}

export const GarageDrawer: React.FC<GarageDrawerProps> = ({
  isOpen, onClose, savedVehicleIds, savedListingIds, onRemoveVehicle, onRemoveListing,
  currency, marketRegion = 'greece', onOpenDetails, onStartComparison
}) => {
  const isGreek = marketRegion === 'greece';
  const [notes, setNotes] = useState<Record<string, string>>(() => loadStringRecord('carcheck_garage_notes'));
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>(() => loadBooleanRecord('carcheck_garage_favorites'));
  // Last removed item, so a removal can be undone.
  const [lastRemoved, setLastRemoved] = useState<{ kind: 'vehicle' | 'listing'; id: string; name: string } | null>(null);
  const noteInputRef = useRef<HTMLInputElement>(null);
  const noteButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const focusNoteButtonFor = useRef<string | null>(null);

  // Keep focus on a sensible element while the note editor mounts and unmounts.
  useEffect(() => {
    if (editingNoteId) {
      noteInputRef.current?.focus();
    } else if (focusNoteButtonFor.current) {
      noteButtonRefs.current[focusNoteButtonFor.current]?.focus();
      focusNoteButtonFor.current = null;
    }
  }, [editingNoteId]);

  useEffect(() => {
    if (!isOpen) setLastRemoved(null);
  }, [isOpen]);

  const savedVehicles = VEHICLES.filter((v) => savedVehicleIds.includes(v.id));
  const savedListings = MARKETPLACE_LISTINGS.filter((l) => savedListingIds.includes(l.id));

  const handleSaveNote = (id: string) => {
    const updated = { ...notes, [id]: noteDraft.trim() };
    setNotes(updated);
    safeSetItem('carcheck_garage_notes', JSON.stringify(updated));
    focusNoteButtonFor.current = id;
    setEditingNoteId(null);
  };
  const cancelNote = (id: string) => {
    focusNoteButtonFor.current = id;
    setEditingNoteId(null);
  };
  const removeVehicle = (v: Vehicle) => {
    onRemoveVehicle(v.id);
    setLastRemoved({ kind: 'vehicle', id: v.id, name: `${v.make} ${v.model}` });
  };
  const removeListing = (id: string, title: string) => {
    onRemoveListing(id);
    setLastRemoved({ kind: 'listing', id, name: title });
  };
  const undoRemove = () => {
    if (!lastRemoved) return;
    if (lastRemoved.kind === 'vehicle') onRemoveVehicle(lastRemoved.id);
    else onRemoveListing(lastRemoved.id);
    setLastRemoved(null);
  };
  const toggleFavorite = (id: string) => {
    const updated = { ...favorites, [id]: !favorites[id] };
    setFavorites(updated);
    safeSetItem('carcheck_garage_favorites', JSON.stringify(updated));
  };

  return (
    <AccessibleDialog
      open={isOpen}
      onClose={onClose}
      labelledBy="garage-title"
      overlayClassName="justify-end"
      panelClassName="h-full w-full max-w-md bg-[var(--color-surface)] border-l border-[var(--color-border)] shadow-xl flex flex-col"
    >
      <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent-text)] shrink-0">
            <Bookmark className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 id="garage-title" className="text-base font-semibold text-[var(--color-text)]">
              {isGreek ? 'Το Garage μου' : 'Saved Garage'}
            </h2>
            <p className="text-[15px] text-[var(--color-text-muted)]">
              {isGreek
                ? `${plural(savedVehicles.length, marketRegion, { one: 'όχημα', other: 'οχήματα' })} · ${plural(savedListings.length, marketRegion, { one: 'αγγελία', other: 'αγγελίες' })}`
                : `${plural(savedVehicles.length, marketRegion, { one: 'vehicle', other: 'vehicles' })} · ${plural(savedListings.length, marketRegion, { one: 'listing', other: 'listings' })}`}
            </p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="touch-target rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text)] flex items-center justify-center" aria-label={isGreek ? 'Κλείσιμο Garage' : 'Close garage'}>
          <X className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      <div className="p-5 overflow-y-auto overscroll-contain space-y-7 flex-1">
        <div role="status" aria-live="polite">
          {lastRemoved && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-4 py-2 text-[15px] text-[var(--color-text)]">
              <span>{isGreek ? `Αφαιρέθηκε: ${lastRemoved.name}` : `Removed ${lastRemoved.name}`}</span>
              <button type="button" onClick={undoRemove} className="min-h-11 px-2 font-semibold text-[var(--color-accent-text)] underline underline-offset-4">
                {isGreek ? 'Αναίρεση' : 'Undo'}
              </button>
            </div>
          )}
        </div>
        {savedVehicles.length === 0 && savedListings.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Car className="w-11 h-11 text-[var(--color-text-muted)] mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-base font-bold text-[var(--color-text)]">{isGreek ? 'Το Garage είναι άδειο' : 'Your Garage is empty'}</h3>
            <p className="text-[15px] text-[var(--color-text-muted)] mt-2 leading-relaxed">
              {isGreek ? 'Αποθήκευσε προτάσεις ή ενδεικτικές αγγελίες για να δημιουργήσεις τη δική σου shortlist.' : 'Save recommendations or reference listings to build your personal shortlist.'}
            </p>
          </div>
        ) : (
          <>
            {savedVehicles.length > 0 && (
              <section aria-labelledby="garage-vehicles-title" className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 id="garage-vehicles-title" className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                    {isGreek ? `Αποθηκευμένα οχήματα (${savedVehicles.length})` : `Saved vehicles (${savedVehicles.length})`}
                  </h3>
                  {savedVehicles.length >= 2 && (
                    <button type="button" onClick={() => { onStartComparison(savedVehicles.slice(0, 3)); onClose(); }} className="min-h-11 px-2 text-[15px] font-semibold text-[var(--color-accent-text)] flex items-center gap-2 hover:underline">
                      <Scale className="w-4 h-4" aria-hidden="true" />
                      {savedVehicles.length > 3
                        ? (isGreek ? 'Σύγκριση των 3 πρώτων' : 'Compare first 3')
                        : (isGreek ? 'Σύγκριση' : 'Compare')}
                    </button>
                  )}
                </div>
                {savedVehicles.map((v) => {
                  const note = notes[v.id] || '';
                  const isEditing = editingNoteId === v.id;
                  const isFav = !!favorites[v.id];
                  return (
                    <article key={v.id} className="surface-card p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-16 h-12 rounded-xl overflow-hidden bg-[var(--color-surface-subtle)] shrink-0"><VehicleImage vehicle={v} decorative marketRegion={marketRegion} allowAttributionRequired={false} /></div>
                          <div className="min-w-0">
                            <h4 className="text-[15px] font-bold text-[var(--color-text)] truncate">{v.make} {v.model}</h4>
                            <p className="text-[13px] text-[var(--color-text-muted)]">{isGreek ? 'Καλή αγορά έως' : 'Good buy up to'} {formatPrice(v.goodBuyPrice, currency)}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button type="button" onClick={() => toggleFavorite(v.id)} aria-pressed={isFav} aria-label={isGreek ? `Αγαπημένο: ${v.make} ${v.model}` : `Favorite: ${v.make} ${v.model}`} className={`touch-target rounded-xl flex items-center justify-center ${isFav ? 'text-[var(--color-warning)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}`}><Star className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} aria-hidden="true" /></button>
                          <button type="button" onClick={() => removeVehicle(v)} aria-label={isGreek ? `Αφαίρεση ${v.make} ${v.model} από το Garage` : `Remove ${v.make} ${v.model} from garage`} className="touch-target rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-danger)] flex items-center justify-center"><Trash2 className="w-4 h-4" aria-hidden="true" /></button>
                        </div>
                      </div>

                      {isEditing ? (
                        <form className="flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); handleSaveNote(v.id); }}>
                          <div className="flex-1">
                            <label htmlFor={`garage-note-${v.id}`} className="text-[13px] font-semibold text-[var(--color-text-muted)]">{isGreek ? `Προσωπική σημείωση για ${v.make} ${v.model}` : `Personal note for ${v.make} ${v.model}`}</label>
                            <input
                              ref={noteInputRef}
                              id={`garage-note-${v.id}`}
                              name="note"
                              autoComplete="off"
                              value={noteDraft}
                              onChange={(e) => setNoteDraft(e.target.value)}
                              onKeyDown={(e) => {
                                // Escape cancels the edit instead of closing the whole drawer.
                                if (e.key === 'Escape') {
                                  e.preventDefault();
                                  cancelNote(v.id);
                                }
                              }}
                              placeholder={isGreek ? 'π.χ. έλεγχος, test drive…' : 'e.g. inspection, test drive…'}
                              className="mt-1 min-h-11 w-full px-3 rounded-xl border border-[var(--color-border-control)] bg-[var(--color-canvas)] text-[15px] text-[var(--color-text)]"
                            />
                          </div>
                          <button type="submit" aria-label={isGreek ? 'Αποθήκευση σημείωσης' : 'Save note'} className="touch-target px-3 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center"><Check className="w-4 h-4" aria-hidden="true" /></button>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between gap-3 text-[15px] text-[var(--color-text-muted)]">
                          <span className="italic min-w-0 break-words">{note ? `“${note}”` : (isGreek ? 'Δεν έχει προστεθεί σημείωση' : 'No note added')}</span>
                          <button type="button" ref={(el) => { noteButtonRefs.current[v.id] = el; }} onClick={() => { setEditingNoteId(v.id); setNoteDraft(note); }} className="min-h-11 px-2 text-[var(--color-accent-text)] font-semibold flex items-center gap-1.5 shrink-0"><Edit3 className="w-4 h-4" aria-hidden="true" />{note ? (isGreek ? 'Επεξεργασία' : 'Edit') : (isGreek ? 'Σημείωση' : 'Add note')}</button>
                        </div>
                      )}

                      <button type="button" onClick={() => { onOpenDetails(v); onClose(); }} className="min-h-11 w-full border-t border-[var(--color-border)] pt-3 text-[15px] font-semibold text-[var(--color-text)] hover:text-[var(--color-accent-text)] flex items-center justify-between">
                        {isGreek ? 'Στοιχεία & checklist ελέγχου' : 'Specs & inspection checklist'}<ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </article>
                  );
                })}
              </section>
            )}

            {savedListings.length > 0 && (
              <section aria-labelledby="garage-listings-title" className="space-y-3">
                <h3 id="garage-listings-title" className="text-[13px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">{isGreek ? `Αποθηκευμένες αγγελίες (${savedListings.length})` : `Saved listings (${savedListings.length})`}</h3>
                {savedListings.map((l) => (
                  <article key={l.id} className="surface-card p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="text-[15px] font-bold text-[var(--color-text)]">{l.title}</h4>
                      <p className="text-[13px] text-[var(--color-text-muted)] mt-1">{formatNumber(l.mileageKm, marketRegion)} km · {l.location}</p>
                      <p className="text-base font-semibold text-[var(--color-text)] mt-1">{formatPrice(l.price, currency)}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">{isGreek ? 'Αποθηκευμένο δείγμα αγγελίας — επιβεβαίωσε διαθεσιμότητα στην πηγή.' : 'Saved listing snapshot — verify availability at the source.'}</p>
                    </div>
                    <button type="button" onClick={() => removeListing(l.id, l.title)} aria-label={isGreek ? `Αφαίρεση αγγελίας ${l.title}` : `Remove listing ${l.title}`} className="touch-target rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-danger)] flex items-center justify-center shrink-0"><Trash2 className="w-4 h-4" aria-hidden="true" /></button>
                  </article>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </AccessibleDialog>
  );
};
