/**
 * seedProducts.js — The Velvet Tails Product Seeder
 *
 * Clears existing dog/cat products and inserts the full catalog:
 *   • Dog products (from test.products.csv — all sub-categories)
 *   • Cat products (curated dummy set, same schema)
 *
 * Usage:  node seedProducts.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

// ─── Cloudinary placeholder helper ────────────────────────────────────────────
// Using high-quality, royalty-free Unsplash images per product type.
// Replace with real Cloudinary URLs once images are uploaded.
const IMG = {
  // Dog – Collars & Harnesses
  velvetfur_red:     'https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=600&h=600&fit=crop',
  velvetfur_brown:   'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop',
  velvetfur_black:   'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
  velvetfur_blue:    'https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&h=600&fit=crop',
  harness_red:       'https://images.unsplash.com/photo-1534361960057-19f4434a4f4d?w=600&h=600&fit=crop',
  harness_brown:     'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop',
  harness_black:     'https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=600&h=600&fit=crop',
  firstwalk:         'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
  // Dog – Leashes & Leads
  leash_orange:      'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&h=600&fit=crop',
  leash_brown:       'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop',
  leash_black:       'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
  // Dog – Night Walk
  nightwalk_black:   'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=600&h=600&fit=crop',
  nightwalk_brown:   'https://images.unsplash.com/photo-1584392429975-4b12d018e257?w=600&h=600&fit=crop',
  nightwalk_orange:  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
  // Dog – Playtime
  toy_generic:       'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=600&fit=crop',
  toy_rope:          'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop',
  toy_ball:          'https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=600&h=600&fit=crop',
  toy_bundle:        'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=600&fit=crop',
  // Dog – Accessories
  bowtie:            'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&h=600&fit=crop',
  bow_collar:        'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=600&h=600&fit=crop',
  tactical:          'https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=600&h=600&fit=crop',
  safeglow:          'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=600&h=600&fit=crop',
  everyday:          'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop',
  // Cat products
  cat_collar:        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
  cat_harness:       'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop',
  cat_toy_feather:   'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=600&fit=crop',
  cat_toy_ball:      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&h=600&fit=crop',
  cat_toy_wand:      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=600&h=600&fit=crop',
  cat_bed:           'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop',
  cat_scratcher:     'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop',
  cat_bandana:       'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop',
};

const mkImg = (key) => [{ url: IMG[key] || IMG.toy_generic, publicId: `velvet_tails_${key}` }];
const DIM = { length: 30, breadth: 5, height: 3, weight: 0.3 };

// ─── DOG PRODUCTS ──────────────────────────────────────────────────────────────

const DOG_PRODUCTS = [

  // ── Collars & Harnesses ──────────────────────────────────────────────────────
  // VelvetFur Comfort Collar — Red
  { title: 'VelvetFur Comfort Collar — Red | Small',   description: 'Plush softness meets everyday durability. Designed for premium comfort and refined style. Soft fur-like texture for all-day wear. Adjustable fit with a secure clasp. Elegant and durable construction.', price: 149900, images: mkImg('velvetfur_red'),   category: 'Collars & Harnesses', size: 'Small',  color: 'Red',   inventory: 50, tags: ['collar','dog','velvetfur','red'] },
  { title: 'VelvetFur Comfort Collar — Red | Medium',  description: 'Plush softness meets everyday durability. Designed for premium comfort and refined style. Soft fur-like texture for all-day wear. Adjustable fit with a secure clasp. Elegant and durable construction.', price: 159900, images: mkImg('velvetfur_red'),   category: 'Collars & Harnesses', size: 'Medium', color: 'Red',   inventory: 50, tags: ['collar','dog','velvetfur','red'] },
  { title: 'VelvetFur Comfort Collar — Red | Large',   description: 'Plush softness meets everyday durability. Designed for premium comfort and refined style. Soft fur-like texture for all-day wear. Adjustable fit with a secure clasp. Elegant and durable construction.', price: 169900, images: mkImg('velvetfur_red'),   category: 'Collars & Harnesses', size: 'Large',  color: 'Red',   inventory: 50, tags: ['collar','dog','velvetfur','red'] },
  // VelvetFur Comfort Collar — Brown
  { title: 'VelvetFur Comfort Collar — Brown | Small',  description: 'Plush softness meets everyday durability. Designed for premium comfort and refined style. Soft fur-like texture for all-day wear. Adjustable fit with a secure clasp. Elegant and durable construction.', price: 149900, images: mkImg('velvetfur_brown'), category: 'Collars & Harnesses', size: 'Small',  color: 'Brown', inventory: 50, tags: ['collar','dog','velvetfur','brown'] },
  { title: 'VelvetFur Comfort Collar — Brown | Medium', description: 'Plush softness meets everyday durability. Designed for premium comfort and refined style. Soft fur-like texture for all-day wear. Adjustable fit with a secure clasp. Elegant and durable construction.', price: 159900, images: mkImg('velvetfur_brown'), category: 'Collars & Harnesses', size: 'Medium', color: 'Brown', inventory: 50, tags: ['collar','dog','velvetfur','brown'] },
  { title: 'VelvetFur Comfort Collar — Brown | Large',  description: 'Plush softness meets everyday durability. Designed for premium comfort and refined style. Soft fur-like texture for all-day wear. Adjustable fit with a secure clasp. Elegant and durable construction.', price: 169900, images: mkImg('velvetfur_brown'), category: 'Collars & Harnesses', size: 'Large',  color: 'Brown', inventory: 50, tags: ['collar','dog','velvetfur','brown'] },
  // VelvetFur Comfort Collar — Black
  { title: 'VelvetFur Comfort Collar — Black | Small',  description: 'Plush softness meets everyday durability. Designed for premium comfort and refined style. Soft fur-like texture for all-day wear. Adjustable fit with a secure clasp. Elegant and durable construction.', price: 149900, images: mkImg('velvetfur_black'), category: 'Collars & Harnesses', size: 'Small',  color: 'Black', inventory: 50, tags: ['collar','dog','velvetfur','black'] },
  { title: 'VelvetFur Comfort Collar — Black | Medium', description: 'Plush softness meets everyday durability. Designed for premium comfort and refined style. Soft fur-like texture for all-day wear. Adjustable fit with a secure clasp. Elegant and durable construction.', price: 159900, images: mkImg('velvetfur_black'), category: 'Collars & Harnesses', size: 'Medium', color: 'Black', inventory: 50, tags: ['collar','dog','velvetfur','black'] },
  { title: 'VelvetFur Comfort Collar — Black | Large',  description: 'Plush softness meets everyday durability. Designed for premium comfort and refined style. Soft fur-like texture for all-day wear. Adjustable fit with a secure clasp. Elegant and durable construction.', price: 169900, images: mkImg('velvetfur_black'), category: 'Collars & Harnesses', size: 'Large',  color: 'Black', inventory: 50, tags: ['collar','dog','velvetfur','black'] },
  // VelvetFur Comfort Collar — Blue
  { title: 'VelvetFur Comfort Collar — Blue | Small',   description: 'Plush softness meets everyday durability. Designed for premium comfort and refined style. Soft fur-like texture for all-day wear. Adjustable fit with a secure clasp. Elegant and durable construction.', price: 149900, images: mkImg('velvetfur_blue'),  category: 'Collars & Harnesses', size: 'Small',  color: 'Blue',  inventory: 50, tags: ['collar','dog','velvetfur','blue'] },
  { title: 'VelvetFur Comfort Collar — Blue | Medium',  description: 'Plush softness meets everyday durability. Designed for premium comfort and refined style. Soft fur-like texture for all-day wear. Adjustable fit with a secure clasp. Elegant and durable construction.', price: 159900, images: mkImg('velvetfur_blue'),  category: 'Collars & Harnesses', size: 'Medium', color: 'Blue',  inventory: 50, tags: ['collar','dog','velvetfur','blue'] },
  { title: 'VelvetFur Comfort Collar — Blue | Large',   description: 'Plush softness meets everyday durability. Designed for premium comfort and refined style. Soft fur-like texture for all-day wear. Adjustable fit with a secure clasp. Elegant and durable construction.', price: 169900, images: mkImg('velvetfur_blue'),  category: 'Collars & Harnesses', size: 'Large',  color: 'Blue',  inventory: 50, tags: ['collar','dog','velvetfur','blue'] },
  // VelvetEase Comfort Harness Set — Red
  { title: 'VelvetEase Comfort Harness Set — Red | Small',  description: 'Pressure-balanced comfort for stress-free, elegant walks. Padded comfort harness with balanced pressure distribution. Secure buckle system. Breathable mesh lining. Matching leash included.', price: 249900, compareAtPrice: 299900, images: mkImg('harness_red'),   category: 'Collars & Harnesses', size: 'Small',  color: 'Red',   inventory: 40, tags: ['harness','dog','velvetease','red'] },
  { title: 'VelvetEase Comfort Harness Set — Red | Medium', description: 'Pressure-balanced comfort for stress-free, elegant walks. Padded comfort harness with balanced pressure distribution. Secure buckle system. Breathable mesh lining. Matching leash included.', price: 259900, compareAtPrice: 309900, images: mkImg('harness_red'),   category: 'Collars & Harnesses', size: 'Medium', color: 'Red',   inventory: 40, tags: ['harness','dog','velvetease','red'] },
  { title: 'VelvetEase Comfort Harness Set — Red | Large',  description: 'Pressure-balanced comfort for stress-free, elegant walks. Padded comfort harness with balanced pressure distribution. Secure buckle system. Breathable mesh lining. Matching leash included.', price: 269900, compareAtPrice: 319900, images: mkImg('harness_red'),   category: 'Collars & Harnesses', size: 'Large',  color: 'Red',   inventory: 40, tags: ['harness','dog','velvetease','red'] },
  // VelvetEase Comfort Harness Set — Brown
  { title: 'VelvetEase Comfort Harness Set — Brown | Small',  description: 'Pressure-balanced comfort for stress-free, elegant walks. Padded comfort harness with balanced pressure distribution. Secure buckle system. Breathable mesh lining. Matching leash included.', price: 249900, compareAtPrice: 299900, images: mkImg('harness_brown'), category: 'Collars & Harnesses', size: 'Small',  color: 'Brown', inventory: 40, tags: ['harness','dog','velvetease','brown'] },
  { title: 'VelvetEase Comfort Harness Set — Brown | Medium', description: 'Pressure-balanced comfort for stress-free, elegant walks. Padded comfort harness with balanced pressure distribution. Secure buckle system. Breathable mesh lining. Matching leash included.', price: 259900, compareAtPrice: 309900, images: mkImg('harness_brown'), category: 'Collars & Harnesses', size: 'Medium', color: 'Brown', inventory: 40, tags: ['harness','dog','velvetease','brown'] },
  { title: 'VelvetEase Comfort Harness Set — Brown | Large',  description: 'Pressure-balanced comfort for stress-free, elegant walks. Padded comfort harness with balanced pressure distribution. Secure buckle system. Breathable mesh lining. Matching leash included.', price: 269900, compareAtPrice: 319900, images: mkImg('harness_brown'), category: 'Collars & Harnesses', size: 'Large',  color: 'Brown', inventory: 40, tags: ['harness','dog','velvetease','brown'] },
  // VelvetEase Comfort Harness Set — Black
  { title: 'VelvetEase Comfort Harness Set — Black | Small',  description: 'Pressure-balanced comfort for stress-free, elegant walks. Padded comfort harness with balanced pressure distribution. Secure buckle system. Breathable mesh lining. Matching leash included.', price: 249900, compareAtPrice: 299900, images: mkImg('harness_black'), category: 'Collars & Harnesses', size: 'Small',  color: 'Black', inventory: 40, tags: ['harness','dog','velvetease','black'] },
  { title: 'VelvetEase Comfort Harness Set — Black | Medium', description: 'Pressure-balanced comfort for stress-free, elegant walks. Padded comfort harness with balanced pressure distribution. Secure buckle system. Breathable mesh lining. Matching leash included.', price: 259900, compareAtPrice: 309900, images: mkImg('harness_black'), category: 'Collars & Harnesses', size: 'Medium', color: 'Black', inventory: 40, tags: ['harness','dog','velvetease','black'] },
  { title: 'VelvetEase Comfort Harness Set — Black | Large',  description: 'Pressure-balanced comfort for stress-free, elegant walks. Padded comfort harness with balanced pressure distribution. Secure buckle system. Breathable mesh lining. Matching leash included.', price: 269900, compareAtPrice: 319900, images: mkImg('harness_black'), category: 'Collars & Harnesses', size: 'Large',  color: 'Black', inventory: 40, tags: ['harness','dog','velvetease','black'] },
  // VelvetPup First Walk Set
  { title: 'VelvetPup First Walk Set — Small',  description: 'A gentle introduction to confident walking for puppies. Lightweight puppy harness with soft padding. Gentle first-walk design. Easy-on buckle system. Grows with your pup.', price: 189900, compareAtPrice: 229900, images: mkImg('firstwalk'), category: 'Collars & Harnesses', size: 'Small',  color: 'Mixed', inventory: 60, tags: ['puppy','harness','firstwalk','dog'] },
  { title: 'VelvetPup First Walk Set — Medium', description: 'A gentle introduction to confident walking for puppies. Lightweight puppy harness with soft padding. Gentle first-walk design. Easy-on buckle system. Grows with your pup.', price: 199900, compareAtPrice: 239900, images: mkImg('firstwalk'), category: 'Collars & Harnesses', size: 'Medium', color: 'Mixed', inventory: 60, tags: ['puppy','harness','firstwalk','dog'] },
  { title: 'VelvetPup First Walk Set — Large',  description: 'A gentle introduction to confident walking for puppies. Lightweight puppy harness with soft padding. Gentle first-walk design. Easy-on buckle system. Grows with your pup.', price: 209900, compareAtPrice: 249900, images: mkImg('firstwalk'), category: 'Collars & Harnesses', size: 'Large',  color: 'Mixed', inventory: 60, tags: ['puppy','harness','firstwalk','dog'] },

  // ── Leashes & Leads ──────────────────────────────────────────────────────────
  { title: 'VelvetGrip Padded Leash — Orange | Small',  description: 'Designed for smooth handling and comfort-led control on every walk. Comfort padded handle. Reduces hand strain. Durable nylon core. Reflective stitching for safety.', price: 119900, images: mkImg('leash_orange'), category: 'Leashes & Leads', size: 'Small',  color: 'Orange', inventory: 80, tags: ['leash','dog','velvetgrip','orange'] },
  { title: 'VelvetGrip Padded Leash — Orange | Medium', description: 'Designed for smooth handling and comfort-led control on every walk. Comfort padded handle. Reduces hand strain. Durable nylon core. Reflective stitching for safety.', price: 129900, images: mkImg('leash_orange'), category: 'Leashes & Leads', size: 'Medium', color: 'Orange', inventory: 80, tags: ['leash','dog','velvetgrip','orange'] },
  { title: 'VelvetGrip Padded Leash — Orange | Large',  description: 'Designed for smooth handling and comfort-led control on every walk. Comfort padded handle. Reduces hand strain. Durable nylon core. Reflective stitching for safety.', price: 139900, images: mkImg('leash_orange'), category: 'Leashes & Leads', size: 'Large',  color: 'Orange', inventory: 80, tags: ['leash','dog','velvetgrip','orange'] },
  { title: 'VelvetGrip Padded Leash — Brown | Small',   description: 'Designed for smooth handling and comfort-led control on every walk. Comfort padded handle. Reduces hand strain. Durable nylon core. Reflective stitching for safety.', price: 119900, images: mkImg('leash_brown'), category: 'Leashes & Leads', size: 'Small',  color: 'Brown',  inventory: 80, tags: ['leash','dog','velvetgrip','brown'] },
  { title: 'VelvetGrip Padded Leash — Brown | Medium',  description: 'Designed for smooth handling and comfort-led control on every walk. Comfort padded handle. Reduces hand strain. Durable nylon core. Reflective stitching for safety.', price: 129900, images: mkImg('leash_brown'), category: 'Leashes & Leads', size: 'Medium', color: 'Brown',  inventory: 80, tags: ['leash','dog','velvetgrip','brown'] },
  { title: 'VelvetGrip Padded Leash — Brown | Large',   description: 'Designed for smooth handling and comfort-led control on every walk. Comfort padded handle. Reduces hand strain. Durable nylon core. Reflective stitching for safety.', price: 139900, images: mkImg('leash_brown'), category: 'Leashes & Leads', size: 'Large',  color: 'Brown',  inventory: 80, tags: ['leash','dog','velvetgrip','brown'] },
  { title: 'VelvetGrip Padded Leash — Black | Small',   description: 'Designed for smooth handling and comfort-led control on every walk. Comfort padded handle. Reduces hand strain. Durable nylon core. Reflective stitching for safety.', price: 119900, images: mkImg('leash_black'), category: 'Leashes & Leads', size: 'Small',  color: 'Black',  inventory: 80, tags: ['leash','dog','velvetgrip','black'] },
  { title: 'VelvetGrip Padded Leash — Black | Medium',  description: 'Designed for smooth handling and comfort-led control on every walk. Comfort padded handle. Reduces hand strain. Durable nylon core. Reflective stitching for safety.', price: 129900, images: mkImg('leash_black'), category: 'Leashes & Leads', size: 'Medium', color: 'Black',  inventory: 80, tags: ['leash','dog','velvetgrip','black'] },
  { title: 'VelvetGrip Padded Leash — Black | Large',   description: 'Designed for smooth handling and comfort-led control on every walk. Comfort padded handle. Reduces hand strain. Durable nylon core. Reflective stitching for safety.', price: 139900, images: mkImg('leash_black'), category: 'Leashes & Leads', size: 'Large',  color: 'Black',  inventory: 80, tags: ['leash','dog','velvetgrip','black'] },

  // ── Night Walk ───────────────────────────────────────────────────────────────
  { title: 'VelvetGlow Night Walk Set — Black | Small',   description: 'Visibility-focused design with The Velvet Tails luxury finish. Reflective dog set with enhanced night visibility. LED-compatible D-ring. Water-resistant velvet exterior. Premium safety hardware.', price: 279900, compareAtPrice: 329900, images: mkImg('nightwalk_black'),  category: 'Night Walk', size: 'Small',  color: 'Black',  inventory: 35, tags: ['nightwalk','dog','velvetglow','reflective','black'] },
  { title: 'VelvetGlow Night Walk Set — Black | Medium',  description: 'Visibility-focused design with The Velvet Tails luxury finish. Reflective dog set with enhanced night visibility. LED-compatible D-ring. Water-resistant velvet exterior. Premium safety hardware.', price: 289900, compareAtPrice: 339900, images: mkImg('nightwalk_black'),  category: 'Night Walk', size: 'Medium', color: 'Black',  inventory: 35, tags: ['nightwalk','dog','velvetglow','reflective','black'] },
  { title: 'VelvetGlow Night Walk Set — Black | Large',   description: 'Visibility-focused design with The Velvet Tails luxury finish. Reflective dog set with enhanced night visibility. LED-compatible D-ring. Water-resistant velvet exterior. Premium safety hardware.', price: 299900, compareAtPrice: 349900, images: mkImg('nightwalk_black'),  category: 'Night Walk', size: 'Large',  color: 'Black',  inventory: 35, tags: ['nightwalk','dog','velvetglow','reflective','black'] },
  { title: 'VelvetGlow Night Walk Set — Brown | Small',   description: 'Visibility-focused design with The Velvet Tails luxury finish. Reflective dog set with enhanced night visibility. LED-compatible D-ring. Water-resistant velvet exterior. Premium safety hardware.', price: 279900, compareAtPrice: 329900, images: mkImg('nightwalk_brown'),  category: 'Night Walk', size: 'Small',  color: 'Brown',  inventory: 35, tags: ['nightwalk','dog','velvetglow','reflective','brown'] },
  { title: 'VelvetGlow Night Walk Set — Brown | Medium',  description: 'Visibility-focused design with The Velvet Tails luxury finish. Reflective dog set with enhanced night visibility. LED-compatible D-ring. Water-resistant velvet exterior. Premium safety hardware.', price: 289900, compareAtPrice: 339900, images: mkImg('nightwalk_brown'),  category: 'Night Walk', size: 'Medium', color: 'Brown',  inventory: 35, tags: ['nightwalk','dog','velvetglow','reflective','brown'] },
  { title: 'VelvetGlow Night Walk Set — Brown | Large',   description: 'Visibility-focused design with The Velvet Tails luxury finish. Reflective dog set with enhanced night visibility. LED-compatible D-ring. Water-resistant velvet exterior. Premium safety hardware.', price: 299900, compareAtPrice: 349900, images: mkImg('nightwalk_brown'),  category: 'Night Walk', size: 'Large',  color: 'Brown',  inventory: 35, tags: ['nightwalk','dog','velvetglow','reflective','brown'] },
  { title: 'VelvetGlow Night Walk Set — Orange | Small',  description: 'Visibility-focused design with The Velvet Tails luxury finish. Reflective dog set with enhanced night visibility. LED-compatible D-ring. Water-resistant velvet exterior. Premium safety hardware.', price: 279900, compareAtPrice: 329900, images: mkImg('nightwalk_orange'), category: 'Night Walk', size: 'Small',  color: 'Orange', inventory: 35, tags: ['nightwalk','dog','velvetglow','reflective','orange'] },
  { title: 'VelvetGlow Night Walk Set — Orange | Medium', description: 'Visibility-focused design with The Velvet Tails luxury finish. Reflective dog set with enhanced night visibility. LED-compatible D-ring. Water-resistant velvet exterior. Premium safety hardware.', price: 289900, compareAtPrice: 339900, images: mkImg('nightwalk_orange'), category: 'Night Walk', size: 'Medium', color: 'Orange', inventory: 35, tags: ['nightwalk','dog','velvetglow','reflective','orange'] },
  { title: 'VelvetGlow Night Walk Set — Orange | Large',  description: 'Visibility-focused design with The Velvet Tails luxury finish. Reflective dog set with enhanced night visibility. LED-compatible D-ring. Water-resistant velvet exterior. Premium safety hardware.', price: 299900, compareAtPrice: 349900, images: mkImg('nightwalk_orange'), category: 'Night Walk', size: 'Large',  color: 'Orange', inventory: 35, tags: ['nightwalk','dog','velvetglow','reflective','orange'] },

  // ── Playtime ─────────────────────────────────────────────────────────────────
  { title: 'VelvetChew Carrot Toy',             description: 'Designed for playful chewing and dental comfort, perfect for everyday engagement. Durable chew toy. Natural rubber material. Dental hygiene support. Satisfying texture for chewers.', price: 79900, images: mkImg('toy_generic'), category: 'Playtime', size: 'One Size', color: 'Orange', inventory: 100, tags: ['toy','dog','chew','dental'] },
  { title: 'VelvetBounce Play Ball',            description: 'A classic play essential designed for active and engaging play sessions. Encourages activity. Durable bounce material. High-visibility color. Easy to clean.', price: 69900, images: mkImg('toy_ball'),    category: 'Playtime', size: 'One Size', color: 'Mixed',  inventory: 100, tags: ['toy','dog','ball','fetch'] },
  { title: 'VelvetTug Duo Knot Rope',           description: 'Perfect for tug-of-war and bonding, supporting healthy chewing habits. Strong rope toy. Dual-knot design. Natural fiber construction. Encourages healthy play.', price: 89900, images: mkImg('toy_rope'),    category: 'Playtime', size: 'One Size', color: 'Mixed',  inventory: 100, tags: ['toy','dog','rope','tug'] },
  { title: 'VelvetTug Trio Knot Rope',          description: 'Built for powerful play, offering durability and enhanced grip. Heavy-duty rope. Extra grip design. Strong triple-knot construction. Ideal for energetic dogs.', price: 99900, images: mkImg('toy_rope'),    category: 'Playtime', size: 'One Size', color: 'Mixed',  inventory: 100, tags: ['toy','dog','rope','tug'] },
  { title: 'VelvetTug Classic Knot Toy',        description: 'A simple, everyday essential for chewing and play. Compact rope toy. Easy to carry. Daily play companion. Lightweight and durable.', price: 69900, images: mkImg('toy_rope'),    category: 'Playtime', size: 'One Size', color: 'Mixed',  inventory: 100, tags: ['toy','dog','rope','knot'] },
  { title: 'VelvetTug Knot Ball',               description: 'A perfect mix of fetch and tug for engaging playtime. Rope ball toy. Interactive play. Heart-shaped rope design. Satisfying for all play styles.', price: 79900, images: mkImg('toy_ball'),    category: 'Playtime', size: 'One Size', color: 'Mixed',  inventory: 100, tags: ['toy','dog','ball','rope'] },
  { title: 'VelvetChew Dumbbell Toy',           description: 'Encourages chewing strength while supporting dental health. Grip-friendly dumbbell shape. Dental support. Natural rubber. Perfect for power chewers.', price: 89900, images: mkImg('toy_generic'), category: 'Playtime', size: 'One Size', color: 'Mixed',  inventory: 100, tags: ['toy','dog','chew','dumbbell'] },
  { title: 'VelvetChew Slipper Toy',            description: 'A fun alternative to real shoes, designed for safe chewing. Shoe-shaped chew toy. Natural rubber construction. Safe and durable. Satisfying shoe chewing experience.', price: 79900, images: mkImg('toy_generic'), category: 'Playtime', size: 'One Size', color: 'Mixed',  inventory: 100, tags: ['toy','dog','chew','slipper'] },
  { title: 'VelvetChew Bone Toy',               description: 'A timeless chew toy reimagined for durability and comfort. Classic bone design. Long-lasting dental support. Natural rubber. Satisfying texture.', price: 79900, images: mkImg('toy_generic'), category: 'Playtime', size: 'One Size', color: 'Mixed',  inventory: 100, tags: ['toy','dog','chew','bone'] },
  { title: 'Velvet Play Nutty Nibbler Hamster',  description: 'Crafted from natural jute, this adorable hamster toy offers a satisfying chewing and play experience. Natural jute material. Eco-friendly. Irresistible hamster design.', price: 89900, images: mkImg('toy_generic'), category: 'Playtime', size: 'One Size', color: 'Brown',  inventory: 80, tags: ['toy','dog','jute','natural'] },
  { title: 'Velvet Play Savannah Spot Giraffe', description: 'A charming giraffe-shaped jute toy designed for interactive play, gentle chewing, and enriching your pet. Natural jute construction. Giraffe character design. Perfect for gentle chewers.', price: 89900, images: mkImg('toy_generic'), category: 'Playtime', size: 'One Size', color: 'Mixed',  inventory: 80, tags: ['toy','dog','jute','giraffe'] },
  { title: 'Velvet Play HeartLink Tug Ring',    description: 'A heart-shaped rope toy designed for tugging, tossing, and interactive play. Heart-shaped rope ring. Dual-function design. Durable rope construction. Interactive tug experience.', price: 99900, images: mkImg('toy_rope'),    category: 'Playtime', size: 'One Size', color: 'Mixed',  inventory: 80, tags: ['toy','dog','rope','tug','heart'] },
  { title: 'Velvet Play Trio Link Tug Toy',     description: 'Features three interconnected rope rings that create multiple gripping points. Triple-ring construction. Multiple grip options. Durable rope material. Interactive tugging experience.', price: 109900, images: mkImg('toy_rope'),   category: 'Playtime', size: 'One Size', color: 'Mixed',  inventory: 80, tags: ['toy','dog','rope','tug'] },
  { title: 'Velvet Play Double Fetch Tug',      description: 'Combines the excitement of tennis balls with the versatility of a rope toy. Dual-ball design. Strong rope core. Fetch and tug hybrid. Durable construction.', price: 109900, images: mkImg('toy_ball'),   category: 'Playtime', size: 'One Size', color: 'Mixed',  inventory: 80, tags: ['toy','dog','fetch','tug','ball'] },
  { title: 'Velvet Play Meadow Hop Bunny',      description: 'Made from durable natural jute, this bunny toy combines playful design with engaging texture for hours of fun. Natural jute bunny toy. Engaging texture. Eco-friendly materials.', price: 89900, images: mkImg('toy_generic'),  category: 'Playtime', size: 'One Size', color: 'Brown',  inventory: 80, tags: ['toy','dog','jute','bunny'] },
  { title: 'Velvet Play Everyday Play Bundle — Assorted', description: 'Keep your dog happy, active, and entertained every day with the Velvet Play Everyday Play Bundle. Curated toy set. Variety of textures and shapes. Daily entertainment. Great value bundle.', price: 249900, compareAtPrice: 349900, images: mkImg('toy_bundle'), category: 'Playtime', size: 'One Size', color: 'Mixed', inventory: 40, tags: ['toy','dog','bundle','set'] },
  { title: 'Velvet Play Wild Adventure Toy Pack — Assorted', description: 'Bring the thrill of the outdoors to every play session with the Velvet Play Wild Adventure Toy Pack. Adventurous toy collection. Durable outdoor-grade materials. Multiple play styles. Premium value pack.', price: 299900, compareAtPrice: 399900, images: mkImg('toy_bundle'), category: 'Playtime', size: 'One Size', color: 'Mixed', inventory: 40, tags: ['toy','dog','bundle','adventure'] },

  // ── Accessories ───────────────────────────────────────────────────────────────
  { title: 'VelvetCharm Bow Tie',                       description: 'An elegant finishing touch for special moments. Luxury dog accessory. Perfect for occasions. Easy clip-on attachment. Premium velvet fabric. Multiple color options.', price: 79900, images: mkImg('bowtie'),   category: 'Accessories', size: 'One Size', color: 'Mixed', inventory: 120, tags: ['accessory','dog','bowtie','formal'] },
  { title: 'Velvet Walk Guardian Tactical Collar — Small',  description: 'Combines strength, comfort, and reliability with premium hardware. Heavy-duty hardware. Tactical design. Multiple attachment points. Weather-resistant. Professional-grade construction.', price: 199900, images: mkImg('tactical'), category: 'Accessories', size: 'Small',  color: 'Black', inventory: 50, tags: ['collar','dog','tactical','guardian'] },
  { title: 'Velvet Walk Guardian Tactical Collar — Medium', description: 'Combines strength, comfort, and reliability with premium hardware. Heavy-duty hardware. Tactical design. Multiple attachment points. Weather-resistant. Professional-grade construction.', price: 209900, images: mkImg('tactical'), category: 'Accessories', size: 'Medium', color: 'Black', inventory: 50, tags: ['collar','dog','tactical','guardian'] },
  { title: 'Velvet Walk Guardian Tactical Collar — Large',  description: 'Combines strength, comfort, and reliability with premium hardware. Heavy-duty hardware. Tactical design. Multiple attachment points. Weather-resistant. Professional-grade construction.', price: 219900, images: mkImg('tactical'), category: 'Accessories', size: 'Large',  color: 'Black', inventory: 50, tags: ['collar','dog','tactical','guardian'] },
  { title: 'Velvet Walk Dapper Bow Collar — Small',   description: 'A stylish and comfortable bow collar designed to add elegance. Fashionable bow design. Comfortable everyday wear. Secure buckle clasp. Premium fabric finish.', price: 129900, images: mkImg('bow_collar'), category: 'Accessories', size: 'Small',  color: 'Mixed', inventory: 60, tags: ['collar','dog','bow','dapper'] },
  { title: 'Velvet Walk Dapper Bow Collar — Medium',  description: 'A stylish and comfortable bow collar designed to add elegance. Fashionable bow design. Comfortable everyday wear. Secure buckle clasp. Premium fabric finish.', price: 139900, images: mkImg('bow_collar'), category: 'Accessories', size: 'Medium', color: 'Mixed', inventory: 60, tags: ['collar','dog','bow','dapper'] },
  { title: 'Velvet Walk Dapper Bow Collar — Large',   description: 'A stylish and comfortable bow collar designed to add elegance. Fashionable bow design. Comfortable everyday wear. Secure buckle clasp. Premium fabric finish.', price: 149900, images: mkImg('bow_collar'), category: 'Accessories', size: 'Large',  color: 'Mixed', inventory: 60, tags: ['collar','dog','bow','dapper'] },
  { title: 'Velvet Walk SafeGlow Reflective Collar — Small',  description: 'Designed to enhance visibility during low-light walks. Reflective safety strip. Improved night visibility. Durable nylon webbing. Bright reflective stitching. Secure quick-release buckle.', price: 149900, images: mkImg('safeglow'), category: 'Accessories', size: 'Small',  color: 'Mixed', inventory: 70, tags: ['collar','dog','reflective','safety'] },
  { title: 'Velvet Walk SafeGlow Reflective Collar — Medium', description: 'Designed to enhance visibility during low-light walks. Reflective safety strip. Improved night visibility. Durable nylon webbing. Bright reflective stitching. Secure quick-release buckle.', price: 159900, images: mkImg('safeglow'), category: 'Accessories', size: 'Medium', color: 'Mixed', inventory: 70, tags: ['collar','dog','reflective','safety'] },
  { title: 'Velvet Walk SafeGlow Reflective Collar — Large',  description: 'Designed to enhance visibility during low-light walks. Reflective safety strip. Improved night visibility. Durable nylon webbing. Bright reflective stitching. Secure quick-release buckle.', price: 169900, images: mkImg('safeglow'), category: 'Accessories', size: 'Large',  color: 'Mixed', inventory: 70, tags: ['collar','dog','reflective','safety'] },
  { title: 'Velvet Walk Everyday Comfort Collar — Small',  description: 'A reliable daily-wear collar offering a secure fit. Padded comfort lining. Durable webbing construction. Adjustable secure fit. Classic design for everyday use. Comfortable all-day wear.', price: 99900, images: mkImg('everyday'), category: 'Accessories', size: 'Small',  color: 'Mixed', inventory: 100, tags: ['collar','dog','everyday','comfort'] },
  { title: 'Velvet Walk Everyday Comfort Collar — Medium', description: 'A reliable daily-wear collar offering a secure fit. Padded comfort lining. Durable webbing construction. Adjustable secure fit. Classic design for everyday use. Comfortable all-day wear.', price: 109900, images: mkImg('everyday'), category: 'Accessories', size: 'Medium', color: 'Mixed', inventory: 100, tags: ['collar','dog','everyday','comfort'] },
  { title: 'Velvet Walk Everyday Comfort Collar — Large',  description: 'A reliable daily-wear collar offering a secure fit. Padded comfort lining. Durable webbing construction. Adjustable secure fit. Classic design for everyday use. Comfortable all-day wear.', price: 119900, images: mkImg('everyday'), category: 'Accessories', size: 'Large',  color: 'Mixed', inventory: 100, tags: ['collar','dog','everyday','comfort'] },
];

// ─── CAT PRODUCTS (dummy set — same schema, cat-specific categories) ───────────

const CAT_PRODUCTS = [
  // Collars & Harnesses
  { title: 'VelvetPurr Breakaway Collar — Rose | Small',  description: 'Safety-first design with a quick-release breakaway buckle — ideal for curious cats. Soft velvet lining. Adjustable fit for comfort. Bell included for gentle alerting. Lightweight and cat-safe.', price: 89900, images: mkImg('cat_collar'),  category: 'Cat Collars', size: 'Small',  color: 'Rose',   inventory: 80, tags: ['cat','collar','breakaway','safety'] },
  { title: 'VelvetPurr Breakaway Collar — Lavender | Small', description: 'Safety-first design with a quick-release breakaway buckle — ideal for curious cats. Soft velvet lining. Adjustable fit for comfort. Bell included for gentle alerting. Lightweight and cat-safe.', price: 89900, images: mkImg('cat_collar'),  category: 'Cat Collars', size: 'Small',  color: 'Lavender', inventory: 80, tags: ['cat','collar','breakaway','lavender'] },
  { title: 'VelvetPurr Breakaway Collar — Teal | Small',  description: 'Safety-first design with a quick-release breakaway buckle — ideal for curious cats. Soft velvet lining. Adjustable fit for comfort. Bell included for gentle alerting. Lightweight and cat-safe.', price: 89900, images: mkImg('cat_collar'),  category: 'Cat Collars', size: 'Small',  color: 'Teal',   inventory: 80, tags: ['cat','collar','breakaway','teal'] },
  { title: 'VelvetPurr Breakaway Collar — Black | Small', description: 'Safety-first design with a quick-release breakaway buckle — ideal for curious cats. Soft velvet lining. Adjustable fit for comfort. Bell included for gentle alerting. Lightweight and cat-safe.', price: 89900, images: mkImg('cat_collar'),  category: 'Cat Collars', size: 'Small',  color: 'Black',  inventory: 80, tags: ['cat','collar','breakaway','black'] },

  { title: 'VelvetEscape Cat Harness & Lead Set — Small',  description: 'Walk your cat in style and safety. Escape-proof design with full-body coverage. Soft padded interior. Lightweight lead included. Reflective trim for visibility. Perfect for adventurous cats.', price: 179900, compareAtPrice: 219900, images: mkImg('cat_harness'), category: 'Cat Collars', size: 'Small',  color: 'Mixed', inventory: 45, tags: ['cat','harness','lead','escape-proof'] },
  { title: 'VelvetEscape Cat Harness & Lead Set — Medium', description: 'Walk your cat in style and safety. Escape-proof design with full-body coverage. Soft padded interior. Lightweight lead included. Reflective trim for visibility. Perfect for adventurous cats.', price: 189900, compareAtPrice: 229900, images: mkImg('cat_harness'), category: 'Cat Collars', size: 'Medium', color: 'Mixed', inventory: 45, tags: ['cat','harness','lead','escape-proof'] },

  // Cat Toys
  { title: 'VelvetFlick Feather Wand Toy',         description: 'Captivating feather wand that ignites natural hunting instincts. Irresistible feather tips. Flexible wand for dynamic movement. Hours of interactive play. Strengthens the cat-owner bond.', price: 79900, images: mkImg('cat_toy_feather'), category: 'Cat Toys', size: 'One Size', color: 'Mixed',    inventory: 120, tags: ['cat','toy','feather','interactive'] },
  { title: 'VelvetSpin Crinkle Ball Set — 6 Pack',  description: 'Lightweight crinkle balls that satisfy pounce, bat, and carry instincts. Irresistible crinkle sound. Lightweight and rollable. Set of 6 in mixed colors. Easy to store.', price: 89900, images: mkImg('cat_toy_ball'),    category: 'Cat Toys', size: 'One Size', color: 'Assorted', inventory: 120, tags: ['cat','toy','ball','crinkle'] },
  { title: 'VelvetDangle Teaser Wand',              description: 'A dynamic teaser wand with interchangeable dangling attachments. Sparks natural play behavior. Three interchangeable lures. Extendable wand for reach. Stimulates mind and body.', price: 99900, images: mkImg('cat_toy_wand'),    category: 'Cat Toys', size: 'One Size', color: 'Mixed',    inventory: 100, tags: ['cat','toy','wand','teaser'] },
  { title: 'VelvetChase Electronic Mouse Toy',      description: 'An automatic moving mouse toy that keeps cats entertained for hours. Random movement patterns. USB rechargeable. Silent motor. Auto shut-off after 10 minutes. Great for solo play.', price: 149900, compareAtPrice: 199900, images: mkImg('cat_toy_ball'), category: 'Cat Toys', size: 'One Size', color: 'Grey', inventory: 60, tags: ['cat','toy','electronic','mouse'] },
  { title: 'VelvetPounce Catnip Kicker — Set of 2', description: 'Plush kicker toys filled with premium catnip to drive cats wild. Premium organic catnip filling. Durable plush exterior. Satisfying kicking and bunny-kick target. Perfect stress reliever for cats.', price: 119900, images: mkImg('cat_toy_feather'), category: 'Cat Toys', size: 'One Size', color: 'Mixed', inventory: 90, tags: ['cat','toy','catnip','kicker'] },

  // Cat Accessories
  { title: 'VelvetNest Donut Cat Bed — Small',  description: 'A plush, donut-shaped bed that cradles your cat in ultimate comfort. Memory foam base. Ultra-soft velvet exterior. Removable washable cover. Anti-slip bottom. Perfect for curlers and nesters.', price: 299900, compareAtPrice: 349900, images: mkImg('cat_bed'),       category: 'Cat Accessories', size: 'Small',  color: 'Blush',    inventory: 30, tags: ['cat','bed','donut','comfort'] },
  { title: 'VelvetNest Donut Cat Bed — Large',  description: 'A plush, donut-shaped bed that cradles your cat in ultimate comfort. Memory foam base. Ultra-soft velvet exterior. Removable washable cover. Anti-slip bottom. Perfect for curlers and nesters.', price: 349900, compareAtPrice: 399900, images: mkImg('cat_bed'),       category: 'Cat Accessories', size: 'Large',  color: 'Blush',    inventory: 25, tags: ['cat','bed','donut','comfort'] },
  { title: 'VelvetScratch Sisal Post — Medium', description: 'Premium sisal scratching post that protects your furniture and satisfies natural scratching instincts. Heavy sisal wrapping. Sturdy weighted base. Ideal height for stretching. Durable long-lasting build.', price: 249900, compareAtPrice: 299900, images: mkImg('cat_scratcher'), category: 'Cat Accessories', size: 'Medium', color: 'Natural', inventory: 40, tags: ['cat','scratcher','sisal','post'] },
  { title: 'VelvetGlow Cat Bandana — Adjustable', description: 'A stylish adjustable bandana that adds personality to every cat. Soft velvet fabric. Easy tie adjustment. Photoshoot-ready. Breathable and lightweight. Available in mixed seasonal prints.', price: 69900, images: mkImg('cat_bandana'),   category: 'Cat Accessories', size: 'One Size', color: 'Mixed',   inventory: 150, tags: ['cat','accessory','bandana','style'] },
  { title: 'VelvetCharm Cat ID Tag — Gold',      description: 'A premium engraved-style ID tag that keeps your cat identifiable in style. Gold-finish hardware. Lightweight disc. Laser-engraved design template. Includes split ring. Pairs with any collar.', price: 49900, images: mkImg('cat_bandana'),   category: 'Cat Accessories', size: 'One Size', color: 'Gold',   inventory: 200, tags: ['cat','id','tag','accessory'] },
];

// ─── Runner ────────────────────────────────────────────────────────────────────

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // ── 1. Remove all existing Velvet Tails catalog products ──────────────────
    const dogCategories  = ['Collars & Harnesses', 'Leashes & Leads', 'Night Walk', 'Playtime', 'Accessories'];
    const catCategories  = ['Cat Collars', 'Cat Toys', 'Cat Accessories'];
    const allCategories  = [...dogCategories, ...catCategories];

    const deleted = await Product.deleteMany({ category: { $in: allCategories } });
    console.log(`🗑  Removed ${deleted.deletedCount} existing product(s) in target categories`);

    // ── 2. Add dimensions to every product record ─────────────────────────────
    const withDimensions = [...DOG_PRODUCTS, ...CAT_PRODUCTS].map((p) => ({
      ...p,
      dimensions: DIM,
    }));

    // ── 3. Insert new catalog ─────────────────────────────────────────────────
    const inserted = await Product.insertMany(withDimensions, { ordered: false });

    const dogCount = inserted.filter(p => dogCategories.includes(p.category)).length;
    const catCount = inserted.filter(p => catCategories.includes(p.category)).length;

    console.log('\n🐶 Dog products inserted:');
    for (const cat of dogCategories) {
      const n = inserted.filter(p => p.category === cat).length;
      console.log(`   • ${cat}: ${n} item(s)`);
    }
    console.log('\n🐱 Cat products inserted:');
    for (const cat of catCategories) {
      const n = inserted.filter(p => p.category === cat).length;
      console.log(`   • ${cat}: ${n} item(s)`);
    }

    console.log(`\n✅ Total inserted: ${inserted.length} (${dogCount} dog, ${catCount} cat)`);
    console.log(`   Sample product ID: ${inserted[0]._id}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();
