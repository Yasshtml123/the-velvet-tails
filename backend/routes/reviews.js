import express from 'express';
import pool from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews/product/:productId
// Fetch all reviews for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const [reviews] = await pool.query(
      'SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE product_id = ? ORDER BY created_at DESC',
      [req.params.productId]
    );
    
    // Map them to match the frontend's expected format
    const formattedReviews = reviews.map(r => {
      // Create initial avatar (e.g., John Doe -> JD)
      const getInitials = (name) => name?.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?';
      
      return {
        id: r.id.toString(),
        author: r.user_name,
        pet: r.pet_name || '—', // Since pet_name isn't in the schema, it will fallback to '—'
        avatar: getInitials(r.user_name),
        date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        rating: r.rating,
        verified: true,
        text: r.comment,
        isUserSubmitted: false, // Handled client side
        userId: r.user_id?.toString()
      };
    });

    res.json({ reviews: formattedReviews });
  } catch (error) {
    console.error('Error fetching reviews (MySQL):', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// POST /api/reviews
// Create a new review
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, rating, comment, petName } = req.body;

    // Validation
    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: 'Product ID, rating, and comment are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const [result] = await pool.query(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [productId, req.user._id, Number(rating), comment.trim()]
    );

    // Format response to instantly append in frontend
    const getInitials = (name) => name?.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?';
    const formattedReview = {
      id: result.insertId.toString(),
      author: req.user.name,
      pet: petName?.trim() || '—',
      avatar: getInitials(req.user.name),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      rating: Number(rating),
      verified: true,
      text: comment.trim(),
      isUserSubmitted: true,
      userId: req.user._id.toString()
    };

    res.status(201).json({ review: formattedReview });
  } catch (error) {
    console.error('Error creating review (MySQL):', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
