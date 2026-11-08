import React, { useState, FormEvent } from 'react';
import { Mail, MapPin, MessageCircle, Clock, Send } from 'lucide-react';
import { BUSINESS_INFO, CATEGORIES } from '../data';
import { PageBanner } from './ArticlesSection';

const inputClass =
  'w-full border border-line bg-white px-3.5 py-3 text-sm outline-none placeholder:text-muted focus:border-ink';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', topic: 'Konsultasi Hama Umum', message: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = `Halo Tani Makmur Bersama,\n\nNama: *${form.name}*\nNo. HP: *${form.phone}*\nTopik: *${form.topic}*\n\nPesan:\n${form.message || 'Saya ingin bertanya lebih lanjut.'}`;
    window.open(`${BUSINESS_INFO.whatsappUrl}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const contacts = [
    { icon: MessageCircle, label: 'WhatsApp', value: BUSINESS_INFO.phone, href: BUSINESS_INFO.whatsappUrl },
    { icon: Mail, label: 'Email', value: BUSINESS_INFO.email, href: `mailto:${BUSINESS_INFO.email}` },
    { icon: MapPin, label: 'Alamat', value: BUSINESS_INFO.fullAddress },
    { icon: Clock, label: 'Jam operasional', value: BUSINESS_INFO.hours },
  ];

  return (
    <div>
      <PageBanner
        crumb="Kontak"
        eyebrow="Hubungi kami"
        title="Ada yang bisa kami bantu?"
        text="Konsultasi hama, pertanyaan produk, atau permintaan penawaran grosir. Pesan Anda langsung terkirim ke WhatsApp kami."
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:px-8 lg:py-16">
        <div className="space-y-6">
          {contacts.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex gap-4 border-b border-line pb-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-soft">
                <Icon className="h-5 w-5 text-brand" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted">{label}</p>
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer" className="mt-1 block break-words text-sm font-semibold hover:text-brand">{value}</a>
                ) : (
                  <p className="mt-1 text-sm font-semibold leading-relaxed">{value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-soft p-6 sm:p-8">
          <h2 className="font-heading text-xl font-black uppercase">Kirim Pesan</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className={inputClass} placeholder="Nama lengkap *" value={form.name} onChange={set('name')} required />
            <input className={inputClass} type="tel" placeholder="No. HP / WhatsApp *" value={form.phone} onChange={set('phone')} required />
          </div>
          <select className={inputClass} value={form.topic} onChange={set('topic')}>
            <option>Konsultasi Hama Umum</option>
            {CATEGORIES.map((c) => <option key={c.name}>{`Produk ${c.label}`}</option>)}
            <option>Penawaran Grosir</option>
          </select>
          <textarea
            className={`${inputClass} resize-none`}
            rows={5}
            placeholder="Ceritakan jenis hama, lokasi, atau kebutuhan Anda…"
            value={form.message}
            onChange={set('message')}
          />
          <button type="submit" className="flex w-full items-center justify-center gap-2 bg-brand py-4 text-xs font-bold uppercase tracking-widest text-white hover:bg-brand-dark">
            <Send className="h-4 w-4" /> Kirim via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}
