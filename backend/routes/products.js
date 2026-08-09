import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();


// Quick node-cache or simple memory cache
let cachedProducts = null;
let lastFetch = 0;
// GET /api/products?limit=20&category=...&q=...
router.get('/', async (req, res) => {
  try {

    const now = Date.now();
    // Serve from memory if cache is fresh (< 10 seconds old) and no query params
  if (cachedProducts && (now - lastFetch < 10000) && !req.query.q && !req.query.category) {
    return res.json({ items: cachedProducts });
  }


    const { limit = 20, category, q } = req.query;
    const filter = {};

    if (category) filter.category = category;

    // Use MongoDB Text Search instead of slow RegExp scans
    if (q) {
      filter.$text = { $search: q };
    }

    // .lean() skips Mongoose document hydration for massive speedups
    const items = await Product.find(filter)
      .limit(Math.min(parseInt(limit) || 20, 100)) // Cap limit to prevent memory exhaustion
      .lean();

    if (!req.query.q && !req.query.category) {
    cachedProducts = items;
    lastFetch = now;
  }

    res.json({ items });


   // if (q) filter.$or = [{ title: new RegExp(q,'i') }, { description: new RegExp(q,'i') }];
    
 //   const items = await Product.find(filter).limit(parseInt(limit));
    //res.json({ items });
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Failed to fetch products. Please try again.' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const cats = await Product.distinct('category');
    res.json({ categories: cats });
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ error: 'Failed to fetch categories. Please try again.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if it's a valid MongoDB ObjectId format (24 hex characters)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    let query;
    if (isValidObjectId) {
      query = { _id: id };      // Only check _id
    } else {
      query = { slug: id };     // Only check slug
    }
    
    const p = await Product.findOne(query);
    
    if (!p) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ product: p });
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Failed to fetch product. Please try again.' });
  }
});

export default router;
