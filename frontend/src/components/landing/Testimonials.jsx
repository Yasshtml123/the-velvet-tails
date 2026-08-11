import { useState, useRef, useEffect } from 'react';
import { Star, Quote, Pencil, Trash2, X, Send } from 'lucide-react';

// ─── Seed reviews (static, non-deletable) ─────────────────────────────────────
const SEED_REVIEWS = [
  {
    id: 'seed-1',
    name: 'Sarah Jenkins',
    pet: 'Luna (Golden Retriever)',
    initials: 'SJ',
    text: "The velvet collar is absolutely stunning! Luna looks so elegant, and the quality is unmatched. I've already ordered the matching leash.",
    rating: 5,
    isUserSubmitted: false,
  },
  {
    id: 'seed-2',
    name: 'Michael Chen',
    pet: 'Milo (Persian Cat)',
    initials: 'MC',
    text: 'Finally found a breakaway collar that actually looks luxurious. Milo seems very comfortable wearing it all day.',
    rating: 5,
    isUserSubmitted: false,
  },
  {
    id: 'seed-3',
    name: 'Emma Watson',
    pet: 'Bella (French Bulldog)',
    initials: 'EW',
    text: 'The night walk set gives me such peace of mind. Not only is it highly visible, but it also maintains that premium feel.',
    rating: 4,
    isUserSubmitted: false,
  },
];

// ─── Helper: derive initials from a name string ───────────────────────────────
function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

