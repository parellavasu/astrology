const express = require('express');
const router = express.Router();
const Astrologer = require('../models/Astrologer');
const Review = require('../models/Review');
const { auth, optionalAuth } = require('../middleware/auth');

// Get all astrologers with rich filters and sorting
router.get('/', async (req, res, next) => {
  try {
    const { specialization, language, maxPrice, minRating, isOnline, search, sort = 'rating' } = req.query;

    const query = { isVerified: true };

    if (specialization) {
      query.specializations = { $regex: new RegExp(specialization, 'i') };
    }

    if (language) {
      query.languages = { $regex: new RegExp(language, 'i') };
    }

    if (maxPrice) {
      query.perMinuteRate = { $lte: Number(maxPrice) };
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (isOnline === 'true') {
      query.isOnline = true;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { displayName: searchRegex },
        { bio: searchRegex },
        { specializations: searchRegex },
        { skills: searchRegex }
      ];
    }

    let sortObj = { rating: -1, reviewCount: -1 };
    if (sort === 'price_asc') sortObj = { perMinuteRate: 1 };
    else if (sort === 'price_desc') sortObj = { perMinuteRate: -1 };
    else if (sort === 'experience') sortObj = { experienceYears: -1 };

    const astrologers = await Astrologer.find(query).sort(sortObj);

    res.json({
      success: true,
      count: astrologers.length,
      astrologers
    });
  } catch (err) {
    next(err);
  }
});

// Get single astrologer by ID with reviews
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const astrologer = await Astrologer.findById(req.params.id);
    if (!astrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer profile not found.' });
    }

    const reviews = await Review.find({ astrologer: astrologer._id }).sort({ createdAt: -1 }).limit(20);

    res.json({
      success: true,
      astrologer,
      reviews
    });
  } catch (err) {
    next(err);
  }
});

// Add a review for an astrologer
router.post('/:id/reviews', auth, async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required.' });
    }

    const astrologer = await Astrologer.findById(req.params.id);
    if (!astrologer) {
      return res.status(404).json({ success: false, message: 'Astrologer not found.' });
    }

    const review = new Review({
      user: req.user._id,
      astrologer: astrologer._id,
      userName: req.user.name,
      rating: Number(rating),
      comment
    });

    await review.save();

    // Recalculate average rating
    const allReviews = await Review.find({ astrologer: astrologer._id });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    astrologer.rating = parseFloat(avgRating.toFixed(1));
    astrologer.reviewCount = allReviews.length;
    await astrologer.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted with thanks.',
      review
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
