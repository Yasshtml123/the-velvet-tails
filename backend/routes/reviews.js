import express from 'express';
import Review from '../models/Review.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews/product/:productId
// Fetch all reviews for a specific product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .sort({ createdAt: -1 })
      .lean();

    // Map to match the frontend's expected format
    const getInitials = (name) => name?.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?';

    const formattedReviews = reviews.map(r => ({
      id: r._id.toString(),
      author: r.userName,
      pet: r.petName || '—',
      avatar: getInitials(r.userName),
      date: new Date(r.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      rating: r.rating,
      verified: r.verified ?? true,
      text: r.comment,
      isUserSubmitted: false,
      userId: r.user?.toString()
    }));

    res.json({ reviews: formattedReviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
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

    const review = await Review.create({
      productId,
      user: req.user._id,
      userName: req.user.name,
      petName: petName?.trim() || '',
      rating: Number(rating),
      comment: comment.trim()
    });

    // Format response to instantly append in frontend
    const getInitials = (name) => name?.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('') || '?';
    const formattedReview = {
      id: review._id.toString(),
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
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
