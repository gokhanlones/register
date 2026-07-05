/* ============================================================
   ASTRO NOTLARIM - Firebase Merkezi Servis (firebase-service.js)
   Tum Firebase Auth, Firestore ve API islemleri burada toplanir.
   Sayfalar sadece bu servisi import edip fonksiyonlari cagirir.
   
   NOT: i18n.js bu dosyadan ONCE yuklenmelidir.
   Eger i18n mevcut degilse, ceviri fonksiyonu passthrough yapar.
   ============================================================ */

// ──────────────────────────────────────────────────────────────
// 1. CEVIRI YARDIMCISI (i18n.js bagimliligi olmadan calisir)
// ──────────────────────────────────────────────────────────────
function _t(key, params) {
    if (typeof window !== 'undefined' && window.i18n && window.i18n.t) {
        return window.i18n.t(key, params);
    }
    // Fallback: i18n yok anahtari dondur
    return key;
}

// ──────────────────────────────────────────────────────────────
// 2. FIREBASE YAPILANDIRMASI (Tek kaynak)
// ──────────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAFRhlbnY4Fq67Wl-E8yis5msD6K-QZjbU",
    authDomain: "astro-notlarim.firebaseapp.com",
    projectId: "astro-notlarim",
    storageBucket: "astro-notlarim.firebasestorage.app",
    messagingSenderId: "123654326926",
    appId: "1:123654326926:web:44ba9bf34fcea3bf5ad7df",
    measurementId: "G-19BSBWLJ7X"
};

// Firebase'i sadece bir kez baslat
if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG);
}

const db = firebase.firestore();
const auth = firebase.auth();
let remoteConfig = null;
try {
    if (typeof firebase !== 'undefined' && firebase.remoteConfig) {
        remoteConfig = firebase.remoteConfig();
        remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
    }
} catch (e) {
    console.warn('Remote Config SDK yuklenmemis, fallback kullanilacak');
}

// ──────────────────────────────────────────────────────────────
// 3. KULLANICI YONETIMI (Auth State)
// ──────────────────────────────────────────────────────────────

/**
 * Mevcut kullaniciyi dondurur (senkron)
 */
function getCurrentUser() {
    return auth.currentUser;
}

/**
 * Auth state degisikliklerini dinler
 * @param {Function} callback - (user) => {} seklinde fonksiyon
 * @param {Function} onNoUser - Kullanici yoksa calisacak fonksiyon (opsiyonel)
 */
function onAuthStateChanged(callback, onNoUser) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            callback(user);
        } else if (onNoUser) {
            onNoUser();
        }
    });
}

/**
 * Giris yapmamis kullaniciyi login sayfasina yonlendirir
 */
function requireAuth(redirectUrl = 'login.html') {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                resolve(user);
            } else {
                window.location.href = redirectUrl;
                reject(new Error('Oturum bulunamadi'));
            }
        });
    });
}

// ──────────────────────────────────────────────────────────────
// 4. AUTH ISLEMLERI (Kayit / Giris / Cikis / Sifre)
// ──────────────────────────────────────────────────────────────

/**
 * E-posta ve sifre ile kayit ol
 * @param {string} email
 * @param {string} password
 * @returns {Promise<firebase.User>}
 */
async function registerWithEmail(email, password) {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    return result.user;
}

/**
 * Kullanici profilini guncelle (displayName vb.)
 * @param {Object} profile - { displayName, photoURL }
 */
async function updateUserProfile(profile) {
    const user = auth.currentUser;
    if (!user) throw new Error(_t('auth.sessionNotFound'));
    await user.updateProfile(profile);
    return user;
}

/**
 * Dogrulama e-postasi gonder
 */
async function sendEmailVerification() {
    const user = auth.currentUser;
    if (!user) throw new Error(_t('auth.sessionNotFound'));
    await user.sendEmailVerification();
    return true;
}

/**
 * E-posta dogrulama durumunu kontrol et (reload eder)
 */
async function checkEmailVerified() {
    const user = auth.currentUser;
    if (!user) return false;
    await user.reload();
    return auth.currentUser.emailVerified;
}

/**
 * E-posta ve sifre ile giris yap
 * @param {string} email
 * @param {string} password
 * @returns {Promise<firebase.User>}
 */
