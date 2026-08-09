import React from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, ShoppingBag, Star, Heart, Award, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-0">
      {/* 1. Hero Banner */}
      <section className="relative bg-gradient-to-br from-plum to-plum/80 text-white py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1600&auto=format&fit=crop')] opacity-10 mix-blend-overlay bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 animate-fade-in-slide-up">
            Where Paws Meet Plush
          </h1>
          <p className="text-lg md:text-xl font-sans max-w-3xl mx-auto text-cream/90 animate-fade-in-slide-up" style={{ animationDelay: '100ms' }}>
            The Velvet Tails was born from a simple belief: your pet deserves accessories as beautiful, comfortable, and thoughtfully crafted as anything you'd choose for yourself.
          </p>
        </div>
      </section>

      {/* 2. Metrics Counter Bar */}
      <section className="bg-white border-b border-blush/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <PawPrint className="w-8 h-8 text-gold mb-3" />
              <span className="text-3xl font-serif font-bold text-plum mb-1">10K+</span>
              <span className="text-sm font-sans font-medium text-charcoal/70 uppercase tracking-wider">Happy Pets</span>
            </div>
            <div className="flex flex-col items-center">
              <ShoppingBag className="w-8 h-8 text-gold mb-3" />
              <span className="text-3xl font-serif font-bold text-plum mb-1">500+</span>
              <span className="text-sm font-sans font-medium text-charcoal/70 uppercase tracking-wider">Premium Products</span>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 text-gold mb-3" />
              <span className="text-3xl font-serif font-bold text-plum mb-1">4.9★</span>
              <span className="text-sm font-sans font-medium text-charcoal/70 uppercase tracking-wider">Average Rating</span>
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-8 h-8 text-gold mb-3" />
              <span className="text-3xl font-serif font-bold text-plum mb-1">98%</span>
              <span className="text-sm font-sans font-medium text-charcoal/70 uppercase tracking-wider">Satisfied Owners</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Story & Purpose Section */}
      <section className="py-20 lg:py-28 bg-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="aspect-[4/5] bg-white p-3 sm:p-4 rounded-3xl shadow-xl border border-blush/50 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop" alt="Dog wearing premium collar" className="w-full h-full object-cover rounded-2xl" />
              </div>
              {/* Est. Card */}
              <div className="absolute -bottom-8 -right-4 sm:-right-8 bg-white p-6 rounded-2xl shadow-xl border border-blush/50 transform rotate-3 max-w-xs z-10">
                <p className="font-serif italic text-lg text-plum mb-2">
                  "Our mission is to bring elegance to everyday pet parenting."
                </p>
                <p className="font-sans text-sm font-bold text-charcoal/60 uppercase tracking-wide">
                  Est. 2023
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-plum mb-8 leading-tight">
                Crafted for pets who deserve the finest
              </h2>
              <div className="space-y-5 text-charcoal/80 font-sans text-lg mb-10">
                <p>
                  We started The Velvet Tails when we couldn't find accessories that matched our home's aesthetic without compromising on our dog's comfort. Everything on the market was either durable but rigid, or beautiful but fragile.
                </p>
                <p>
                  So, we decided to create our own. Months of testing fabrics, refining hardware, and fitting dogs and cats of all shapes and sizes led to our signature velvet collection. Soft to the touch, gentle on fur, yet robust enough for everyday adventures.
                </p>
              </div>
              <Link to="/products" className="inline-flex items-center px-8 py-4 bg-plum text-white rounded-full font-sans font-bold hover:bg-plum/90 transition-all transform hover:scale-105 shadow-lg shadow-plum/20">
                Shop the Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Values */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-plum mb-4">Our Values</h2>
            <p className="text-lg text-charcoal/70 font-sans max-w-2xl mx-auto">The principles that guide every stitch, buckle, and design we create.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Value 1 */}
            <div className="bg-cream p-8 rounded-3xl border border-blush/40 hover:shadow-xl hover:shadow-blush/50 hover:border-plum/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Heart className="w-7 h-7 text-plum" />
              </div>
              <h3 className="font-serif font-bold text-xl text-plum mb-3">Made with Love</h3>
              <p className="font-sans text-charcoal/70 leading-relaxed">Every product is crafted with the same care and attention we'd give to our own furry family members.</p>
            </div>
            
            {/* Value 2 */}
            <div className="bg-cream p-8 rounded-3xl border border-blush/40 hover:shadow-xl hover:shadow-blush/50 hover:border-plum/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <Award className="w-7 h-7 text-plum" />
              </div>
              <h3 className="font-serif font-bold text-xl text-plum mb-3">Premium Quality</h3>
              <p className="font-sans text-charcoal/70 leading-relaxed">We source only the finest fabrics and durable hardware to ensure long-lasting elegance and safety.</p>
            </div>
            
            {/* Value 3 */}
            <div className="bg-cream p-8 rounded-3xl border border-blush/40 hover:shadow-xl hover:shadow-blush/50 hover:border-plum/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <PawPrint className="w-7 h-7 text-plum" />
              </div>
              <h3 className="font-serif font-bold text-xl text-plum mb-3">Pet-First Design</h3>
              <p className="font-sans text-charcoal/70 leading-relaxed">Comfort is non-negotiable. Our designs are thoroughly tested to ensure they are gentle and non-restrictive.</p>
            </div>
            
            {/* Value 4 */}
            <div className="bg-cream p-8 rounded-3xl border border-blush/40 hover:shadow-xl hover:shadow-blush/50 hover:border-plum/30 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                <Users className="w-7 h-7 text-plum" />
              </div>
              <h3 className="font-serif font-bold text-xl text-plum mb-3">Community Driven</h3>
              <p className="font-sans text-charcoal/70 leading-relaxed">We actively listen to our pack. Your feedback shapes our future collections and improvements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Discover the Collection Banner */}
      <section className="py-24 bg-plum relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-10">
            Discover the Collection
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link to="/products" className="px-10 py-4 bg-white text-plum rounded-full font-sans font-bold hover:bg-cream transition-all transform hover:scale-105 shadow-xl">
              Shop for Dogs
            </Link>
            <Link to="/products" className="px-10 py-4 bg-transparent border-2 border-white/80 text-white rounded-full font-sans font-bold hover:bg-white/10 hover:border-white transition-all transform hover:scale-105">
              Shop for Cats
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
