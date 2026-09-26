const mongoose = require('mongoose');
const User = require('../models/User');
const Astrologer = require('../models/Astrologer');
const Article = require('../models/Article');
const Review = require('../models/Review');
const Horoscope = require('../models/Horoscope');
const BirthProfile = require('../models/BirthProfile');
const Kundli = require('../models/Kundli');
const { calculateKundli } = require('../services/astrologyEngine');

async function seedDatabase() {
  console.log('🌟 Seeding JyotirVeda Database with authentic Vedic astrology data...');

  // 1. Create Admin User
  let admin = await User.findOne({ email: 'admin@jyotirveda.com' });
  if (!admin) {
    admin = new User({
      name: 'Acharya Vidyadhar (Admin)',
      email: 'admin@jyotirveda.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 98765 43210',
      walletBalance: 25000
    });
    await admin.save();
    console.log('✅ Admin user created: admin@jyotirveda.com / Admin@123');
  }

  // 2. Create Demo User
  let demoUser = await User.findOne({ email: 'user@jyotirveda.com' });
  if (!demoUser) {
    demoUser = new User({
      name: 'Aditya Sharma',
      email: 'user@jyotirveda.com',
      password: 'User@123',
      role: 'user',
      phone: '+91 98111 22334',
      walletBalance: 1500
    });
    await demoUser.save();
    console.log('✅ Demo user created: user@jyotirveda.com / User@123');
  }

  // 3. Create Astrologers
  const astrologerCount = await Astrologer.countDocuments();
  if (astrologerCount === 0) {
    const astrologersData = [
      {
        displayName: 'Acharya Ramanuj Shastri',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        bio: 'Gold medalist from Sampurnanand Sanskrit Vishwavidyalaya, Varanasi. Over 22 years of profound experience in Parashari Vedic Astrology, Muhurat, and Brihat Samhita remedies.',
        title: 'Master of Vedic & Parashari Jyotish',
        specializations: ['Vedic Astrology', 'Kundli Milan', 'Career Astrologer', 'Muhurat'],
        languages: ['English', 'Hindi', 'Sanskrit'],
        experienceYears: 22,
        rating: 4.96,
        reviewCount: 480,
        consultationsCount: 4200,
        perMinuteRate: 35,
        isVerified: true,
        isOnline: true,
        skills: ['Parashari Hora', 'Kundli Milan', 'Gomed & Pukhraj Gemology', 'Kuja Dosha Nivaran']
      },
      {
        displayName: 'Vidushi Gayatri Devi',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        bio: 'Specialist in KP Astrology, Jaimini Sutras, and relationship healing. Empowering seekers for 16 years with precise timing of marriage, career promotions, and spiritual sadhana.',
        title: 'Senior Krishnamurti Paddhati (KP) Expert',
        specializations: ['KP Astrology', 'Marriage', 'Relationships', 'Tarot'],
        languages: ['English', 'Hindi', 'Gujarati'],
        experienceYears: 16,
        rating: 4.92,
        reviewCount: 310,
        consultationsCount: 2850,
        perMinuteRate: 30,
        isVerified: true,
        isOnline: true,
        skills: ['Cusp Sub-Lord Analysis', 'Prashna Kundli', 'Jaimini Karakas', 'Saptarishi Dasha']
      },
      {
        displayName: 'Pandit Devavrat Joshi',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Hereditary Jyotishi from Ujjain with deep expertise in Vastu Shastra, commercial energy alignment, and planetary mantra sadhana. Advisory to corporate leaders and founders.',
        title: 'Vastu & Vedic Business Consultant',
        specializations: ['Vastu', 'Vedic Astrology', 'Finance', 'Career'],
        languages: ['English', 'Hindi', 'Marathi'],
        experienceYears: 19,
        rating: 4.88,
        reviewCount: 220,
        consultationsCount: 1920,
        perMinuteRate: 40,
        isVerified: true,
        isOnline: true,
        skills: ['Commercial Vastu', 'Mahadasha Remedies', 'Wealth Yogas', 'Business Opening Muhurat']
      },
      {
        displayName: 'Dr. Meenakshi Sundaram',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
        bio: 'Ph.D. in Traditional Indian Astrology with over 14 years advising on higher education, medical astrology (Ayur-Jyotish), and children’s educational potential.',
        title: 'Ayur-Jyotish & Education Astrologer',
        specializations: ['Vedic Astrology', 'Education', 'Health', 'Numerology'],
        languages: ['English', 'Tamil', 'Telugu', 'Hindi'],
        experienceYears: 14,
        rating: 4.94,
        reviewCount: 195,
        consultationsCount: 1640,
        perMinuteRate: 28,
        isVerified: true,
        isOnline: false,
        skills: ['Pancha Mahapurusha Yogas', 'Ayur-Jyotish', '5th House Analysis', 'Chaldean Numerology']
      },
      {
        displayName: 'Acharya Bhrigu Narayan',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        bio: 'Expert in Nadi Astrology and palm leaf deciphering traditions. Known for accurate life milestone mapping and deep philosophical counseling.',
        title: 'Nadi Astrology & Karma Specialist',
        specializations: ['Nadi Astrology', 'Vedic Astrology', 'Remedies', 'Relationships'],
        languages: ['English', 'Hindi', 'Bengali'],
        experienceYears: 25,
        rating: 4.97,
        reviewCount: 540,
        consultationsCount: 5100,
        perMinuteRate: 45,
        isVerified: true,
        isOnline: true,
        skills: ['Bhrigu Nandi Nadi', 'Navamsha D9 Secrets', 'Purva Janma Karma', 'Navagraha Shanti']
      },
      {
        displayName: 'Sunita Singhania',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
        bio: 'Certified Western & Vedic Tarot reader and cosmic intuition coach with over 10 years experience helping modern professionals navigate relationship dilemmas.',
        title: 'Tarot Master & Intuitive Guide',
        specializations: ['Tarot', 'Relationships', 'Numerology'],
        languages: ['English', 'Hindi', 'Punjabi'],
        experienceYears: 10,
        rating: 4.89,
        reviewCount: 165,
        consultationsCount: 1400,
        perMinuteRate: 22,
        isVerified: true,
        isOnline: true,
        skills: ['Celtic Cross', 'Angel Cards', 'Soulmate Spread', 'Personal Year Numbers']
      }
    ];

    const insertedAstrologers = await Astrologer.insertMany(astrologersData);
    console.log(`✅ Seeded ${insertedAstrologers.length} verified astrologers.`);

    // Add reviews
    const sampleReviews = [
      {
        astrologer: insertedAstrologers[0]._id,
        user: demoUser._id,
        userName: 'Aditya Sharma',
        rating: 5,
        comment: 'Acharya Ramanuj provided unbelievable clarity on my career transition. His advice on waiting for Jupiter’s transit was spot on. Very calm and scholarly.'
      },
      {
        astrologer: insertedAstrologers[0]._id,
        user: demoUser._id,
        userName: 'Pooja Kulkarni',
        rating: 5,
        comment: 'The Kundli analysis of our family was deeply reassuring. No fear tactics, just pure spiritual wisdom and practical remedies.'
      },
      {
        astrologer: insertedAstrologers[1]._id,
        user: demoUser._id,
        userName: 'Rohan Verma',
        rating: 5,
        comment: 'Vidushi Gayatri Devi explained the KP sub-lord dynamics so scientifically. Her guidance regarding matrimonial timing saved me months of anxiety.'
      }
    ];
    await Review.insertMany(sampleReviews);
  }

  // 4. Create Saved Birth Profiles & Kundli for Demo User
  const existingProfiles = await BirthProfile.countDocuments({ user: demoUser._id });
  if (existingProfiles === 0) {
    const profileMyself = new BirthProfile({
      user: demoUser._id,
      name: 'Aditya Sharma',
      relation: 'Myself',
      gender: 'male',
      dob: '1995-11-18',
      tob: '06:45',
      place: 'New Delhi, India',
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 5.5
    });
    await profileMyself.save();

    const profilePartner = new BirthProfile({
      user: demoUser._id,
      name: 'Priyanka Patel',
      relation: 'Partner',
      gender: 'female',
      dob: '1997-04-22',
      tob: '14:20',
      place: 'Ahmedabad, India',
      latitude: 23.0225,
      longitude: 72.5714,
      timezone: 5.5
    });
    await profilePartner.save();

    // Generate Kundli calculation
    const calc = calculateKundli({
      name: profileMyself.name,
      dob: profileMyself.dob,
      tob: profileMyself.tob,
      place: profileMyself.place,
      latitude: profileMyself.latitude,
      longitude: profileMyself.longitude,
      timezone: profileMyself.timezone,
      gender: profileMyself.gender
    });

    const savedKundli = new Kundli({
      user: demoUser._id,
      birthProfile: profileMyself._id,
      name: profileMyself.name,
      gender: profileMyself.gender,
      dob: profileMyself.dob,
      tob: profileMyself.tob,
      place: profileMyself.place,
      latitude: profileMyself.latitude,
      longitude: profileMyself.longitude,
      timezone: profileMyself.timezone,
      basicInfo: calc.basicInfo,
      planetaryPositions: calc.planetaryPositions,
      houses: calc.houses,
      dasha: calc.dasha,
      charts: calc.charts,
      analysis: calc.analysis
    });
    await savedKundli.save();
    console.log('✅ Seeded sample birth profiles and Kundli for demo user.');
  }

  // 5. Seed Articles
  const articleCount = await Article.countDocuments();
  if (articleCount === 0) {
    const articlesData = [
      {
        title: 'Demystifying Kundli: How Vedic Birth Charts Map Your Life Rhythm',
        slug: 'demystifying-kundli-vedic-birth-charts',
        category: 'Kundli',
        shortDescription: 'Explore the 12 Bhavas, planetary ascendants, and why ancient Indian sages described the horoscope as the mirror of karma.',
        content: `In classical Indian philosophy, a **Janam Kundli (Birth Chart)** is neither an instrument of blind fatalism nor a casual fortune-telling novelty. It is a precise astronomical blueprint capturing the geometric alignment of cosmic bodies at the exact instant of your first breath.

### The 12 Bhavas (Houses)
Every Kundli is divided into 12 celestial houses, each governing distinct facets of the human incarnation:
1. **Tanu Bhava (1st House):** The self, bodily vitality, disposition, and life direction.
2. **Dhana Bhava (2nd House):** Accumulated wealth, speech purity, and family legacy.
3. **Sahaja Bhava (3rd House):** Sibling bonds, personal valor, and communicative skills.
4. **Bandhu/Sukh Bhava (4th House):** Domestic serenity, maternal affection, and mental stability.
5. **Putra Bhava (5th House):** Intellect, creative discernment, and past-life merits (Purva Punya).
6. **Ari Bhava (6th House):** Overcoming daily obstacles, debt resolution, and physiological resilience.
7. **Yuvati Bhava (7th House):** Sacred matrimony, business alliances, and contractual integrity.
8. **Randhra Bhava (8th House):** Deep transformation, esoteric insight, and longevity.
9. **Dharma Bhava (9th House):** Higher philosophical wisdom, divine grace, and ethical righteousness.
10. **Karma Bhava (10th House):** Vocation, public achievement, and social leadership.
11. **Labha Bhava (11th House):** Gains, realization of noble aspirations, and community networks.
12. **Vyaya Bhava (12th House):** Spiritual surrender (Moksha), charity, and foreign journeys.

When interpreted through thoughtful scholarly guidance, your Kundli highlights innate strengths to amplify and karmic blind spots to heal.`,
        coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
        readingTime: '6 min read',
        author: { name: 'Acharya Ramanuj Shastri', role: 'Vedic Scholar', avatar: '' },
        tags: ['Kundli', 'Bhavas', 'Vedic Astrology', 'Karma'],
        isFeatured: true
      },
      {
        title: 'Ashtakoota Gun Milan: Beyond Mere Point Counting in Vedic Matchmaking',
        slug: 'ashtakoota-gun-milan-vedic-matchmaking',
        category: 'Marriage',
        shortDescription: 'Discover why the 36 Gunas evaluate psychological, biological, and energetic harmony, and how modern couples should interpret the findings.',
        content: `For generations in Indian civilization, the solemn union of marriage (*Vivaha*) has been treated as a communion of two ancestral streams and consciousness fields. The Ashtakoota compatibility system assesses 8 specific dimensions (totalling 36 Gunas):

1. **Varna (1 Point):** Ego alignment and spiritual temperament.
2. **Vashya (2 Points):** Mutual attraction and reciprocal influence.
3. **Tara (3 Points):** Cosmic destiny rhythm and mutual longevity.
4. **Yoni (4 Points):** Biological, intimate, and physiological compatibility.
5. **Graha Maitri (5 Points):** Mental friendship between Moon sign rulers.
6. **Gana (6 Points):** Temperament (Deva, Manushya, Rakshasa).
7. **Bhakoot (7 Points):** Family prosperity and emotional fulfillment.
8. **Nadi (8 Points):** Genetic constitution and energetic prana balance.

A score above 18 points is considered favorable. However, wise astrologers always review the 7th and 8th houses in individual charts rather than judging a relationship by Gun Milan points alone.`,
        coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        readingTime: '5 min read',
        author: { name: 'Vidushi Gayatri Devi', role: 'KP Specialist', avatar: '' },
        tags: ['Marriage', 'Matching', 'Gun Milan', 'Relationships'],
        isFeatured: true
      },
      {
        title: 'Understanding Rahu and Ketu: The Karmic Nodes of Destiny',
        slug: 'understanding-rahu-ketu-karmic-nodes',
        category: 'Planets',
        shortDescription: 'Why the shadow planets (Chhaya Grahas) hold the keys to your evolutionary hunger and spiritual detachment.',
        content: `Unlike physical spheres such as Mars or Jupiter, Rahu and Ketu are mathematical intersections of the orbital paths of the Sun and the Moon. In Vedic Jyotish, they are known as **Chhaya Grahas (Shadow Planets)**.

* **Rahu (North Node):** Represents where the soul is hungry for worldly mastery in this lifetime. It drives ambition, innovation, foreign travel, and unconventional thinking.
* **Ketu (South Node):** Represents past-life mastery and points toward spiritual detachment, ascetic clarity, and liberation (Moksha).

Balancing Rahu’s forward momentum with Ketu’s quiet detachment creates psychological wholeness.`,
        coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        readingTime: '7 min read',
        author: { name: 'Acharya Bhrigu Narayan', role: 'Nadi Astrologer', avatar: '' },
        tags: ['Rahu', 'Ketu', 'Planets', 'Spirituality'],
        isFeatured: false
      },
      {
        title: 'The Science of Daily Panchang: Harmonizing with Lunar Cycles',
        slug: 'science-of-daily-panchang-lunar-cycles',
        category: 'Panchang',
        shortDescription: 'How Tithi, Nakshatra, Yoga, Karana, and Var influence daily focus, vitality, and auspicious execution.',
        content: `The term **Panchanga** stems from the Sanskrit *Pancha-Anga* (Five Limbs of Time):
1. **Tithi (Lunar Day):** Governs water element, relationships, and emotional mindset.
2. **Var (Solar Weekday):** Governs fire element and physical stamina.
3. **Nakshatra (Lunar Asterism):** Governs air element and subconscious impulses.
4. **Yoga (Solar-Lunar Sum):** Governs ether element and spiritual harmony.
5. **Karana (Half Tithi):** Governs earth element and material accomplishment.

Aligning your significant endeavors with favorable Panchang timings ensures harmony between human intention and cosmic rhythms.`,
        coverImage: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=800&q=80',
        readingTime: '5 min read',
        author: { name: 'Pandit Devavrat Joshi', role: 'Vedic Consultant', avatar: '' },
        tags: ['Panchang', 'Tithi', 'Muhurat', 'Nakshatra'],
        isFeatured: false
      }
    ];

    await Article.insertMany(articlesData);
    console.log(`✅ Seeded ${articlesData.length} Vedic astrology editorial articles.`);
  }

  console.log('🌟 JyotirVeda Database Seeding Completed Successfully.');
}

// If run directly
if (require.main === module) {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jyotirveda';
  mongoose.connect(MONGODB_URI)
    .then(async () => {
      await seedDatabase();
      process.exit(0);
    })
    .catch(err => {
      console.error('Seed error:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
