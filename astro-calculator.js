/* ============================================================
   ASTRO NOTLARIM - Client-Side Astroloji Hesaplayıcı
   freeastroapi.com eksik verilerini tamamlar:
   - Part of Fortune (Şans Noktası)
   - Fixed Stars (Sabit Yıldızlar)
   - Ek ev hesaplamaları
   ============================================================ */

const AstroCalculator = {
    
    // ─── Sabit Yıldız Kataloğu (2026 referans değerleri) ───
    // Ekliptik longitude (lon), latitude (lat), parlaklık (mag)
    // Precession: ~1° / 72 yıl
    FIXED_STARS: {
        Aldebaran:    { lon2026: 69.85,  lat: -5.28,  mag: 0.85,  sign: 'taurus' },
        Regulus:      { lon2026: 150.15, lat: 0.47,   mag: 1.35,  sign: 'leo' },
        Sirius:       { lon2026: 104.15, lat: -39.58, mag: -1.46, sign: 'cancer' },
        Spica:        { lon2026: 203.95, lat: -2.06,  mag: 0.98,  sign: 'libra' },
        Antares:      { lon2026: 249.95, lat: -4.33,  mag: 1.09,  sign: 'sagittarius' },
        Formalhaut:   { lon2026: 3.55,   lat: -20.77, mag: 1.16,  sign: 'pisces' },
        Pollux:       { lon2026: 93.05,  lat: 6.68,   mag: 1.14,  sign: 'cancer' },
        Castor:       { lon2026: 90.05,  lat: 10.08,  mag: 1.58,  sign: 'cancer' },
        Betelgeuse:   { lon2026: 88.85,  lat: -16.03, mag: 0.50,  sign: 'gemini' },
        Rigel:        { lon2026: 85.25,  lat: -31.08, mag: 0.13,  sign: 'gemini' },
        Denebola:     { lon2026: 177.25, lat: 12.48,  mag: 2.14,  sign: 'virgo' },
        Vindemiatrix: { lon2026: 192.05, lat: 1.75,   mag: 2.85,  sign: 'libra' },
        Agena:        { lon2026: 144.85, lat: -41.18, mag: 0.61,  sign: 'leo' },
        Alphecca:     { lon2026: 241.35, lat: 44.58,  mag: 2.22,  sign: 'sagittarius' },
        Acrux:        { lon2026: 142.15, lat: -52.72, mag: 1.40,  sign: 'leo' },
        Gacrux:       { lon2026: 171.85, lat: -31.18, mag: 1.64,  sign: 'virgo' },
        Mimosa:       { lon2026: 191.65, lat: -43.18, mag: 1.25,  sign: 'libra' },
        Alioth:       { lon2026: 156.65, lat: 35.48,  mag: 1.77,  sign: 'virgo' },
        Dubhe:        { lon2026: 135.95, lat: 42.28,  mag: 1.79,  sign: 'leo' },
        Merak:        { lon2026: 148.45, lat: 33.28,  mag: 2.37,  sign: 'virgo' },
        Phad:         { lon2026: 143.35, lat: 30.18,  mag: 2.44,  sign: 'leo' },
        Megrez:       { lon2026: 153.15, lat: 35.88,  mag: 3.32,  sign: 'virgo' },
        Phecda:       { lon2026: 164.15, lat: 30.58,  mag: 2.44,  sign: 'virgo' },
        Alkaid:       { lon2026: 177.65, lat: 33.48,  mag: 1.85,  sign: 'virgo' }
    },

    // ─── Burç sıralaması ve kısaltmaları ───
    SIGNS: [
        { id: 'aries',      abbr: 'Ari', symbol: '♈', start: 0   },
        { id: 'taurus',     abbr: 'Tau', symbol: '♉', start: 30  },
        { id: 'gemini',     abbr: 'Gem', symbol: '♊', start: 60  },
        { id: 'cancer',     abbr: 'Can', symbol: '♋', start: 90  },
        { id: 'leo',        abbr: 'Leo', symbol: '♌', start: 120 },
        { id: 'virgo',      abbr: 'Vir', symbol: '♍', start: 150 },
        { id: 'libra',      abbr: 'Lib', symbol: '♎', start: 180 },
        { id: 'scorpio',    abbr: 'Sco', symbol: '♏', start: 210 },
        { id: 'sagittarius',abbr: 'Sag', symbol: '♐', start: 240 },
        { id: 'capricorn',  abbr: 'Cap', symbol: '♑', start: 270 },
        { id: 'aquarius',   abbr: 'Aqu', symbol: '♒', start: 300 },
        { id: 'pisces',     abbr: 'Pis', symbol: '♓', start: 330 }
    ],

    // ─── Gezegen sembolleri ───
    PLANET_SYMBOLS: {
        sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
        jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇',
        north_node: '☊', south_node: '☋', lilith: '⚸', chiron: '⚷',
        pholus: '⯱', ceres: '⚳', pallas: '⚴', juno: '⚵', vesta: '⚶',
        vertex: 'Vx', part_of_fortune: '⊕', pars_fortunae: '⊕',
        aldebaran: '★', regulus: '★', sirius: '★', spica: '★',
        antares: '★', formalhaut: '★', pollux: '★', castor: '★',
        betelgeuse: '★', rigel: '★', denebola: '★', vindemiatrix: '★',
        agena: '★', alphacca: '★', acrux: '★', gacrux: '★',
        mimosa: '★', alioth: '★', dubhe: '★', merak: '★',
        phad: '★', megrez: '★', phecda: '★', alkaid: '★'
    },

    // ─── Dereceyi normalize et (0-360) ───
    normalizeDegree(deg) {
        return ((deg % 360) + 360) % 360;
    },

    // ─── Dereceden burç ID'si bul ───
    degreeToSignId(degree) {
        const d = this.normalizeDegree(degree);
        const index = Math.floor(d / 30) % 12;
        return this.SIGNS[index].id;
    },

    // ─── Dereceden burç kısaltması bul ───
    degreeToSignAbbr(degree) {
        const d = this.normalizeDegree(degree);
        const index = Math.floor(d / 30) % 12;
        return this.SIGNS[index].abbr;
    },

    // ─── Dereceden burç sembolü bul ───
    degreeToSignSymbol(degree) {
        const d = this.normalizeDegree(degree);
        const index = Math.floor(d / 30) % 12;
        return this.SIGNS[index].symbol;
    },

    // ─── Burç içindeki derece (0-30) ───
    degreeInSign(degree) {
        return this.normalizeDegree(degree) % 30;
    },

    // ─── Gezegen/nokta sembolünü getir ───
    getSymbol(id) {
        return this.PLANET_SYMBOLS[id?.toLowerCase()] || '●';
    },

    // ─── Gece doğumu kontrolü ───
    isNightBirth(datetimeStr, hour, minute) {
        if (datetimeStr) {
            const d = new Date(datetimeStr);
            const h = d.getUTCHours();
            return h < 6 || h >= 18;
        }
        if (typeof hour === 'number') {
            return hour < 6 || hour >= 18;
        }
        return false; // Varsayılan: gündüz
    },

    // ─── Hangi evde? ───
    findHouse(degree, houses) {
        if (!houses || !Array.isArray(houses) || houses.length === 0) return null;
        
        const normDeg = this.normalizeDegree(degree);
        
        for (let i = 0; i < houses.length; i++) {
            const h = houses[i];
            const hNum = h.house || (i + 1);
            const hStart = typeof h.abs_pos === 'number' ? h.abs_pos : 
                          (typeof h.pos === 'number' ? this.SIGNS[i]?.start + h.pos : i * 30);
            
            const nextH = houses[(i + 1) % 12];
            const nextStart = typeof nextH.abs_pos === 'number' ? nextH.abs_pos :
                             (typeof nextH.pos === 'number' ? this.SIGNS[(i + 1) % 12]?.start + nextH.pos : ((i + 1) % 12) * 30);
            
            let end = nextStart;
            if (end < hStart) end += 360;
            
            let check = normDeg;
            if (check < hStart) check += 360;
            
            if (check >= hStart && check < end) {
                return hNum;
            }
        }
        return null;
    },

    // ─── Yıl bazlı precession düzeltmesi ───
    getFixedStarLongitude(starName, year) {
        const star = this.FIXED_STARS[starName];
        if (!star) return null;
        
        const yearDiff = (year || 2026) - 2026;
        const precession = yearDiff * (1 / 72); // ~50.3 arcsec/yıl
        return this.normalizeDegree(star.lon2026 + precession);
    },

    // ─── Part of Fortune (Şans Noktası) hesapla ───
    // Gündüz: ASC + Moon - Sun
    // Gece:   ASC + Sun - Moon
    calculatePartOfFortune(chartData) {
        const angles = chartData.angles || chartData.angles_details;
        const planets = chartData.planets || [];
        
        if (!angles) return null;
        
        const ascDeg = angles.asc || angles.ASC || angles.ascendant;
        if (typeof ascDeg !== 'number') return null;
        
        const sun = planets.find(p => p.id === 'sun');
        const moon = planets.find(p => p.id === 'moon');
        
        if (!sun || !moon) return null;
        
        const sunDeg = sun.abs_pos || sun.longitude || sun.lon;
        const moonDeg = moon.abs_pos || moon.longitude || moon.lon;
        
        if (typeof sunDeg !== 'number' || typeof moonDeg !== 'number') return null;
        
        const isNight = this.isNightBirth(
            chartData.subject?.datetime,
            chartData.subject?.settings?.hour,
            chartData.subject?.settings?.minute
        );
        
        let pofDeg;
        if (isNight) {
            pofDeg = ascDeg + sunDeg - moonDeg;
        } else {
            pofDeg = ascDeg + moonDeg - sunDeg;
        }
        
        pofDeg = this.normalizeDegree(pofDeg);
        const signId = this.degreeToSignId(pofDeg);
        const house = this.findHouse(pofDeg, chartData.houses);
        
        return {
            id: 'part_of_fortune',
            name: 'Şans Noktası',
            name_en: 'Part of Fortune',
            sign_id: signId,
            sign: this.degreeToSignAbbr(pofDeg),
            pos: this.degreeInSign(pofDeg),
            abs_pos: pofDeg,
            house: house,
            retrograde: false,
            isCalculated: true,
            isPoint: true
        };
    },

    // ─── Tüm Fixed Stars'ı hesapla ───
    calculateFixedStars(chartData, year) {
        const results = [];
        const birthYear = year || (chartData.subject?.datetime ? 
            new Date(chartData.subject.datetime).getFullYear() : new Date().getFullYear());
        
        Object.keys(this.FIXED_STARS).forEach(starName => {
            const lon = this.getFixedStarLongitude(starName, birthYear);
            if (lon === null) return;
            
            const star = this.FIXED_STARS[starName];
            const signId = this.degreeToSignId(lon);
            const house = this.findHouse(lon, chartData.houses);
            
            results.push({
                id: starName.toLowerCase(),
                name: starName,
                sign_id: signId,
                sign: this.degreeToSignAbbr(lon),
                pos: this.degreeInSign(lon),
                abs_pos: lon,
                house: house,
                retrograde: false,
                declination_deg: star.lat,
                magnitude: star.mag,
                isFixedStar: true,
                isPoint: true
            });
        });
        
        return results;
    },

    // ─── Vertex kontrolü (API'den geliyorsa kullan, yoksa hesaplama) ───
    ensureVertex(chartData) {
        const planets = chartData.planets || [];
        const hasVertex = planets.some(p => p.id === 'vertex');
        
        if (hasVertex) return chartData;
        
        // Vertex hesaplaması kompleks, şimdilik atla
        // İleride eklenebilir: anti-vertex hesaplaması
        return chartData;
    },

    // ─── Tüm eksik verileri hesapla ve chart'a ekle ───
    enrichChartData(chartData) {
        if (!chartData || typeof chartData !== 'object') {
            console.warn('[AstroCalculator] Geçersiz chart verisi');
            return chartData;
        }
        
        // Orijinali bozma
        const enriched = JSON.parse(JSON.stringify(chartData));
        
        if (!enriched.planets) enriched.planets = [];
        
        // Part of Fortune ekle
        const pof = this.calculatePartOfFortune(enriched);
        if (pof) {
            enriched.planets.push(pof);
        }
        
        // Fixed Stars ekle
        const year = enriched.subject?.datetime ? 
            new Date(enriched.subject.datetime).getFullYear() : 
            new Date().getFullYear();
        
        const stars = this.calculateFixedStars(enriched, year);
        stars.forEach(star => enriched.planets.push(star));
        
        // Metadata güncelle
        enriched._calculated = {
            partOfFortune: !!pof,
            fixedStars: stars.length,
            calculatedAt: new Date().toISOString()
        };
        
        return enriched;
    },

    // ─── Gezegenleri burçlara göre grupla ───
    groupBySign(planets) {
        const groups = {};
        
        planets.forEach(p => {
            const signKey = p.sign_id || p.sign?.toLowerCase();
            if (!signKey) return;
            
            if (!groups[signKey]) {
                groups[signKey] = [];
            }
            groups[signKey].push(p);
        });
        
        return groups;
    },

    // ─── Gezegenleri evlere göre grupla ───
    groupByHouse(planets) {
        const groups = {};
        
        planets.forEach(p => {
            const house = p.house;
            if (!house) return;
            
            if (!groups[house]) {
                groups[house] = [];
            }
            groups[house].push(p);
        });
        
        return groups;
    },

    // ─── Yorum key'i oluştur ───
    // planet.sun.sign.pisces  veya  aspect.sun.sextile.mars
    makeInterpretationKey(type, p1, p2OrSign, p3) {
        if (type === 'planet_sign') {
            return `planet.${p1}.sign.${p2OrSign}`;
        }
        if (type === 'planet_house') {
            return `planet.${p1}.house.${p2OrSign}`;
        }
        if (type === 'aspect') {
            return `aspect.${p1}.${p2OrSign}.${p3}`;
        }
        return null;
    },

    // ─── Chart verisinden yorum key'lerini çıkar ───
    extractInterpretationKeys(chartData) {
        const keys = [];
        const planets = chartData.planets || [];
        const aspects = chartData.aspects || [];
        
        // Planet + Sign
        planets.forEach(p => {
            if (p.sign_id) {
                keys.push(this.makeInterpretationKey('planet_sign', p.id, p.sign_id));
            }
            if (p.house) {
                keys.push(this.makeInterpretationKey('planet_house', p.id, p.house));
            }
        });
        
        // Aspects
        aspects.forEach(a => {
            if (a.p1 && a.p2 && a.type) {
                keys.push(this.makeInterpretationKey('aspect', a.p1, a.type, a.p2));
                // Ters sıralama da ekle (API farklı sıralayabilir)
                keys.push(this.makeInterpretationKey('aspect', a.p2, a.type, a.p1));
            }
        });
        
        return [...new Set(keys)]; // Tekrarları kaldır
    }
};

// Global export
window.AstroCalculator = AstroCalculator;
