import fs from 'fs';
import path from 'path';

// Parse transcript to get the OCR text
const ocrTextPath = 'd:\\\\Users\\\\Tamer\\\\Downloads\\\\theVelvetTails\\\\ocr.txt';
let ocrText = fs.readFileSync(ocrTextPath, 'utf-8');

// Clean up OCR text (remove page headers/footers)
ocrText = ocrText.replace(/==Screenshot for page \d+==/g, '');
ocrText = ocrText.replace(/==Start of OCR for page \d+==/g, '');
ocrText = ocrText.replace(/==End of OCR for page \d+==/g, '');
// Remove the header line
ocrText = ocrText.replace(/_id title description price images\[0\].url images\[1\].url images\[2\].url images\[3\].url image\s*/g, '');
// Remove the "Product Data" title if it's there
ocrText = ocrText.replace(/Product Data/g, '');

const products = [];

// A regex to match a product row. It starts with a 24-char hex string, followed by text until the next 24-char hex string.
// We can split the string by the 24-char hex string.
const idRegex = /(?=[0-9a-f]{24}\b)/;
const chunks = ocrText.split(idRegex).filter(chunk => chunk.trim().length > 0);

chunks.forEach(chunk => {
  chunk = chunk.trim();
  const idMatch = chunk.match(/^([0-9a-f]{24})/);
  if (!idMatch) return;
  const _id = idMatch[1];
  let rest = chunk.substring(24).trim();

  // Try to extract URLs. The URLs are mostly Cloudinary. 
  // Let's find all http/https URLs.
  const urls = [];
  const urlRegex = /https?:\/\/[^\s]+/g;
  let match;
  while ((match = urlRegex.exec(rest)) !== null) {
    urls.push(match[0]);
  }
  
  // Remove URLs from rest
  rest = rest.replace(urlRegex, '').trim();
  // Remove 'nan' which indicates no image
  rest = rest.replace(/\bnan\b/g, ' ').trim();

  // Now the rest contains: Title, Description, Price.
  // The price is usually a 3 or 4 digit number before the first URL.
  // Let's find the price: it's typically the last number in the text before URLs, 
  // but since we removed URLs, it might be at the end, or mixed. 
  // Wait, in the OCR: "Ideal for daily wear 349 https://..."
  // So the price is the last token(s) before the URLs.
  // Let's go back to the original chunk for better parsing.

  let originalRest = chunk.substring(24).trim();
  // Find price which is right before the first http
  let priceMatch = originalRest.match(/\s(\d+)\s+https?:\/\//);
  let price = 0;
  if (priceMatch) {
    price = parseInt(priceMatch[1], 10) * 100; // paise
  } else {
    // If not found this way, maybe it's just before 'nan'?
    priceMatch = originalRest.match(/\s(\d+)\s+nan/);
    if (priceMatch) {
        price = parseInt(priceMatch[1], 10) * 100;
    } else {
        // Fallback: look for 299, 349, 399, 449, 499, 549, 599, 649, 699, 799, 999, 1199
        let fallback = originalRest.match(/\s(249|299|349|399|449|499|549|599|649|699|799|899|999|1099|1199)\s/);
        if (fallback) {
            price = parseInt(fallback[1], 10) * 100;
        }
    }
  }

  // Extract title and description
  // The title is the first few lines, description is after.
  // We know the price is at the end of the description.
  // Let's split by newline.
  let textBeforeUrls = originalRest.split(/https?:\/\//)[0].trim();
  // Remove the price from the end
  textBeforeUrls = textBeforeUrls.replace(/\s+\d+\s*$/, '').trim();

  // The title might be on multiple lines. But mostly it's things like:
  // "VelvetFur\nComfort\nCollar - Red |\nSmall"
  // Let's assume title is everything before "Plush softness", "Designed for", "A gentle", "A stylish", "Built for", etc.
  // Or we can just look for the first occurrence of common description starters:
  const descStarters = [
    "Plush softness", "Designed for", "A gentle", "An elegant", "A classic",
    "Perfect for", "Built for", "A simple", "A perfect", "Encourages",
    "A fun", "for safe chewing", "A timeless", "Crafted from", "A charming",
    "A heart-shaped", "Features three", "Combines strength", "Built for everyday",
    "Combines the", "rope toy.", "A stylish", "Visibility-focused", "Comfortable daily",
    "Made from durable", "Keep your dog", "Play Ball for", "construction for", "Bring the thrill",
    "toy that helps"
  ];
  
  let descStartIndex = -1;
  for (const starter of descStarters) {
    const idx = textBeforeUrls.indexOf(starter);
    if (idx !== -1 && (descStartIndex === -1 || idx < descStartIndex)) {
      descStartIndex = idx;
    }
  }

  let title = '';
  let description = '';
  if (descStartIndex !== -1) {
    title = textBeforeUrls.substring(0, descStartIndex).replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    description = textBeforeUrls.substring(descStartIndex).replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  } else {
    // Fallback: first 50 chars?
    title = textBeforeUrls.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    description = title; // fallback
  }

  // Fix up title replacing hyphens properly
  title = title.replace(/-\s*/g, '— '); // em dash for consistency
  title = title.replace(/\|\s*/g, '| ');

  // Determine Category, Size, Color based on title
  let category = 'Accessories';
  let size = 'One Size';
  let color = 'Mixed';
  
  if (title.toLowerCase().includes('collar')) {
    category = 'Collars & Harnesses';
  }
  if (title.toLowerCase().includes('harness')) {
    category = 'Collars & Harnesses';
  }
  if (title.toLowerCase().includes('leash')) {
    category = 'Leashes & Leads';
  }
  if (title.toLowerCase().includes('night walk')) {
    category = 'Night Walk';
  }
  if (title.toLowerCase().includes('toy') || title.toLowerCase().includes('ball') || title.toLowerCase().includes('rope') || title.toLowerCase().includes('bundle') || title.toLowerCase().includes('hamster') || title.toLowerCase().includes('giraffe') || title.toLowerCase().includes('bunny') || title.toLowerCase().includes('pack')) {
    category = 'Playtime';
  }
  if (title.toLowerCase().includes('bow') && !title.toLowerCase().includes('collar')) {
    category = 'Accessories';
  }
  if (title.toLowerCase().includes('tactical') || title.toLowerCase().includes('safeglow') || title.toLowerCase().includes('everyday')) {
    if (!category.includes('Night Walk')) {
        category = 'Accessories';
    }
  }

  // Sizes
  if (title.toLowerCase().includes('| small')) size = 'Small';
  if (title.toLowerCase().includes('| medium')) size = 'Medium';
  if (title.toLowerCase().includes('| large')) size = 'Large';
  if (title.toLowerCase().includes('— small')) size = 'Small';
  if (title.toLowerCase().includes('— medium')) size = 'Medium';
  if (title.toLowerCase().includes('— large')) size = 'Large';

  // Colors
  const colors = ['Red', 'Brown', 'Black', 'Blue', 'Orange'];
  for (const c of colors) {
    if (title.includes(c)) {
      color = c;
      break;
    }
  }

  // Prepare images array
  const images = urls.map((url, i) => ({
    url: url.trim(),
    publicId: `vt_img_${_id}_${i}`
  }));

  products.push({
    _id,
    title,
    description: description.replace(/\\r\\n/g, ' ').replace(/\s+/g, ' ').trim(),
    price,
    images: images.length > 0 ? images : [{url: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=600&fit=crop&q=80', publicId: 'vt_placeholder'}],
    category,
    size,
    color,
    inventory: Math.floor(Math.random() * 50) + 20, // dummy inventory
    tags: ['dog', category.split(' ')[0].toLowerCase()],
    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    dimensions: { length: 30, breadth: 5, height: 3, weight: 0.3 }
  });
});

console.log(`Parsed ${products.length} dog products.`);

// Cat products dummy array (we can reuse the one from the previous step)
const CAT_PRODUCTS = [
  { _id: 'cat001a', title: 'VelvetPurr Breakaway Collar — Rose | Small', description: 'Safety-first design with a quick-release breakaway buckle.', price: 89900, images: [{url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop&q=80', publicId: 'vt_cat_1'}], category: 'Cat Collars', size: 'Small', color: 'Rose', inventory: 80, tags: ['cat','collar'], slug: 'velvetpurr-collar-rose-small', dimensions: { length: 30, breadth: 5, height: 3, weight: 0.3 } },
  { _id: 'cat002a', title: 'VelvetFlick Feather Wand Toy', description: 'Captivating feather wand that ignites natural hunting instincts.', price: 79900, images: [{url: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&h=600&fit=crop&q=80', publicId: 'vt_cat_2'}], category: 'Cat Toys', size: 'One Size', color: 'Mixed', inventory: 120, tags: ['cat','toy'], slug: 'velvetflick-feather-wand', dimensions: { length: 30, breadth: 5, height: 3, weight: 0.3 } },
  { _id: 'cat003a', title: 'VelvetNest Donut Cat Bed — Small', description: 'A plush, donut-shaped bed that cradles your cat in ultimate comfort.', price: 299900, images: [{url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop&q=80', publicId: 'vt_cat_3'}], category: 'Cat Accessories', size: 'Small', color: 'Blush', inventory: 30, tags: ['cat','bed'], slug: 'velvetnest-donut-bed-small', dimensions: { length: 30, breadth: 5, height: 3, weight: 0.3 } }
];

const allProducts = [...products, ...CAT_PRODUCTS];

// Generate the output products.js file
const outputContent = `/**
 * products.js — Static product catalog for The Velvet Tails (Parsed from PDF)
 */

export const PRODUCTS = ${JSON.stringify(allProducts, null, 2)};

export const CATEGORIES = [...new Set(PRODUCTS.map(p => p.category))];

export function filterProducts({ category, search } = {}) {
  let result = PRODUCTS;
  if (category) result = result.filter(p => p.category === category);
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(p => 
      p.title.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) || 
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }
  // Sort newer products first for NewArrivals
  return result.reverse();
}

export function findProduct(idOrSlug) {
  return PRODUCTS.find(p => p._id === idOrSlug || p.slug === idOrSlug);
}
`;

fs.writeFileSync(path.join('d:\\Users\\Tamer\\Downloads\\theVelvetTails\\frontend\\src\\data\\products.js'), outputContent, 'utf-8');
console.log('Successfully wrote src/data/products.js');
