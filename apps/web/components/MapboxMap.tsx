'use client';

import { useEffect, useRef, useState } from 'react';

/* ─── Indian property locations ─── */
const LOCATIONS = [
  { id: 'pune',     label: 'Pune Hub',         description: 'AI-ready creator homes · Koregaon Park & Baner',  city: 'Pune',      top: '52%', left: '38%', price: '₹8,200/night' },
  { id: 'goa',      label: 'Goa Retreats',      description: 'Beachfront villas & sea-view apartments',          city: 'Goa',       top: '64%', left: '28%', price: '₹11,000/night' },
  { id: 'mumbai',   label: 'Mumbai Stays',      description: 'Sea-view pads in Bandra, Juhu & Worli',            city: 'Mumbai',    top: '55%', left: '22%', price: '₹13,500/night' },
  { id: 'bangalore',label: 'Bangalore Lofts',   description: 'Tech-friendly flats in Indiranagar & Koramangala', city: 'Bangalore', top: '70%', left: '36%', price: '₹7,200/night' },
  { id: 'delhi',    label: 'Delhi Estates',     description: 'Luxury bungalows in Lutyens & Greater Kailash',    city: 'Delhi',     top: '25%', left: '40%', price: '₹22,000/night' },
  { id: 'udaipur',  label: 'Udaipur Palaces',   description: 'Lake-view heritage havelis',                       city: 'Udaipur',   top: '40%', left: '30%', price: '₹18,500/night' },
  { id: 'shimla',   label: 'Shimla Chalets',    description: 'Snow-view cottages in the Himalayas',              city: 'Shimla',    top: '18%', left: '42%', price: '₹9,800/night' },
];

const PHOTOS: Record<string, string> = {
  pune:      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=700&q=80',
  goa:       'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=700&q=80',
  mumbai:    'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=700&q=80',
  bangalore: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=700&q=80',
  delhi:     'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=700&q=80',
  udaipur:   'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=700&q=80',
  shimla:    'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=700&q=80',
};

/* ─── India SVG outline path (simplified) ─── */
const INDIA_PATH =
  'M 390 60 L 420 55 L 450 70 L 480 68 L 500 90 L 510 120 L 490 150 L 510 170 L 520 200 L 505 230 L 480 250 L 490 280 L 470 310 L 450 340 L 430 370 L 400 400 L 380 420 L 360 410 L 350 380 L 330 360 L 300 350 L 280 370 L 260 355 L 250 330 L 260 300 L 245 275 L 260 250 L 250 220 L 265 200 L 280 170 L 270 140 L 285 120 L 310 100 L 340 80 L 370 65 Z';

