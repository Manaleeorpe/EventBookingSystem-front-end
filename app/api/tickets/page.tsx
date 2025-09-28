'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useUser } from '@/app/UserContext';

import type {
 Ticket
} from '@/lib/types';



function formatDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
  return { date, time };
}

function TicketCard({ t }: { t: Ticket }) {
  const { date, time } = formatDateTime(t.event.eventDateAndTime);
  return (
    <article
      style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 10px 24px rgba(16,24,40,0.08)',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'relative', minHeight: 220, background: '#eee' }}>
        <Image
          src={t.event.imageUrl}
          alt={t.event.eventName}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div
        style={{
          padding: 24,
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          columnGap: 16,
          rowGap: 8,
          alignItems: 'start',
        }}
      >
        <div style={{ gridColumn: '1 / 2' }}>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: '#6b7280',
              letterSpacing: 0.3,
              textTransform: 'uppercase',
            }}
          >
            Event
          </p>
          <h2 style={{ margin: '4px 0 8px', fontSize: 20, lineHeight: 1.2 }}>
            {t.event.eventName}
          </h2>

          <div style={{ display: 'grid', gap: 6, fontSize: 14, color: '#374151' }}>
            <div>
              <strong>Location:</strong> {t.event.eventLocation}
            </div>
            <div>
              <strong>Date:</strong> {date}
            </div>
            <div>
              <strong>Time:</strong> {time}
            </div>
            <div>
              <strong>Attendee:</strong> {t.user.name} ({t.user.email})
            </div>
            <div>
              <strong>Ticket ID:</strong> #{t.id}
            </div>
            <div>
              <strong>Price Paid:</strong> ${t.price.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={{ gridColumn: '2 / 3', justifySelf: 'end', textAlign: 'center' }}>
          <img
            src={t.qr}
            alt="Ticket QR Code"
            style={{
              width: 140,
              height: 140,
              objectFit: 'contain',
              borderRadius: 12,
              border: '1px solid #e5e7eb',
              background: '#fff',
            }}
          />
        </div>
      </div>
    </article>
  );
}

export default function Page() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);


const { user } = useUser();


 const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  
const fetchTickets = useCallback(async () => {
    // wait until user is available
    if (!user) {
      setLoading(false); // or keep true until user loads, your choice
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/ticket/user/${user.id}`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Ticket[] = await res.json();
        setTickets(data);
        setError(null);
      } catch (e: any) {
        setError(e?.message || 'Failed to load tickets');
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);
  
  return (
    <main
      style={{
        minHeight: '100dvh',
        background: '#f6f7fb',
        display: 'flex',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ width: 'min(1100px, 100%)', display: 'grid', gap: 24 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#111827' }}>
          Purchased Tickets
        </h1>
        {tickets.map((t) => (
          <TicketCard key={t.id} t={t} />
        ))}
      </div>
    </main>
  );
}