/* ============================================================
   ASTRO NOTLARIM - Firebase Merkezi Servis (firebase-service.js)
   Tüm Firebase Auth, Firestore ve API işlemleri burada toplanır.
   Sayfalar sadece bu servisi import edip fonksiyonları çağırır.
   ============================================================ */

// ──────────────────────────────────────────────────────────────
// 1. FIREBASE YAPILANDIRMASI (Tek kaynak)
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

// Firebase'i sadece bir kez başlat
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
    console.warn('Remote Config SDK yüklenmemiş, fallback kullanılacak');
}

// ──────────────────────────────────────────────────────────────
// 2. KULLANICI YÖNETİMİ (Auth State)
// ──────────────────────────────────────────────────────────────

/**
 * Mevcut kullanıcıyı döndürür (senkron)
 */
function getCurrentUser() {
    return auth.currentUser;
}

/**
 * Auth state değişikliklerini dinler
 * @param {Function} callback - (user) => {} şeklinde fonksiyon
 * @param {Function} onNoUser - Kullanıcı yoksa çalışacak fonksiyon (opsiyonel)
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
 * Giriş yapmamış kullanıcıyı login sayfasına yönlendirir
 */
function requireAuth(redirectUrl = 'login.html') {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                resolve(user);
            } else {
                window.location.href = redirectUrl;
                reject(new Error('Oturum bulunamadı'));
            }
        });
    });
}

// ──────────────────────────────────────────────────────────────
// 3. AUTH İŞLEMLERİ (Kayıt / Giriş / Çıkış / Şifre)
// ──────────────────────────────────────────────────────────────

/**
 * E-posta ve şifre ile kayıt ol
 * @param {string} email
 * @param {string} password
 * @returns {Promise<firebase.User>}
 */
async function registerWithEmail(email, password) {
    const result = await auth.createUserWithEmailAndPassword(email, password);
    return result.user;
}

/**
 * Kullanıcı profilini güncelle (displayName vb.)
 * @param {Object} profile - { displayName, photoURL }
 */
async function updateUserProfile(profile) {
    const user = auth.currentUser;
    if (!user) throw new Error('Oturum bulunamadı');
    await user.updateProfile(profile);
    return user;
}

/**
 * Doğrulama e-postası gönder
 */
async function sendEmailVerification() {
    const user = auth.currentUser;
    if (!user) throw new Error('Oturum bulunamadı');
    await user.sendEmailVerification();
    return true;
}

/**
 * E-posta doğrulama durumunu kontrol et (reload eder)
 */
async function checkEmailVerified() {
    const user = auth.currentUser;
    if (!user) return false;
    await user.reload();
    return auth.currentUser.emailVerified;
}

/**
 * E-posta ve şifre ile giriş yap
 * @param {string} email
 * @param {string} password
 * @returns {Promise<firebase.User>}
 */
async function loginWithEmail(email, password) {
    const result = await auth.signInWithEmailAndPassword(email, password);
    return result.user;
}

/**
 * Google ile giriş/kayıt
 * @returns {Promise<firebase.User>}
 */
async function loginWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    return result.user;
}

/**
 * Şifre sıfırlama e-postası gönder
 * @param {string} email
 */
async function sendPasswordReset(email) {
    await auth.sendPasswordResetEmail(email);
    return true;
}

/**
 * Çıkış yap
 */
async function logout() {
    await auth.signOut();
    return true;
}

/**
 * Kullanıcı hesabını sil
 */
async function deleteCurrentUser() {
    const user = auth.currentUser;
    if (!user) throw new Error('Oturum bulunamadı');
    await user.delete();
    return true;
}

// ──────────────────────────────────────────────────────────────
// 4. FIRESTORE KAYIT İŞLEMLERİ (Yazma)
// ──────────────────────────────────────────────────────────────

/**
 * Kullanıcı profili oluştur/güncelle (terms.html onayı sonrası)
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
 * Doğum bilgilerini ve doğum haritasını kaydet
 * @param {string} uid
 * @param {Object} birthData - { gender, fullname, birthYear, birthMonth, birthDay, birthHour, birthMinute, birthPlace, latitude, longitude, natalChart, sunSign, moonSign, risingSign }
 */
