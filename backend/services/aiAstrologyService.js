/**
 * JyotirVeda AstroAI Assistant Service
 * Provides context-aware Vedic astrological reasoning based on the user's
 * calculated birth chart (Lagna, Rashi, Nakshatra, Houses, Dasha).
 * Strictly maintains ethical, empowering, and balanced spiritual guidance.
 */

function generateAstroAIResponse(query, chartContext = null) {
  const q = (query || '').toLowerCase();

  // If chart context is available, extract key parameters
  let lagna = chartContext?.basicInfo?.ascendant || 'Aries';
  let moonSign = chartContext?.basicInfo?.moonSign || 'Taurus';
  let sunSign = chartContext?.basicInfo?.sunSign || 'Leo';
  let nakshatra = chartContext?.basicInfo?.nakshatra || 'Rohini';
  let dasha = chartContext?.basicInfo?.currentMahadasha || 'Jupiter';

  let reply = '';
  let relatedTopics = [];

  if (q.includes('moon') || q.includes('rashi') || q.includes('mind') || q.includes('emotion')) {
    reply = `In Vedic Jyotish, your Janma Rashi (Moon Sign) represents the **Manas**—the seat of emotional perception, instincts, and your psychological sanctuary.

${chartContext ? `In your Kundli, your Moon is placed in **${moonSign}** under the asterism of **${nakshatra}**.` : 'Your Moon sign reveals how you process life experiences inwardly.'}

**Key Astrological Dimensions of this Placement:**
* **Emotional Disposition:** A deep need for harmony, steadiness, and contemplative quietude.
* **Perceptual Style:** Intuitive and receptive; you assimilate nuances and environmental subtleties that others frequently overlook.
* **Strengthening the Lunar Energy:** Traditional remedies include practicing Chandra Trataka or mindful moonlit meditation on Purnima (Full Moon), staying hydrated, honoring maternal figures, and maintaining a sattvic evening routine.`;
    relatedTopics = ['Planetary transit effects on Moon', 'Significance of your Nakshatra', 'Dasha period of Moon'];
  }
  else if (q.includes('10th') || q.includes('career') || q.includes('job') || q.includes('profession') || q.includes('karma')) {
    const tenthHouse = chartContext?.houses?.find(h => h.house === 10);
    const sign = tenthHouse?.sign || 'Capricorn';
    const lord = tenthHouse?.lord || 'Saturn';
    const occupants = tenthHouse?.occupants?.join(', ') || 'No malefic planets';

    reply = `Your **10th House (Karma Bhava)** governs your social vocation, public dharma, professional honors, and legacy.

* **10th House Sign:** **${sign}**
* **Ruling Lord:** **${lord}**
* **Influencing Planets:** ${occupants}

**Vedic Career Guidance:**
In classical texts like *Brihat Parashara Hora Shastra*, the 10th house reflects where you generate worldly contribution. You flourish best in roles where your expertise, strategic intellect, and ethical standard set a benchmark for others.
Rather than rushing immediate outcomes, focus on deep domain mastery. Auspicious professional alignments include leadership advisory, specialized consulting, technical architecture, and value-driven enterprises.`;
    relatedTopics = ['10th House Lord Placement', 'D10 Dasamsa Chart', 'Favorable Professional Directions'];
  }
  else if (q.includes('7th') || q.includes('marriage') || q.includes('relationship') || q.includes('partner') || q.includes('love')) {
    const seventhHouse = chartContext?.houses?.find(h => h.house === 7);
    const sign = seventhHouse?.sign || 'Libra';
    const lord = seventhHouse?.lord || 'Venus';

    reply = `The **7th House (Yuvati Bhava)** governs sacred partnerships, marriage, and how you mirror your soul through others.

* **7th House Sign:** **${sign}** (Ruled by **${lord}**)
* **Spiritual Archetype:** In Vedic tradition, marriage is viewed as *Saha-Dharma-Charini*—two souls walking toward spiritual evolution together.

**Relationship Harmony Insights:**
* You are naturally drawn to partners who embody intellectual curiosity, emotional maturity, and mutual respect.
* When communicative alignment is prioritized over stubborn expectations, your partnerships deepen into durable anchors of strength.
* Practicing daily gratitude and transparent communication with your partner mitigates planetary turbulence.`;
    relatedTopics = ['Ashtakoota Compatibility Check', 'D9 Navamsha Marriage Analysis', 'Venus Placement in Chart'];
  }
  else if (q.includes('dasha') || q.includes('mahadasha') || q.includes('period') || q.includes('timing')) {
    reply = `According to the **Vimshottari Dasha system** (the premier 120-year planetary cycle of Maharishi Parashara), your life is currently guided by the **${dasha} Mahadasha**.

**Significance of ${dasha} Mahadasha:**
* **Archetypal Influence:** ${dasha === 'Jupiter' ? 'Expansion, higher wisdom, spiritual discernment, and ethical growth.' : dasha === 'Saturn' ? 'Patience, structural reform, perseverance, and mastering life duties.' : dasha === 'Mercury' ? 'Communication, analytical acumen, trade, commerce, and learning.' : dasha === 'Venus' ? 'Aesthetic appreciation, refined relationships, worldly comfort, and creative prosperity.' : `${dasha} initiates transformative life lessons geared toward personal self-actualization.`}
* **Guidance for this Phase:** Honor the cosmic lesson this planetary ruler imparts. Avoid shortcuts; cultivate the virtues associated with ${dasha}.`;
    relatedTopics = ['Antardasha Sub-periods', 'Dasha Remedies', 'Transit overlay with Dasha'];
  }
  else if (q.includes('nakshatra') || q.includes('birth star')) {
    reply = `Your Janma Nakshatra is **${nakshatra}**. 

The 27 Nakshatras represent the stellar mansions through which cosmic prana flows. 
* Your Nakshatra lord governs the root rhythms of your subconscious mind.
* It shapes your innate talents, natural inclinations, and auspicious timing for spiritual undertakings.
* Meditating on the deity associated with ${nakshatra} helps harmonize your energetic subtle body (Sukshma Sharira).`;
    relatedTopics = ['Nakshatra Pada Analysis', 'Favorable Gemstones for your Nakshatra', 'Chandra Kundli'];
  }
  else if (q.includes('navamsa') || q.includes('navamsha') || q.includes('d9')) {
    reply = `The **Navamsha (D9) Chart** is the microscopic spiritual harmonic of your birth chart.

While the D1 Rasi chart is the physical tree, the D9 Navamsha represents the fruit.
* It reveals your inner soul trajectory (Dharmic purpose), the true strength of your planets in the second half of life, and matrimonial compatibility.
* When a planet is placed in the same sign in both D1 and D9, it attains **Vargottama** status, granting resilience and exceptional fortitude.`;
    relatedTopics = ['Vargottama Planets', 'D9 Chart Reading', 'Ishta Devata Discovery'];
  }
  else if (q.includes('lagna') || q.includes('ascendant') || q.includes('1st house')) {
    reply = `Your **Ascendant (Lagna)** is seated in **${lagna}**.

In Vedic Jyotish, Lagna is the most crucial pivot of the entire horoscope—it marks the exact zodiac sign rising on the eastern horizon at the precise minute of your birth.
* It defines your physical temperament, vitality, outlook on reality, and how you engage with life's opportunities.
* Strengthening your Lagna lord empowers all 12 houses of your horoscope simultaneously.`;
    relatedTopics = ['Lagna Lord Placement', '1st House Aspects', 'Daily Morning Ritual for Lagna'];
  }
  else {
    reply = `Greetings from **AstroAI**, your Vedic cosmic guide. 

${chartContext ? `I have analyzed your birth chart (**${lagna} Lagna**, **${moonSign} Rashi**, **${nakshatra} Nakshatra**, running **${dasha} Mahadasha**).` : 'You can explore your birth chart, planetary houses, or life questions.'}

Here are thoughtful topics you may inquire about:
1. **"What does my Moon sign indicate about my emotional nature?"**
2. **"How does my 10th house influence my career trajectory?"**
3. **"What is the spiritual significance of my ${nakshatra} Nakshatra?"**
4. **"What life lessons does my current ${dasha} Mahadasha emphasize?"**
5. **"Which Vedic remedies are traditional for balancing my planetary energies?"**`;
    relatedTopics = ['Career Insights', 'Love & Marriage Compatibility', 'Planetary Remedies'];
  }

  return {
    query,
    answer: reply,
    relatedTopics,
    timestamp: new Date().toISOString(),
    disclaimer: 'Astrological insights are traditional, spiritual archetypes and philosophical guidance intended for self-reflection. They should not replace professional medical, legal, psychological, or financial counsel.'
  };
}

module.exports = {
  generateAstroAIResponse
};
