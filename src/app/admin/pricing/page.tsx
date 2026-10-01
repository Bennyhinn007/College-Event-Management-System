'use client';

import { useState, useEffect } from 'react';
import { DollarSign, CheckCircle2, AlertCircle, Save, Loader2, Info, Users, User } from 'lucide-react';
import { OFFICIAL_EVENTS, EventDefinition } from '@/lib/constants';

interface EventPricingItem {
  price: number | null;
  status: 'ACTIVE' | 'TBD';
}

export default function AdminPricingPage() {
  const [pricing, setPricing] = useState<Record<string, EventPricingItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const json = await res.json();
        const serverPricing = json.success && json.data.pricing ? json.data.pricing : {};

        // Normalize pricing record for all 10 official events
        const normalized: Record<string, EventPricingItem> = {};
        for (const ev of OFFICIAL_EVENTS) {
          const val = serverPricing[ev.id];
          if (val && typeof val === 'object' && 'price' in val) {
            normalized[ev.id] = {
              price: typeof val.price === 'number' ? val.price : null,
              status: val.status === 'TBD' ? 'TBD' : 'ACTIVE',
            };
          } else if (typeof val === 'number') {
            normalized[ev.id] = {
              price: val,
              status: 'ACTIVE',
            };
          } else {
            normalized[ev.id] = {
              price: ev.fee,
              status: 'ACTIVE',
            };
          }
        }

        setPricing(normalized);
      } catch (err) {
        console.error('Error loading pricing settings:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handlePriceChange = (eventId: string, value: string) => {
    if (!pricing) return;
    const num = value === '' ? null : parseInt(value, 10);
    setPricing({
      ...pricing,
      [eventId]: {
        ...pricing[eventId],
        price: isNaN(num as number) ? null : num,
        status: num !== null && !isNaN(num) ? 'ACTIVE' : 'TBD',
      },
    });
  };

  const handleStatusToggle = (eventId: string) => {
    if (!pricing) return;
    const current = pricing[eventId];
    const newStatus = current.status === 'ACTIVE' ? 'TBD' : 'ACTIVE';
    setPricing({
      ...pricing,
      [eventId]: {
        ...current,
        status: newStatus,
      },
    });
  };

  const handleSave = async () => {
    if (!pricing) return;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'pricing', value: pricing }),
      });
      const json = await res.json();
      if (json.success) {
        setMsg({ type: 'success', text: 'Event pricing configuration updated successfully.' });
      } else {
        setMsg({ type: 'error', text: json.error || 'Failed to update pricing.' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Save error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !pricing) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-6 h-6 text-teal-600 animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Event Pricing Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure registration fees for all 10 official Hacktober 2026 events.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {msg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600" />
          )}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Info notice about pricing */}
      <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="block">Per-Event Fee Structure:</strong>
          <p>
            Fees are configured per event. Individual events are charged per person (1 participant), while team events are charged once per team (up to 4 members). Adjusting prices here applies instantly across all registration portals.
          </p>
        </div>
      </div>

      {/* Pricing Cards List */}
      <div className="space-y-3">
        {OFFICIAL_EVENTS.map((event, index) => {
          const item = pricing[event.id] || { price: event.fee, status: 'ACTIVE' };
          const isTbd = item.status === 'TBD' || item.price === null;
          const isTeam = event.type === 'TEAM';

          return (
            <div
              key={event.id}
              className={`p-5 rounded-2xl bg-white border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs ${
                isTbd ? 'border-dashed border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    #{index + 1}
                  </span>
                  <span className="font-bold text-sm text-slate-900">
                    {event.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {event.eventType}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                      isTeam
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {isTeam ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {isTeam ? 'Team (Max 4)' : 'Individual'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStatusToggle(event.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                      isTbd
                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                    title="Click to toggle status"
                  >
                    {isTbd ? 'STATUS: TBD' : 'STATUS: ACTIVE'}
                  </button>
                </div>
                <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                  {event.duration && <span>Duration: {event.duration}</span>}
                  {event.format && <span>Format: {event.format}</span>}
                  <span>Fee Unit: {isTeam ? '₹ / team' : '₹ / person'}</span>
                </div>
              </div>

              {/* Price input */}
              <div className="flex items-center gap-2 sm:w-44 shrink-0">
                <span className="text-sm font-bold text-slate-700">₹</span>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 99"
                  value={item.price ?? ''}
                  onChange={(e) => handlePriceChange(event.id, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono font-bold focus:ring-2 focus:ring-slate-900"
                />
                <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
                  {isTeam ? '/team' : '/person'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
