const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { optionalAuth } = require('../middleware/auth');

// Get articles list with category filter and search
router.get('/', async (req, res, next) => {
  try {
    const { category, search, limit = 20, page = 1 } = req.query;

    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ title: regex }, { shortDescription: regex }, { tags: regex }];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Article.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      articles
    });
  } catch (err) {
    next(err);
  }
});

// Get article by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    // Increment view count
    article.viewCount += 1;
    await article.save();

    // Fetch related articles in the same category
    const related = await Article.find({
      category: article.category,
      _id: { $ne: article._id }
    }).limit(3);

    res.json({
      success: true,
      article,
      related
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
