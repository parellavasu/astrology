# 🪐 JyotirVeda — Modern Vedic Astrology Web Platform

**JyotirVeda** is a complete, modern, production-grade Vedic Astrology platform combining classical Indian astronomical algorithms (*Siddhantic* and *Parashari Jyotish*) with a contemporary, accessible, high-performance web experience.

Built with **React.js** (Vite + Tailwind CSS + Lucide Icons) on the frontend and **Node.js + Express.js + MongoDB** on the backend.

---

## 🌟 Brand & Visual Identity

* **Brand Name**: **JyotirVeda** (*Light of Wisdom & Cosmic Knowledge*)
* **Tagline**: *"Discover the Story Written in Your Stars"*
* **Color Palette**:
  * **Midnight Navy**: `#05070D`, `#0A0F1D`
  * **Astral Indigo**: `#151D33`, `#1E293B`
  * **Celestial Warm Gold**: `#D4AF37`, `#F59E0B`, `#FDE047`
  * **Divine Ivory / Light Pearl**: `#FDFBF7`, `#F4EFE6`
* **Typography**:
  * Headings: *Cormorant Garamond* & *Cinzel*
  * User Interface: *Plus Jakarta Sans* & *Inter*
* **Design Philosophy**: Liquid Glass & Celestial Sacred Geometry. 100% SVG iconography (zero raw emojis as UI icons), mobile-first responsive design, minimum 44px touch targets, and WCAG 4.5:1 contrast compliance.

---

## 🚀 Key Features & Modules

### 1. Janam Kundli Generator & Comprehensive Dashboard
* **Mathematical Ephemeris Engine**:
  * Sidereal (Nirayana) Zodiac with authentic **Lahiri Ayanamsha (Chitra Paksha)**.
  * Planetary coordinates for **Surya (Sun), Chandra (Moon), Mangal (Mars), Budha (Mercury), Guru (Jupiter), Shukra (Venus), Shani (Saturn), Rahu (North Node), and Ketu (South Node)** with degree, minute, second, Nakshatra, and Pada.
  * Ascendant (**Lagna**) calculated from Local Sidereal Time (RAMC) and geographic coordinates.
  * Interactive SVG Birth Charts with instant toggle between **North Indian Diamond Style** and **South Indian Box Style**, and switcher between **D1 (Rashi)** and **D9 (Navamsha)** charts.
  * Complete 12 Bhavas (Houses) breakdown with ruling lords, occupants, and life domains.
  * In-depth synthesis across Personality, Career (10th house), Finance (2nd house), Marriage (7th house), Education (5th house), and Spiritual Path.
  * 120-Year **Vimshottari Dasha** progression timeline.
  * **Download Kundli PDF** / Print-ready formatted view.

### 2. Kundli Matching (Ashtakoota Gun Milan)
* Traditional **36-Point Compatibility Calculator** evaluating all 8 Kootas:
  1. **Varna (1 pt)**: Ego & Spiritual Harmony
  2. **Vashya (2 pts)**: Mutual Attraction & Influence
  3. **Tara (3 pts)**: Health & Destiny Rhythm
  4. **Yoni (4 pts)**: Intimacy & Biological Affinity
  5. **Graha Maitri (5 pts)**: Mental Friendship & Values
  6. **Gana (6 pts)**: Temperament & Behavior
  7. **Bhakoot (7 pts)**: Emotional Bond & Prosperity
  8. **Nadi (8 pts)**: Pranic Energy & Genetic Constitution
* Total score gauge, balanced spiritual recommendations without fatalistic claims, and **Manglik Dosha (Kuja Dosha)** assessment for both partners.
* Downloadable Compatibility Report.

### 3. Daily Vedic Panchang
* Date and City selector with comprehensive coordinate directory.
* Precise calculation of **Tithi, Nakshatra, Yoga, Karana, Paksha, Sunrise, Sunset, Moonrise, and Moonset**.
* Auspicious Timings (**Abhijit Muhurat, Brahma Muhurat, Amrit Kaal**).
* Inauspicious Windows (**Rahu Kalam, Yamaganda, Gulika Kalam**).
* Interactive daytime timeline showing Shubh and Ashubh kaal blocks.