async function saveBirthInfo(uid, birthData) {
    const docRef = db.collection('user_profiles').doc(uid);
    await docRef.set({
        ...birthData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    return docRef;
}

/**
 * Günlük burç yorumunu kaydet (cache için)
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
// 5. FIRESTORE OKUMA İŞLEMLERİ (Okuma)
// ──────────────────────────────────────────────────────────────

/**
 * Kullanıcı profilini getir
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
async function getUserProfile(uid) {
    const doc = await db.collection('user_profiles').doc(uid).get();
    return doc.exists ? doc.data() : null;
}

/**
 * Kullanıcının doğum bilgilerinin var olup olmadığını kontrol et
 * @param {string} uid
 * @returns {Promise<boolean>}
 */
async function hasBirthInfo(uid) {
    const data = await getUserProfile(uid);
    return !!(data && data.birthYear);
}

/**
 * Kullanıcı adını getir
 * @param {string} uid
 * @returns {Promise<string>}
 */
async function getUserName(uid) {
    const data = await getUserProfile(uid);
    return data?.fullname || data?.displayName || auth.currentUser?.displayName || 'Kullanıcı';
}

/**
 * Günlük burç yorumunu cache'den getir
 * @param {string} uid
 * @param {string} date - YYYY-MM-DD formatında
 * @returns {Promise<Object|null>}
 */
async function getDailyHoroscope(uid, date) {
    const doc = await db.collection('user_profiles').doc(uid).collection('daily_cache').doc(date).get();
    return doc.exists ? doc.data() : null;
}

/**
 * Doğum haritası verisini getir
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
async function getNatalChart(uid) {
    const data = await getUserProfile(uid);
    return data?.natalChart || null;
}

/**
 * Kullanıcının burçlarını getir (Güneş, Ay, Yükselen)
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
// 6. REMOTE CONFIG (API Key vb.)
// ──────────────────────────────────────────────────────────────

/**
 * Remote Config'ten değer getir
 * @param {string} key
 * @returns {Promise<string>}
 */
async function getRemoteConfigValue(key) {
    if (!remoteConfig) {
        // Fallback: Remote Config yoksa hardcoded API key kullan
        if (key === 'astro_api_key') {
            return '85a8865527abf55f25f8c5273d0d848f6df8cc15e9908397583b4acf9e59e0bf';
        }
        throw new Error('Remote Config aktif değil');
    }
    await remoteConfig.fetchAndActivate();
    const value = remoteConfig.getString(key);
    if (!value) throw new Error(`Remote Config: '${key}' bulunamadı`);
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
// 7. HARİCİ API İSTEKLERİ (FreeAstroAPI)
// ──────────────────────────────────────────────────────────────

/**
 * Doğum haritası hesapla
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
    const data = await response.json();
    if (data.error) throw new Error(data.message || 'Doğum haritası hesaplanamadı');
    return data.data || data;
}

/**
 * Günlük transit/gökyüzü verisi al
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
    return await response.json();
}

// ──────────────────────────────────────────────────────────────
// 8. YÖNLENDİRME YARDIMCILARI
// ──────────────────────────────────────────────────────────────

/**
 * Kullanıcının doğum bilgisine göre yönlendirme yap
 * birthYear varsa dashboard, yoksa birthinfo
 * @param {string} uid
 */
async function redirectAfterLogin(uid) {
    const hasBirth = await hasBirthInfo(uid);
    window.location.href = hasBirth ? 'dashboard.html' : 'birthinfo.html';
}

/**
 * Oturum kontrolü ve yönlendirme (index.html splash için)
 */
async function checkSessionAndRedirect() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
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
// 9. HATA YÖNETİMİ
// ──────────────────────────────────────────────────────────────

/**
 * Firebase Auth hata kodlarını Türkçe mesaja çevir
 * @param {string} errorCode
 * @returns {Object} { message, redirect, redirectText }
 */
function translateAuthError(errorCode) {
    const errors = {
        'auth/email-already-in-use': {
            message: 'Bu e-posta adresi zaten kayıtlı. Giriş yapmak ister misiniz?',
            redirect: true,
            redirectText: 'Giriş yap'
        },
        'auth/invalid-email': {
            message: 'Geçersiz e-posta adresi. Lütfen kontrol edin.',
            redirect: false
        },
        'auth/weak-password': {
            message: 'Şifre çok zayıf. En az 6 karakter kullanın.',
            redirect: false
        },
        'auth/operation-not-allowed': {
            message: 'E-posta/şifre girişi Firebase konsolda aktif değil.',
            redirect: false
        },
        'auth/network-request-failed': {
            message: 'İnternet bağlantınızı kontrol edin.',
            redirect: false
        },
        'auth/too-many-requests': {
            message: 'Çok fazla deneme yaptınız. Lütfen biraz bekleyin.',
            redirect: false
        },
        'auth/invalid-api-key': {
            message: 'Uygulama yapılandırmasında hata var.',
            redirect: false
        },
        'auth/app-not-authorized': {
            message: 'Bu domain için yetki verilmemiş.',
            redirect: false
        },
        'auth/user-not-found': {
            message: 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.',
            redirect: false
        },
        'auth/wrong-password': {
            message: 'Şifre hatalı. Lütfen tekrar deneyin.',
            redirect: false
        },
        'auth/invalid-credential': {
            message: 'E-posta veya şifre hatalı.',
            redirect: false
        }
    };
    return errors[errorCode] || { message: 'Bir hata oluştu: ' + errorCode, redirect: false };
}

// ──────────────────────────────────────────────────────────────
// 10. OTURUM DEPOLAMA YARDIMCILARI
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

// Tüm fonksiyonları global scope'a export et (modül sistemi yoksa)
window.AstroService = {
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

    // Firestore Okuma
    getUserProfile,
    hasBirthInfo,
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

    // Yönlendirme
    redirectAfterLogin,
    checkSessionAndRedirect,

    // Hata
    translateAuthError,

    // Session
    SessionStore
};
