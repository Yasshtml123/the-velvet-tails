import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Eye, Shield } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: <Zap className="w-4 h-4" />, text: 'Reflective stitching for 360° visibility' },
  { icon: <Eye className="w-4 h-4" />, text: 'LED-compatible D-ring attachment' },
  { icon: <Shield className="w-4 h-4" />, text: 'Water-resistant velvet exterior' },
];

export default function PromoBanner({ onShopNow }) {
  return (
    <section className="relative overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[420px]">

        {/* ── Left: Brand copy panel ─────────────────────────────────────── */}
        <div className="relative flex-1 bg-plum flex items-center justify-center py-16 px-8 lg:px-14 overflow-hidden">

          {/* Decorative circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-16 -right-10 w-52 h-52 rounded-full bg-gold/10 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.03] pointer-events-none" />

          <div className="relative z-10 max-w-md">
            {/* Eyebrow */}
            <p className="font-sans text-xs font-bold text-gold uppercase tracking-[0.25em] mb-4">
              ✦ Limited Collection
            </p>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-white leading-tight mb-5">
              Night Walk<br />
              <span className="text-gold">Collection</span>
            </h2>

            {/* Body */}
            <p className="font-sans text-cream/75 text-base leading-relaxed mb-7">
              Keep your pup safe and stylish after dark. Our Night Walk sets blend premium velvet 
              craftsmanship with intelligent safety features — because every walk deserves to feel 
              like a runway.
            </p>

            {/* Feature highlights */}
            <ul className="space-y-2.5 mb-9">
              {HIGHLIGHTS.map((h, i) => (
                <li key={i} className="flex items-center gap-3 text-cream/80 font-sans text-sm">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gold/20 text-gold flex items-center justify-center">
                    {h.icon}
                  </span>
                  {h.text}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onShopNow}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-gold hover:bg-[#b89d5a] text-plum font-sans font-bold text-sm rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-xl shadow-gold/30"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/products?category=Night%20Walk%20Sets"
                className="inline-flex items-center gap-1.5 text-sm font-sans font-semibold text-cream/70 hover:text-gold transition-colors duration-200"
              >
                View Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Right: Atmospheric photo panel ────────────────────────────── */}
        <div className="relative flex-1 min-h-[280px] lg:min-h-0 overflow-hidden">
          {/* Photo */}
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&h=600&fit=crop"
            alt="Dog on an evening walk wearing a Velvet Tails Night Walk set"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {/* Gradient overlay — blends left edge into plum panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-plum/60 via-plum/20 to-transparent lg:from-plum/40" />

          {/* Floating badge */}
          <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3.5 shadow-xl">
            <p className="font-sans text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-0.5">
              Starting from
            </p>
            <p className="font-serif font-bold text-plum text-xl leading-none">₹1,499</p>
            <p className="font-sans text-[10px] text-charcoal/50 mt-0.5">Free shipping included</p>
          </div>
        </div>

      </div>
    </section>
  );
}