async function loginWithEmail(email, password) {
    const result = await auth.signInWithEmailAndPassword(email, password);
    return result.user;
}

/**
 * Google ile giris/kayit
 * @returns {Promise<firebase.User>}
 */
async function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    return result.user;
}

/**
 * Sifre sifirlama e-postasi gonder
 * @param {string} email
 */
async function sendPasswordReset(email) {
    await auth.sendPasswordResetEmail(email);
    return true;
}

/**
 * Cikis yap
 */
async function logout() {
    await auth.signOut();
    return true;
}

/**
 * Kullanici hesabini sil
 */
async function deleteCurrentUser() {
    const user = auth.currentUser;
    if (!user) throw new Error(_t('auth.sessionNotFound'));
    await user.delete();
    return true;
}

// ──────────────────────────────────────────────────────────────
// 5. FIRESTORE KAYIT ISLEMLERI (Yazma)
// ──────────────────────────────────────────────────────────────

/**
 * Kullanici profili olustur/guncelle (terms.html onayi sonrasi)
 * @param {string} uid
 * @param {Object} data
 */
async function saveUserProfile(uid, data) {
    const docRef = db.collection('user_profiles').doc(uid);
    await docRef.set({
        ...data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    return docRef;
}

/**
 * Dogum bilgilerini ve dogum haritasini kaydet
 * @param {string} uid
 * @param {Object} birthData - { fullname, birthYear, birthMonth, birthDay, birthHour, birthMinute, birthPlace, latitude, longitude, natalChart, sunSign, moonSign, risingSign }
 */
async function saveBirthInfo(uid, birthData) {
    const docRef = db.collection('user_profiles').doc(uid);
    await docRef.set({
        ...birthData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    // Dogum bilgisi degistiginde eski gunluk yorum onbellegini temizle
    await clearDailyCache(uid);
    return docRef;
}

/**
 * Kullanicinin gunluk yorum onbellegini temizler.
 * @param {string} uid
 */
async function clearDailyCache(uid) {
    try {
        const snapshot = await db.collection('user_profiles').doc(uid).collection('daily_cache').get();
        if (snapshot.empty) return;
        const batch = db.batch();
        snapshot.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
    } catch (err) {
        console.warn('Gunluk yorum onbellegi temizlenemedi:', err);
    }
}

/**
 * Gunluk burc yorumunu kaydet (cache icin)
 * @param {string} uid
 * @param {Object} dailyData - { date, horoscope, scores, luckyNumber, luckyColor, luckyTime }
 */
async function saveDailyHoroscope(uid, dailyData) {
    const docRef = db.collection('user_profiles').doc(uid).collection('daily_cache').doc(dailyData.date);
    await docRef.set({
        ...dailyData,
        cachedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    return docRef;
}

// ──────────────────────────────────────────────────────────────
// 6. FIRESTORE OKUMA ISLEMLERI (Okuma)
// ──────────────────────────────────────────────────────────────

/**
 * Kullanici profilini getir
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
async function getUserProfile(uid) {
    const doc = await db.collection('user_profiles').doc(uid).get();
    return doc.exists ? doc.data() : null;
}

/**
 * Kullanicinin dogum bilgilerinin var olup olmadigini kontrol et
 * @param {string} uid
 * @returns {Promise<boolean>}
 */
async function hasBirthInfo(uid) {
    const data = await getUserProfile(uid);
    return !!(data && data.birthYear);
}

/**
 * Kullanicinin KVKK/Kullanim Sartlari onayini kontrol et.
 * @param {string} uid
 * @returns {Promise<boolean>}
 */
async function hasApprovedTerms(uid) {
    const data = await getUserProfile(uid);
    return !!(data && data.isTermsApproved === true);
}

/**
 * Kullanici adini getir
 * @param {string} uid
 * @returns {Promise<string>}
 */
async function getUserName(uid) {
    const data = await getUserProfile(uid);
    return data?.fullname || data?.displayName || auth.currentUser?.displayName || _t('dashboard.userDefault');
}

/**
 * Gunluk burc yorumunu cache'den getir
 * @param {string} uid
 * @param {string} date - YYYY-MM-DD formatinda
 * @returns {Promise<Object|null>}
 */
async function getDailyHoroscope(uid, date) {
    const doc = await db.collection('user_profiles').doc(uid).collection('daily_cache').doc(date).get();
    return doc.exists ? doc.data() : null;
}

/**
 * Dogum haritasi verisini getir
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
async function getNatalChart(uid) {
    const data = await getUserProfile(uid);
    return data?.natalChart || null;
}

/**
 * Kullanicinin burclarini getir (Gunes, Ay, Yukselen)
 * @param {string} uid
 * @returns {Promise<Object>}
 */
async function getUserSigns(uid) {
    const data = await getUserProfile(uid);
    return {
        sunSign: data?.sunSign || data?.natalChart?.planets?.find(p => p.id === 'sun')?.sign || null,
        moonSign: data?.moonSign || data?.natalChart?.planets?.find(p => p.id === 'moon')?.sign || null,
        risingSign: data?.risingSign || data?.natalChart?.angles_details?.asc?.sign || null
    };
}

// ──────────────────────────────────────────────────────────────
// 7. REMOTE CONFIG (API Key vb.)
// ──────────────────────────────────────────────────────────────

/**
 * Remote Config'ten deger getir
 * @param {string} key
 * @returns {Promise<string>}
 */
async function getRemoteConfigValue(key) {
    if (!remoteConfig) {
        throw new Error(_t('error.configLoad'));
    }
    await remoteConfig.fetchAndActivate();
    const value = remoteConfig.getString(key);
    if (!value) throw new Error(_t('error.configMissing'));
    return value;
}

/**
 * Astro API Key'i getir
 * @returns {Promise<string>}
 */
async function getAstroApiKey() {
    return getRemoteConfigValue('astro_api_key');
}

// ──────────────────────────────────────────────────────────────
// 8. HARICI API ISTEKLERI (FreeAstroAPI)
// ──────────────────────────────────────────────────────────────

/**
 * Dogum haritasi hesapla
 * @param {string} apiKey
 * @param {Object} requestBody
 */
async function calculateNatalChart(apiKey, requestBody) {
    const response = await fetch('https://api.freeastroapi.com/api/v1/natal/calculate', {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
        throw new Error(_t('error.natalCalc', { status: response.status }));
    }
    const data = await response.json();
    if (data.error) throw new Error(data.message || _t('error.natalCalc', { status: response.status }));
    return data.data || data;
}

/**
 * Gunluk transit/gokyuzu verisi al
 * @param {string} apiKey
 * @param {Object} requestBody
 */
async function fetchDailyTransit(apiKey, requestBody) {
    const response = await fetch('https://api.freeastroapi.com/api/v1/transit/daily', {
        method: 'POST',
        headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
        throw new Error(_t('error.dailyTransit', { status: response.status }));
    }
    const data = await response.json();
    if (data.error) throw new Error(data.message || _t('error.dailyTransit', { status: response.status }));
    return data;
}

// ──────────────────────────────────────────────────────────────
// 9. YONLENDIRME YARDIMCILARI
// ──────────────────────────────────────────────────────────────

/**
 * Kullanicinin dogum bilgisine gore yonlendirme yap
 * birthYear varsa dashboard, yoksa birthinfo
 * @param {string} uid
 */
async function redirectAfterLogin(uid) {
    const approved = await hasApprovedTerms(uid);
    if (!approved) {
        window.location.href = 'terms.html';
        return;
    }
    const hasBirth = await hasBirthInfo(uid);
    window.location.href = hasBirth ? 'dashboard.html' : 'birthinfo.html';
}

/**
 * Oturum kontrolu ve yonlendirme (index.html splash icin)
 */
async function checkSessionAndRedirect() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const approved = await hasApprovedTerms(user.uid);
                if (!approved) {
                    window.location.replace('terms.html');
                    resolve('terms.html');
                    return;
                }
                const hasBirth = await hasBirthInfo(user.uid);
                const target = hasBirth ? 'dashboard.html' : 'birthinfo.html';
                window.location.replace(target);
                resolve(target);
            } else {
                window.location.replace('login.html');
                resolve('login.html');
            }
        });
    });
}

// ──────────────────────────────────────────────────────────────
// 10. HATA YONETIMI (i18n entegre)
// ──────────────────────────────────────────────────────────────

/**
 * Firebase Auth hata kodlarini cevrilmis mesaja cevir
 * @param {string} errorCode
 * @returns {Object} { message, redirect, redirectText }
 */
function translateAuthError(errorCode) {
    const errors = {
        'auth/email-already-in-use': {
            message: _t('auth.emailInUse'),
            redirect: true,
            redirectText: _t('auth.loginLink')
        },
        'auth/invalid-email': {
            message: _t('auth.invalidEmail'),
            redirect: false
        },
        'auth/weak-password': {
            message: _t('auth.weakPassword'),
            redirect: false
        },
        'auth/operation-not-allowed': {
            message: _t('auth.operationNotAllowed'),
            redirect: false
        },
        'auth/network-request-failed': {
            message: _t('auth.networkFailed'),
            redirect: false
        },
        'auth/too-many-requests': {
            message: _t('auth.tooManyRequests'),
            redirect: false
        },
        'auth/invalid-api-key': {
            message: _t('auth.invalidApiKey'),
            redirect: false
        },
        'auth/app-not-authorized': {
            message: _t('auth.appNotAuthorized'),
            redirect: false
        },
        'auth/user-not-found': {
            message: _t('auth.userNotFound'),
            redirect: false
        },
        'auth/wrong-password': {
            message: _t('auth.wrongPassword'),
            redirect: false
        },
        'auth/invalid-credential': {
            message: _t('auth.invalidCredential'),
            redirect: false
        }
    };
    if (!errors[errorCode]) {
        console.warn('Bilinmeyen auth hata kodu:', errorCode);
    }
    return errors[errorCode] || { message: _t('auth.unknownError'), redirect: false };
}

// ──────────────────────────────────────────────────────────────
// 11. GUVENLIK YARDIMCILARI
// ──────────────────────────────────────────────────────────────

/**
 * XSS korumasi - disaridan gelen metinleri escape et
 * @param {*} str
 * @returns {string}
 */
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ──────────────────────────────────────────────────────────────
// 12. OTURUM DEPOLAMA YARDIMCILARI
// ──────────────────────────────────────────────────────────────

const SessionStore = {
    set(key, value) {
        sessionStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value);
    },
    get(key) {
        const val = sessionStorage.getItem(key);
        try { return JSON.parse(val); } catch { return val; }
    },
    remove(key) {
        sessionStorage.removeItem(key);
    },
    clear() {
        sessionStorage.clear();
    }
};

// Tüm fonksiyonlari global scope'a export et (modul sistemi yoksa)
window.AstroService = {
    // i18n erisimi
    // NOT: bu dosya i18n.js'den ONCE yuklendigi icin window.i18n burada henuz
    // tanimli olmuyordu ve deger sonsuza kadar null kaliyordu. Getter kullanarak
    // her erisimde guncel window.i18n'i donduruyoruz.
    get i18n() {
        return typeof window !== 'undefined' ? window.i18n : null;
    },

    // Firebase ref'leri
    db,
    auth,
    remoteConfig,

    // Auth
    getCurrentUser,
    onAuthStateChanged,
    requireAuth,
    registerWithEmail,
    updateUserProfile,
    sendEmailVerification,
    checkEmailVerified,
    loginWithEmail,
    loginWithGoogle,
    sendPasswordReset,
    logout,
    deleteCurrentUser,

    // Firestore Yazma
    saveUserProfile,
    saveBirthInfo,
    saveDailyHoroscope,
    clearDailyCache,

    // Firestore Okuma
    getUserProfile,
    hasBirthInfo,
    hasApprovedTerms,
    getUserName,
    getDailyHoroscope,
    getNatalChart,
    getUserSigns,

    // Remote Config
    getRemoteConfigValue,
    getAstroApiKey,

    // API
    calculateNatalChart,
    fetchDailyTransit,

    // Yonlendirme
    redirectAfterLogin,
    checkSessionAndRedirect,

    // Hata
    translateAuthError,

    // Guvenlik
    escapeHtml,

    // Session
    SessionStore
};
