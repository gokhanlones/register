/* ============================================================
   ASTRO NOTLARIM - i18n Coklu Dil Sistemi
   Telefon sistem diline gore otomatik secim (Varsayilan: tr)
   Kullanilabilir diller: tr (Turkce), en (English)
   ============================================================ */

const I18N_CONFIG = {
    defaultLang: 'tr',
    supportedLangs: ['tr', 'en'],
    storageKey: 'astro_notlarim_lang'
};

// ============================================================
// 1. CEVIRI SOZLUKLERI
// ============================================================

const TRANSLATIONS = {
    // ------------------------------ TURKCE
    tr: {
        // Genel / Ortak
        'app.name': 'Astro Notlarim',
        'app.loading': 'Baslatiliyor...',
        'app.checkingSession': 'Oturum kontrol ediliyor...',
        'app.offline': 'Internet baglantisi bekleniyor...',
        'nav.home': 'Anasayfa',
        'nav.ask': 'Sor',
        'nav.chart': 'Harita',
        'nav.profile': 'Profil',
        'nav.logout': 'Cikis Yap',
        'nav.menu': 'Menu',
        'btn.close': 'Kapat',
        'btn.save': 'Kaydet',
        'btn.cancel': 'Iptal',
        'btn.approve': 'Onayla ve Basla',
        'btn.update': 'Guncelle',
        'btn.delete': 'Sil',
        'btn.edit': 'Duzenle',
        'loading': 'Yukleniyor...',
        'error.generic': 'Beklenmeyen bir hata olustu.',
        'error.requiredField': 'Lutfen tum alanlari doldurun.',

        // index.html (Splash)
        'splash.loading': 'Baslatiliyor...',
        'splash.checking': 'Oturum kontrol ediliyor...',
        'splash.offline': 'Internet baglantisi bekleniyor...',

        // login.html (Giris)
        'login.title': 'Giris Yap',
        'login.emailPlaceholder': 'E-posta',
        'login.passwordPlaceholder': 'Sifre',
        'login.btnLogin': 'Giris Yap',
        'login.btnGoogle': 'Google ile Devam Et',
        'login.forgotPassword': 'Sifremi unuttum',
        'login.noAccount': 'Uye degil misin?',
        'login.registerLink': 'Kayit ol',
        'login.errorEmail': 'Lutfen gecerli bir e-posta adresi girin.',
        'login.errorPassword': 'Sifre alani bos birakilamaz.',
        'login.loggingIn': 'Giris yapiliyor...',
        'login.forgotAlert': 'Lutfen once gecerli bir e-posta adresi girin.',
        'login.resetSent': 'Sifre sifirlama baglantisi {email} adresine gonderildi.',

        // register.html (Kayit)
        'register.title': 'Kayit Ol',
        'register.fullnamePlaceholder': 'Ad Soyad',
        'register.emailPlaceholder': 'E-posta',
        'register.passwordPlaceholder': 'Sifre',
        'register.confirmPasswordPlaceholder': 'Sifre Tekrar',
        'register.btnRegister': 'Kayit Ol',
        'register.hasAccount': 'Zaten uye misin?',
        'register.loginLink': 'Giris yap',
        'register.errorFullname': 'Lutfen ad soyad girin.',
        'register.errorEmail': 'Lutfen gecerli bir e-posta adresi girin.',
        'register.errorPassword': 'Sifre en az 6 karakter olmalidir.',
        'register.errorConfirm': 'Sifreler eslesmiyor.',
        'register.creating': 'Kayit olusturuluyor...',
        'register.errorGender': 'Lutfen cinsiyet secin.',

        // terms.html (Yasal Onay)
        'terms.title': 'Yasal Onay ve Gizlilik Politikasi',
        'terms.pageTitle': 'Yasal Onay ve Gizlilik',
        'terms.verificationAlert': 'Devam etmeden once e-posta kutunuza gonderilen dogrulama linkine tiklamis olmaniz gerekmektedir.',
        'terms.resend': 'Dogrulama mailini tekrar gonder',
        'terms.intro': 'Lutfen Astro Notlarim platformunu kullanmaya baslamadan once asagidaki kullanim sartlarini ve gizlilik politikasini dikkatlice okuyunuz.',
        'terms.section1Title': '1. Kullanim Sartlari',
        'terms.section1Text': 'Astro Notlarim tarafindan sunulan hizmetlerden faydalanarak, bu sayfada yer alan tum maddeleri gayrikabili rucu kabul etmissayilirsiniz.',
        'terms.section2Title': '2. Gizlilik Politikasi ve KVKK',
        'terms.section2Text': 'Kisisel verilerinizin guvenligi bizim icin son derece onemlidir. Kayit esnasinda paylastiginiz veriler 6698 sayili KVKK kapsaminda korunmaktadir.',
        'terms.section3Title': '3. Veri Isleme Amaclari',
        'terms.section3Text': 'Toplanan verileriniz hesap guvenligi ve deneyim kisisellestirme amaciyla islenmektedir.',
        'terms.btnCancel': 'Iptal',
        'terms.btnWaiting': 'E-posta Dogrulamasi Bekleniyor...',
        'terms.btnApprove': 'Onayla ve Basla',
        'terms.creatingProfile': 'Profiliniz Olusturuluyor...',
        'terms.sessionExpired': 'Oturum suresi dolmus veya bulunamadi. Lutfen kayit formunu tekrar doldurun.',
        'terms.emailNotVerified': 'E-posta adresiniz henuz dogrulanmamis.',
        'terms.success': 'Hesabiniz basariyla olusturuldu! Simdi giris yapabilirsiniz.',
        'terms.resendSuccess': 'Dogrulama e-postasi adresinize tekrar gonderildi. Lutfen kontrol edin.',
        'terms.resendError': 'Mail gonderilirken bir hata olustu: {error}',
        'terms.canceling': 'Iptal ediliyor...',

        // birthinfo.html (Dogum Bilgileri)
        'birthinfo.title': 'Dogum Bilgileri',
        'birthinfo.gender': 'Cinsiyet',
        'birthinfo.genderFemale': 'Kadin',
        'birthinfo.genderMale': 'Erkek',
        'birthinfo.fullnamePlaceholder': 'Ad Soyad',
        'birthinfo.birthDate': 'Dogum Tarihi',
        'birthinfo.day': 'Gun',
        'birthinfo.month': 'Ay',
        'birthinfo.months': 'Ocak,Subat,Mart,Nisan,Mayis,Haziran,Temmuz,Agustos,Eylul,Ekim,Kasim,Aralik',
        'birthinfo.year': 'Yil',
        'birthinfo.birthTime': 'Dogum Saati',
        'birthinfo.hour': 'Saat',
        'birthinfo.minute': 'Dakika',
        'birthinfo.birthPlace': 'Dogum Yeri',
        'birthinfo.birthPlacePlaceholder': 'Dogum Yeri (Sehir ara...)',
        'birthinfo.btnSave': 'Kaydet',
        'birthinfo.calculating': 'Hesaplaniyor...',
        'birthinfo.errorAllFields': 'Lutfen tum alanlari doldurun.',
        'birthinfo.errorSelectCity': 'Lutfen listeden bir sehir secin.',
        'birthinfo.errorSession': 'Oturum bulunamadi. Lutfen tekrar giris yapin.',
        'birthinfo.errorGeneric': 'Hata: {error}',

        // dashboard.html (Anasayfa)
        'dashboard.greeting': 'Merhaba',
        'dashboard.userDefault': 'Kullanici',
        'dashboard.sun': 'Gunes',
        'dashboard.moon': 'Ay',
        'dashboard.rising': 'Yukselen',
        'dashboard.loadingSpinner': 'Gunluk yorum yukleniyor...',
        'dashboard.dailyHoroscope': 'Bugunun Gok Gunlugu',
        'dashboard.love': 'Ask',
        'dashboard.career': 'Kariyer',
        'dashboard.money': 'Para',
        'dashboard.health': 'Saglik',
        'dashboard.luckyNumber': 'Sansli Sayi',
        'dashboard.luckyColor': 'Sansli Renk',
        'dashboard.luckyTime': 'Sansli Saat',
        'dashboard.missingInfo': 'Dogum bilgileriniz eksik.',
        'dashboard.loadingError': 'Gunluk yorum yuklenirken hata olustu.',
        'dashboard.noHoroscope': 'Bugun icin ozel bir yorum bulunamadi.',
        'dashboard.categorySoon': 'Bu kategori icin yorumlar yakinda eklenecek.',

        // natal.html (Dogum Haritasi)
        'natal.title': 'Dogum Haritasi',
        'natal.pageTitle': 'Dogum Haritasi',
        'natal.loading': 'Dogum haritasi yukleniyor...',
        'natal.notFound': 'Dogum haritasi verisi bulunamadi.',
        'natal.loadingError': 'Veri yuklenirken hata olustu.',
        'natal.planets': 'Gezegenler & Noktalar',
        'natal.houses': 'Evler',
        'natal.aspects': 'Acilar',
        'natal.angleDetails': 'Aci Detaylari',
        'natal.interpretations': 'Yorumlar',
        'natal.retrograde': 'R',
        'natal.houseSuffix': '. Ev',
        'natal.chartPlaceholder': 'Harita goruntusu mevcut degil',
        'natal.angleAsc': 'Yukselen (ASC)',
        'natal.angleMc': 'Orta Gok (MC)',
        'natal.angleIc': 'Gokyuzu Alti (IC)',
        'natal.angleDc': 'Bati (DC)',
        'natal.commentTitle': 'Yorum {number}',

        // ask.html (Sor)
        'ask.title': 'Sor',
        'ask.comingSoon': 'Chat ekrani buraya gelecek.',

        // profile.html (Profil)
        'profile.title': 'Profil',
        'profile.birthInfo': 'Dogum Bilgileri',
        'profile.birthDate': 'Dogum Tarihi',
        'profile.birthTime': 'Dogum Saati',
        'profile.birthPlace': 'Dogum Yeri',
        'profile.sunSign': 'Gunes Burcu',
        'profile.moonSign': 'Ay Burcu',
        'profile.risingSign': 'Yukselen',
        'profile.noBirthInfo': 'Dogum bilgileriniz henuz kayitli degil.',
        'profile.addBirthInfo': 'Dogum Bilgilerini Ekle',
        'profile.account': 'Hesap',
        'profile.updateBirthInfo': 'Dogum Bilgilerini Guncelle',
        'profile.deleteAccount': 'Hesabimi Sil',
        'profile.deleteConfirm': 'Hesabinizi ve tum verilerinizi kalici olarak silmek istediginize emin misiniz? Bu islem geri alinamaz.',
        'profile.reauthRequired': 'Guvenlik nedeniyle hesabinizi silmeden once tekrar giris yapmaniz gerekiyor.',
        'profile.deleteError': 'Hesap silinirken bir hata olustu: {error}',

        // Side Menu
        'menu.home': 'Anasayfa',
        'menu.natalChart': 'Dogum Haritasi',
        'menu.ask': 'Sor',
        'menu.profile': 'Profil',

        // firebase-service.js hata mesajlari
        'auth.emailInUse': 'Bu e-posta adresi zaten kayitli. Giris yapmak ister misiniz?',
        'auth.invalidEmail': 'Gecersiz e-posta adresi. Lutfen kontrol edin.',
        'auth.weakPassword': 'Sifre cok zayif. En az 6 karakter kullanin.',
        'auth.operationNotAllowed': 'E-posta/sifre girisi Firebase konsolda aktif degil.',
        'auth.networkFailed': 'Internet baglantinizi kontrol edin.',
        'auth.tooManyRequests': 'Cok fazla deneme yaptiniz. Lutfen biraz bekleyin.',
        'auth.invalidApiKey': 'Uygulama yapilandirmasinda hata var.',
        'auth.appNotAuthorized': 'Bu domain icin yetki verilmemis.',
        'auth.userNotFound': 'Bu e-posta adresiyle kayitli kullanici bulunamadi.',
        'auth.wrongPassword': 'Sifre hatali. Lutfen tekrar deneyin.',
        'auth.invalidCredential': 'E-posta veya sifre hatali.',
        'auth.sessionNotFound': 'Oturum bulunamadi',
        'auth.unknownError': 'Beklenmeyen bir hata olustu. Lutfen tekrar deneyin.',
        'auth.loginLink': 'Giris yap',
        'error.configLoad': 'Uygulama yapilandirmasi yuklenemedi. Lutfen internet baglantinizi kontrol edip tekrar deneyin.',
        'error.configMissing': 'Uygulama yapilandirmasinda eksik bir ayar var. Lutfen daha sonra tekrar deneyin.',
        'error.natalCalc': 'Dogum haritasi hesaplanamadi (HTTP {status})',
        'error.dailyTransit': 'Gunluk gokyuzu verisi alinamadi (HTTP {status})',

        // Aylar (profile.html'de kullanilir)
        'months': ['Ocak','Subat','Mart','Nisan','Mayis','Haziran','Temmuz','Agustos','Eylul','Ekim','Kasim','Aralik']
    },

    // ------------------------------ ENGLISH
    en: {
        // General / Common
        'app.name': 'Astro Notlarim',
        'app.loading': 'Loading...',
        'app.checkingSession': 'Checking session...',
        'app.offline': 'Waiting for internet connection...',
        'nav.home': 'Home',
        'nav.ask': 'Ask',
        'nav.chart': 'Chart',
        'nav.profile': 'Profile',
        'nav.logout': 'Logout',
        'nav.menu': 'Menu',
        'btn.close': 'Close',
        'btn.save': 'Save',
        'btn.cancel': 'Cancel',
        'btn.approve': 'Approve & Start',
        'btn.update': 'Update',
        'btn.delete': 'Delete',
        'btn.edit': 'Edit',
        'loading': 'Loading...',
        'error.generic': 'An unexpected error occurred.',
        'error.requiredField': 'Please fill in all fields.',

        // index.html (Splash)
        'splash.loading': 'Starting...',
        'splash.checking': 'Checking session...',
        'splash.offline': 'Waiting for internet connection...',

        // login.html (Login)
        'login.title': 'Login',
        'login.emailPlaceholder': 'Email',
        'login.passwordPlaceholder': 'Password',
        'login.btnLogin': 'Login',
        'login.btnGoogle': 'Continue with Google',
        'login.forgotPassword': 'Forgot password',
        'login.noAccount': 'Not a member?',
        'login.registerLink': 'Register',
        'login.errorEmail': 'Please enter a valid email address.',
        'login.errorPassword': 'Password field cannot be left blank.',
        'login.loggingIn': 'Logging in...',
        'login.forgotAlert': 'Please enter a valid email address first.',
        'login.resetSent': 'Password reset link has been sent to {email}.',

        // register.html (Register)
        'register.title': 'Register',
        'register.fullnamePlaceholder': 'Full Name',
        'register.emailPlaceholder': 'Email',
        'register.passwordPlaceholder': 'Password',
        'register.confirmPasswordPlaceholder': 'Confirm Password',
        'register.btnRegister': 'Register',
        'register.hasAccount': 'Already a member?',
        'register.loginLink': 'Login',
        'register.errorFullname': 'Please enter your full name.',
        'register.errorEmail': 'Please enter a valid email address.',
        'register.errorPassword': 'Password must be at least 6 characters.',
        'register.errorConfirm': 'Passwords do not match.',
        'register.creating': 'Creating account...',
        'register.errorGender': 'Please select your gender.',

        // terms.html (Legal Consent)
        'terms.title': 'Legal Consent and Privacy Policy',
        'terms.pageTitle': 'Legal Consent & Privacy',
        'terms.verificationAlert': 'You must click the verification link sent to your email before continuing.',
        'terms.resend': 'Resend verification email',
        'terms.intro': 'Please read the following terms of use and privacy policy carefully before using the Astro Notlarim platform.',
        'terms.section1Title': '1. Terms of Use',
        'terms.section1Text': 'By using the services provided by Astro Notlarim, you irrevocably accept all terms on this page.',
        'terms.section2Title': '2. Privacy Policy & GDPR',
        'terms.section2Text': 'The security of your personal data is extremely important to us. Data shared during registration is protected under data protection regulations.',
        'terms.section3Title': '3. Data Processing Purposes',
        'terms.section3Text': 'Your collected data is processed for account security and experience personalization.',
        'terms.btnCancel': 'Cancel',
        'terms.btnWaiting': 'Waiting for Email Verification...',
        'terms.btnApprove': 'Approve & Start',
        'terms.creatingProfile': 'Creating your profile...',
        'terms.sessionExpired': 'Session expired or not found. Please fill out the registration form again.',
        'terms.emailNotVerified': 'Your email address has not been verified yet.',
        'terms.success': 'Your account has been successfully created! You can now log in.',
        'terms.resendSuccess': 'Verification email has been resent. Please check your inbox.',
        'terms.resendError': 'An error occurred while sending email: {error}',
        'terms.canceling': 'Canceling...',

        // birthinfo.html (Birth Info)
        'birthinfo.title': 'Birth Information',
        'birthinfo.gender': 'Gender',
        'birthinfo.genderFemale': 'Female',
        'birthinfo.genderMale': 'Male',
        'birthinfo.fullnamePlaceholder': 'Full Name',
        'birthinfo.birthDate': 'Birth Date',
        'birthinfo.day': 'Day',
        'birthinfo.month': 'Month',
        'birthinfo.months': 'January,February,March,April,May,June,July,August,September,October,November,December',
        'birthinfo.year': 'Year',
        'birthinfo.birthTime': 'Birth Time',
        'birthinfo.hour': 'Hour',
        'birthinfo.minute': 'Minute',
        'birthinfo.birthPlace': 'Birth Place',
        'birthinfo.birthPlacePlaceholder': 'Birth Place (Search city...)',
        'birthinfo.btnSave': 'Save',
        'birthinfo.calculating': 'Calculating...',
        'birthinfo.errorAllFields': 'Please fill in all fields.',
        'birthinfo.errorSelectCity': 'Please select a city from the list.',
        'birthinfo.errorSession': 'Session not found. Please log in again.',
        'birthinfo.errorGeneric': 'Error: {error}',

        // dashboard.html (Dashboard)
        'dashboard.greeting': 'Hello',
        'dashboard.userDefault': 'User',
        'dashboard.sun': 'Sun',
        'dashboard.moon': 'Moon',
        'dashboard.rising': 'Rising',
        'dashboard.loadingSpinner': 'Loading daily horoscope...',
        'dashboard.dailyHoroscope': "Today's Sky Journal",
        'dashboard.love': 'Love',
        'dashboard.career': 'Career',
        'dashboard.money': 'Money',
        'dashboard.health': 'Health',
        'dashboard.luckyNumber': 'Lucky Number',
        'dashboard.luckyColor': 'Lucky Color',
        'dashboard.luckyTime': 'Lucky Time',
        'dashboard.missingInfo': 'Your birth information is missing.',
        'dashboard.loadingError': 'An error occurred while loading the daily horoscope.',
        'dashboard.noHoroscope': 'No special comment found for today.',
        'dashboard.categorySoon': 'Comments for this category will be added soon.',

        // natal.html (Natal Chart)
        'natal.title': 'Natal Chart',
        'natal.pageTitle': 'Natal Chart',
        'natal.loading': 'Loading natal chart...',
        'natal.notFound': 'Natal chart data not found.',
        'natal.loadingError': 'An error occurred while loading data.',
        'natal.planets': 'Planets & Points',
        'natal.houses': 'Houses',
        'natal.aspects': 'Aspects',
        'natal.angleDetails': 'Angle Details',
        'natal.interpretations': 'Interpretations',
        'natal.retrograde': 'R',
        'natal.houseSuffix': 'th House',
        'natal.chartPlaceholder': 'Chart image not available',
        'natal.angleAsc': 'Ascendant (ASC)',
        'natal.angleMc': 'Midheaven (MC)',
        'natal.angleIc': 'Imum Coeli (IC)',
        'natal.angleDc': 'Descendant (DC)',
        'natal.commentTitle': 'Comment {number}',

        // ask.html (Ask)
        'ask.title': 'Ask',
        'ask.comingSoon': 'Chat screen will be here.',

        // profile.html (Profile)
        'profile.title': 'Profile',
        'profile.birthInfo': 'Birth Information',
        'profile.birthDate': 'Birth Date',
        'profile.birthTime': 'Birth Time',
        'profile.birthPlace': 'Birth Place',
        'profile.sunSign': 'Sun Sign',
        'profile.moonSign': 'Moon Sign',
        'profile.risingSign': 'Rising Sign',
        'profile.noBirthInfo': 'Your birth information is not yet recorded.',
        'profile.addBirthInfo': 'Add Birth Information',
        'profile.account': 'Account',
        'profile.updateBirthInfo': 'Update Birth Information',
        'profile.deleteAccount': 'Delete My Account',
        'profile.deleteConfirm': 'Are you sure you want to permanently delete your account and all data? This action cannot be undone.',
        'profile.reauthRequired': 'For security reasons, you need to log in again before deleting your account.',
        'profile.deleteError': 'An error occurred while deleting account: {error}',

        // Side Menu
        'menu.home': 'Home',
        'menu.natalChart': 'Natal Chart',
        'menu.ask': 'Ask',
        'menu.profile': 'Profile',

        // firebase-service.js error messages
        'auth.emailInUse': 'This email address is already registered. Would you like to log in?',
        'auth.invalidEmail': 'Invalid email address. Please check.',
        'auth.weakPassword': 'Password is too weak. Use at least 6 characters.',
        'auth.operationNotAllowed': 'Email/password login is not active in Firebase console.',
        'auth.networkFailed': 'Please check your internet connection.',
        'auth.tooManyRequests': 'Too many attempts. Please wait a while.',
        'auth.invalidApiKey': 'There is an error in the app configuration.',
        'auth.appNotAuthorized': 'Not authorized for this domain.',
        'auth.userNotFound': 'No user found with this email address.',
        'auth.wrongPassword': 'Incorrect password. Please try again.',
        'auth.invalidCredential': 'Email or password is incorrect.',
        'auth.sessionNotFound': 'Session not found',
        'auth.unknownError': 'An unexpected error occurred. Please try again.',
        'auth.loginLink': 'Log in',
        'error.configLoad': 'App configuration could not be loaded. Please check your internet connection and try again.',
        'error.configMissing': 'There is a missing setting in the app configuration. Please try again later.',
        'error.natalCalc': 'Natal chart calculation failed (HTTP {status})',
        'error.dailyTransit': 'Daily sky data could not be retrieved (HTTP {status})',

        // Months (used in profile.html)
        'months': ['January','February','March','April','May','June','July','August','September','October','November','December']
    }
};