// ─── Interactive star-picker used inside the form ─────────────────────────────
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform duration-100 hover:scale-110 active:scale-95"
        >
          <Star
            className={`w-7 h-7 transition-colors duration-150 ${
              star <= (hovered || value)
                ? 'text-gold fill-gold'
                : 'text-white/40'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ─── Read-only star row used on cards ────────────────────────────────────────
function StarRow({ rating }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-gold fill-gold' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

// ─── Main Testimonials component ──────────────────────────────────────────────
export default function Testimonials() {
  const [reviews, setReviews] = useState(SEED_REVIEWS);
  const [showForm, setShowForm] = useState(false);

  // Form field state
  const [name, setName] = useState('');
  const [pet, setPet] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef(null);
  const firstFieldRef = useRef(null);

  // Focus the first input when form opens
  useEffect(() => {
    if (showForm) {
      setTimeout(() => firstFieldRef.current?.focus(), 50);
    }
  }, [showForm]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeForm(); };
    if (showForm) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showForm]);

  function closeForm() {
    setShowForm(false);
    setSubmitted(false);
    setName('');
    setPet('');
    setRating(5);
    setText('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newReview = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      pet: pet.trim() || '—',
      initials: getInitials(name) || '?',
      text: text.trim(),
      rating,
      isUserSubmitted: true,
    };

    setReviews((prev) => [newReview, ...prev]);
    setSubmitted(true);
    setTimeout(() => closeForm(), 1400);
  }

  function handleDelete(id) {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="relative py-16 lg:py-24 overflow-hidden">

      {/* ── Background Image + Plum Overlay (unchanged) ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544568100-847a948585b9?w=1920&h=1080&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-plum/85 mix-blend-multiply" />
      </div>

      {/* ── Content wrapper ── */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">

        {/* ── Section header ── */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
            Happy Tails
          </h2>
          <p className="text-cream/80 font-sans text-lg max-w-2xl mx-auto mb-7">
            Don't just take our word for it. See what our furry friends and their humans have to say.
          </p>

          {/* Write a Review button */}
          <button
            id="write-review-btn"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/50 text-white font-sans font-semibold text-sm rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] shadow-lg"
          >
            <Pencil className="w-4 h-4" />
            Write a Review
          </button>
        </div>

        {/* ── Review cards grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl relative group transition-all duration-300 hover:bg-white/90"
            >
              {/* Big quote icon (decorative, unchanged) */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-plum/10" />

              {/* Delete button — only on user-submitted cards */}
              {review.isUserSubmitted && (
                <button
                  onClick={() => handleDelete(review.id)}
                  aria-label="Delete this review"
                  title="Delete review"
                  className="absolute top-3 left-3 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-all duration-200 shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Stars */}
              <div className="mb-6">
                <StarRow rating={review.rating} />
              </div>

              {/* Review text */}
              <p className="text-charcoal italic font-serif mb-8 text-lg leading-relaxed">
                "{review.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 rounded-full bg-plum text-white flex items-center justify-center font-bold font-sans flex-shrink-0">
                  {review.initials}
                </div>
                <div>
                  <h4 className="text-charcoal font-bold font-sans text-sm">{review.name}</h4>
                  <p className="text-charcoal/60 font-sans text-xs">{review.pet}</p>
                </div>

                {/* "Your review" badge */}
                {review.isUserSubmitted && (
                  <span className="ml-auto text-[10px] font-sans font-bold text-plum bg-plum/10 px-2 py-1 rounded-full whitespace-nowrap">
                    Your review
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          Review Form Modal — overlaid inside the section
      ══════════════════════════════════════════════════════════════ */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            onClick={closeForm}
          />

          {/* Modal panel */}
          <div
            ref={formRef}
            className="relative w-full max-w-lg bg-plum rounded-3xl shadow-2xl overflow-hidden animate-fade-in-slide-up"
          >
            {/* Subtle dot-pattern texture (matches Newsletter style) */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '28px 28px',
              }}
            />

            <div className="relative z-10 p-7 sm:p-8">

              {/* Modal header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3
                    id="review-modal-title"
                    className="text-2xl font-bold font-serif text-white"
                  >
                    Share Your Experience
                  </h3>
                  <p className="text-white/60 font-sans text-sm mt-1">
                    We'd love to hear from you and your pet!
                  </p>
                </div>
                <button
                  onClick={closeForm}
                  aria-label="Close form"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 flex-shrink-0 mt-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* ── Success state ── */}
              {submitted ? (
                <div className="py-8 text-center animate-fade-in-slide-up">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/20 flex items-center justify-center">
                    <Star className="w-8 h-8 text-gold fill-gold" />
                  </div>
                  <p className="text-white font-serif text-xl font-bold mb-1">Thank you!</p>
                  <p className="text-white/70 font-sans text-sm">Your review has been added to Happy Tails. 🐾</p>
                </div>
              ) : (
                /* ── Form ── */
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                  {/* Name */}
                  <div>
                    <label className="block text-white/80 font-sans text-xs font-semibold uppercase tracking-widest mb-1.5">
                      Your Name <span className="text-gold">*</span>
                    </label>
                    <input
                      ref={firstFieldRef}
                      id="review-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold/50 transition-all"
                    />
                  </div>

                  {/* Pet Details */}
                  <div>
                    <label className="block text-white/80 font-sans text-xs font-semibold uppercase tracking-widest mb-1.5">
                      Pet Details
                    </label>
                    <input
                      id="review-pet"
                      type="text"
                      value={pet}
                      onChange={(e) => setPet(e.target.value)}
                      placeholder="e.g. Luna (Golden Retriever)"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold/50 transition-all"
                    />
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block text-white/80 font-sans text-xs font-semibold uppercase tracking-widest mb-2">
                      Rating <span className="text-gold">*</span>
                    </label>
                    <StarPicker value={rating} onChange={setRating} />
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-white/80 font-sans text-xs font-semibold uppercase tracking-widest mb-1.5">
                      Your Review <span className="text-gold">*</span>
                    </label>
                    <textarea
                      id="review-text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Tell us about your experience with The Velvet Tails…"
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold/50 transition-all resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={closeForm}
                      className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-sans font-semibold text-sm rounded-xl transition-all duration-200 border border-white/20"
                    >
                      Cancel
                    </button>
                    <button
                      id="submit-review-btn"
                      type="submit"
                      disabled={!name.trim() || !text.trim()}
                      className="flex-1 py-3 bg-gold hover:bg-[#b89d5a] disabled:opacity-40 disabled:cursor-not-allowed text-plum font-sans font-bold text-sm rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] shadow-lg flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Post Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