function DemoMap() {
  const [activeId, setActiveId] = useState('pune');
  const [hovered, setHovered]   = useState<string | null>(null);
  const active = LOCATIONS.find(l => l.id === activeId) ?? LOCATIONS[0];

  return (
    <div className="relative overflow-hidden rounded-[28px] animate-fade-in"
      style={{ height: 480, background: 'linear-gradient(160deg, #d4e4f7 0%, #e8f3fa 40%, #d8e9d4 100%)', border: '1px solid rgba(143,174,200,0.25)' }}>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'linear-gradient(rgba(26,39,66,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(26,39,66,0.08) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* India SVG map */}
      <svg viewBox="200 40 380 420" className="absolute inset-0 h-full w-full" style={{ opacity: 0.18 }}>
        <path d={INDIA_PATH} fill="#1a2742" stroke="#8faec8" strokeWidth="2" />
      </svg>

      {/* Location pins */}
      {LOCATIONS.map(loc => {
        const isActive = loc.id === activeId;
        const isHov    = hovered === loc.id;
        return (
          <button key={loc.id} type="button"
            onClick={() => setActiveId(loc.id)}
            onMouseEnter={() => setHovered(loc.id)}
            onMouseLeave={() => setHovered(null)}
            aria-label={loc.label}
            style={{ top: loc.top, left: loc.left, transform: 'translate(-50%,-50%)' }}
            className="absolute flex flex-col items-center transition-all duration-200 focus-visible:outline-2">

            {/* Ripple */}
            {isActive && (
              <span className="absolute h-10 w-10 rounded-full animate-ping-slow"
                style={{ background: 'rgba(26,39,66,0.10)' }} />
            )}

            {/* Pin dot */}
            <span className={`relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white shadow-[0_4px_12px_rgba(26,39,66,0.28)] transition-all duration-200 ${
              isActive ? 'h-6 w-6 bg-[#1a2742]' : (isHov ? 'bg-[#2c3e5e] scale-110' : 'bg-[#8faec8]')
            }`}>
              {isActive && <span className="h-2 w-2 rounded-full bg-white" />}
            </span>

            {/* Label tooltip */}
            {(isActive || isHov) && (
              <span className="animate-rise-in mt-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold shadow-md"
                style={{ background: 'rgba(255,255,255,0.92)', color: '#1a2742', border: '1px solid rgba(143,174,200,0.40)' }}>
                {loc.city}
              </span>
            )}
          </button>
        );
      })}

      {/* Demo label */}
      <div className="absolute left-4 top-4 rounded-2xl px-4 py-2.5"
        style={{ background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(143,174,200,0.25)', backdropFilter: 'blur(10px)' }}>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#8faec8' }}>Interactive Map</p>
        <p className="mt-0.5 text-[12px] font-medium" style={{ color: '#1a2742' }}>Click a city to explore</p>
      </div>

      {/* Selected location card */}
      <div className="animate-rise-in absolute bottom-4 right-4 flex max-w-[280px] overflow-hidden rounded-[22px] shadow-[0_12px_36px_rgba(26,39,66,0.18)]"
        style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(212,228,247,0.60)', backdropFilter: 'blur(14px)' }}>
        <img key={active.id} src={PHOTOS[active.id]} alt={active.label}
          className="h-24 w-24 flex-none object-cover transition-all duration-500" />
        <div className="flex flex-col justify-center px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em]" style={{ color: '#8faec8' }}>{active.city}</p>
          <h3 className="mt-1 text-[14px] font-bold leading-tight" style={{ color: '#1a2742' }}>{active.label}</h3>
          <p className="mt-1 text-[11px] leading-4" style={{ color: '#2c3e5e' }}>{active.description}</p>
          <p className="mt-1.5 text-[12px] font-bold" style={{ color: '#1a2742' }}>{active.price}</p>
        </div>
      </div>

      {/* City list */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-1.5">
        {LOCATIONS.map(loc => (
          <button key={loc.id} type="button" onClick={() => setActiveId(loc.id)}
            className="rounded-full px-3 py-1 text-[11px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: activeId === loc.id ? '#1a2742' : 'rgba(255,255,255,0.75)',
              color: activeId === loc.id ? 'white' : '#2c3e5e',
              border: '1px solid rgba(143,174,200,0.30)',
            }}>
            {loc.city}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Main export ─── */
export default function MapboxMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hasToken, setHasToken]   = useState(false);
  const [mapError, setMapError]   = useState(false);

  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) { setHasToken(false); return; }
    let map: any;
    setHasToken(true);

    async function load() {
      try {
        const mgl = (await import('mapbox-gl')).default;
        mgl.accessToken = token!;
        map = new mgl.Map({
          container: containerRef.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [78.9629, 20.5937],
          zoom: 4.4,
        });
        map.addControl(new mgl.NavigationControl(), 'top-right');

        map.on('load', () => {
          LOCATIONS.forEach(loc => {
            new mgl.Marker({ color: '#1a2742' })
              .setLngLat([0, 0])
              .setPopup(new mgl.Popup().setText(`${loc.label} · ${loc.price}`))
              .addTo(map);
          });
        });
      } catch { setMapError(true); }
    }

    load();
    return () => { if (map) map.remove(); };
  }, []);

  if (!hasToken || mapError) return <DemoMap />;

  return <div ref={containerRef} className="animate-fade-in rounded-[28px]" style={{ height: 480 }} />;
}