// ============================================================
// 2. DIL MOTORU
// ============================================================

const i18n = {
    _currentLang: I18N_CONFIG.defaultLang,

    /**
     * Sistem dilini algila ve desteklenen dile eslestir
     */
    detectLanguage() {
        // Once localStorage'dan kullanici tercihine bak
        const saved = localStorage.getItem(I18N_CONFIG.storageKey);
        if (saved && I18N_CONFIG.supportedLangs.includes(saved)) {
            return saved;
        }

        // Yoksa telefon sistem dilini algila
        const systemLang = (navigator.language || navigator.userLanguage || 'tr').toLowerCase();
        const baseLang = systemLang.split('-')[0]; // "en-US" -> "en"

        if (I18N_CONFIG.supportedLangs.includes(baseLang)) {
            return baseLang;
        }

        return I18N_CONFIG.defaultLang;
    },

    /**
     * Dili baslat (sayfa yuklenirken cagrilmali)
     */
    init() {
        this._currentLang = this.detectLanguage();
        this.apply();
    },

    /**
     * Aktif dili dondurur
     */
    getLanguage() {
        return this._currentLang;
    },

    /**
     * Dili degistir ve kaydet
     */
    setLanguage(lang) {
        if (!I18N_CONFIG.supportedLangs.includes(lang)) {
            console.warn('[i18n] Desteklenmeyen dil:', lang);
            return;
        }
        this._currentLang = lang;
        localStorage.setItem(I18N_CONFIG.storageKey, lang);
        this.apply();
    },

    /**
     * Desteklenen diller listesi
     */
    getSupportedLanguages() {
        return I18N_CONFIG.supportedLangs;
    },

    /**
     * Ceviri getir - destekler: t('key') ve t('key', {param: 'value'})
     */
    t(key, params) {
        const dict = TRANSLATIONS[this._currentLang] || TRANSLATIONS[I18N_CONFIG.defaultLang];
        let text = dict[key];

        if (text === undefined) {
            // Fallback: default dile bak
            const defaultDict = TRANSLATIONS[I18N_CONFIG.defaultLang];
            text = defaultDict[key];
            if (text === undefined) {
                console.warn(`[i18n] Ceviri bulunamadi: "${key}" (${this._currentLang})`);
                return key;
            }
        }

        // Parametre degistirme: {param} -> value
        if (params && typeof text === 'string') {
            for (const [k, v] of Object.entries(params)) {
                text = text.replace(new RegExp(`{${k}}`, 'g'), v);
            }
        }

        return text;
    },

    /**
     * Ozel: Aylari dondur (profile.html icin)
     */
    getMonths() {
        return this.t('months');
    },

    /**
     * Sayfadaki tum data-i18n elemanlarini cevir
     */
    apply() {
        // 1. data-i18n attribute'u olan elemanlar
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (!key) return;

            const translation = this.t(key);

            // Eger data-i18n-attr varsa, o attribute'u cevir (placeholder, title, vb.)
            const attr = el.getAttribute('data-i18n-attr');
            if (attr) {
                el.setAttribute(attr, translation);
            } else {
                el.textContent = translation;
            }
        });

        // 2. data-i18n-html attribute'u olan elemanlar (HTML icerik)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (!key) return;
            // XSS korumasi: escapeHtml varsa kullan
            const raw = this.t(key);
            const safe = (typeof window.AstroService !== 'undefined' && AstroService.escapeHtml)
                ? AstroService.escapeHtml(raw)
                : raw;
            el.innerHTML = safe;
        });

        // 3. select elementlerinin option'larini cevir (data-i18n-options)
        document.querySelectorAll('[data-i18n-options]').forEach(select => {
            const key = select.getAttribute('data-i18n-options');
            if (!key) return;
            const value = this.t(key);
            if (typeof value === 'string') {
                const items = value.split(',');
                // Ilk option'u (placeholder) koru, gerisini degistir
                const placeholder = select.querySelector('option[disabled][selected]');
                select.innerHTML = '';
                if (placeholder) select.appendChild(placeholder);
                items.forEach((item, idx) => {
                    const opt = document.createElement('option');
                    opt.value = idx + 1;
                    opt.textContent = item.trim();
                    select.appendChild(opt);
                });
            }
        });

        // 4. Sayfa basligini guncelle
        const pageTitleEl = document.querySelector('[data-i18n-page-title]');
        if (pageTitleEl) {
            const key = pageTitleEl.getAttribute('data-i18n-page-title');
            document.title = this.t(key) + ' | ' + this.t('app.name');
        }

        // 5. HTML lang attribute'unu guncelle
        document.documentElement.lang = this._currentLang === 'tr' ? 'tr' : 'en';
    }
};

// Sayfa yuklendiginde otomatik uygula
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}

// Global scope'a export et
window.i18n = i18n;