### 4. Shubh Muhurat Finder
* Auspicious date and time finder across 7 categories:
  * Marriage (Vivah)
  * Griha Pravesh (House Warming)
  * Vehicle Purchase
  * Property Purchase
  * Business Opening (Vyapar Arambh)
  * Naming Ceremony (Namakaran)
  * Religious Ceremonies & Havans

### 5. Multi-Period Daily Horoscope
* Comprehensive forecast for all 12 Zodiac signs (Aries to Pisces).
* Horizontal sign selector with instant preview.
* Timeframe switchers: **Yesterday | Today | Tomorrow** and **Weekly | Monthly | Yearly**.
* Dimensions: Overview, Love & Bonds, Career & Karma, Wealth & Finance, Family & Roots, Lucky Number, Lucky Color, and Shubh Time.

### 6. Astrologer Marketplace & Simulated Live Consultation
* Filterable directory of certified Vedic scholars, KP experts, Tarot readers, and Vastu consultants.
* Filtering by Specialization, Language, Experience, Consultation Rate, and Online status.
* Complete Astrologer Profiles with bios, ratings, and verified client reviews.
* Interactive **Live Consultation Chat Room** with session countdown timer, responsive astrologer dialog, and wallet billing.

### 7. Ask AstroAI Assistant
* Context-aware conversational assistant that ingests the user's generated birth chart.
* Inquire regarding Lagna, Moon sign, 10th house career prospects, active Mahadasha, and planetary remedies.
* Responsible spiritual guardrails emphasizing self-reflection over deterministic fatalism.

### 8. Traditional Vedic Remedies
* Classical catalogue of **Mantras** (with Sanskrit text, transliteration, and purpose), **Gemstone guidelines (Ratna)**, **Rudraksha**, **Meditation**, and **Nishkama Karma Dana (Sacred Charity)**.

### 9. Editorial Magazine / Articles
* Articles spanning Kundli, Bhavas, Gun Milan, Rahu-Ketu karmic nodes, and Panchang science.
* Clean reading view, reading times, author credentials, and related articles.

### 10. Global Search Modal
* Instant search suggestions across articles, zodiac signs, astrologers, and tools with keyboard shortcuts (`ESC` to close).

### 11. User & Admin Dashboards
* **User Dashboard**: Manage saved family birth profiles (Myself, Partner, Mother, Father, Child, Custom), saved Kundlis, compatibility reports, consultation logs, payment history, and astrology wallet.
* **Admin Dashboard**: Real-time KPI statistics (Total Users, Astrologers, Consultations, Reports, Revenue), user account governance, astrologer verification & rate management, and article publisher.

### 12. Indian Payment Flow (Razorpay)
* Secure order creation and server-side HMAC-SHA256 signature verification.
* Success and failure transaction receipts.

---

## 🛠️ Tech Stack & Architecture

* **Frontend**:
  * React 18, Vite 5
  * Tailwind CSS 3 (custom luxury Vedic design tokens)
  * Lucide React (100% SVG iconography)
  * React Router DOM v6
  * Axios HTTP client
* **Backend**:
  * Node.js, Express.js
  * MongoDB & Mongoose
  * Sidereal Ephemeris Mathematical Engine
  * JWT Authentication & Bcrypt password hashing
  * Helmet, CORS, Rate Limiting

---

## 💻 Getting Started

### 1. Prerequisites
* Node.js v18+ (tested on Node v24)
* MongoDB (running locally on `mongodb://127.0.0.1:27017/jyotirveda` or configured via `MONGODB_URI` in `backend/.env`)

### 2. Installation
```bash
# Clone the repository
cd astrology

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Database Seeding
To populate default verified astrologers, demo users, articles, and horoscopes:
```bash
cd backend
npm run seed
```

### 4. Running the Platform
Run backend:
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

Run frontend in another terminal:
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 🔑 Demo Credentials

* **Demo User**:
  * Email: `user@jyotirveda.com`
  * Password: `User@123`
  * Pre-loaded with family birth profiles, saved Kundli, and wallet balance.
* **Demo Administrator**:
  * Email: `admin@jyotirveda.com`
  * Password: `Admin@123`
  * Access to the protected `/admin` control dashboard.
