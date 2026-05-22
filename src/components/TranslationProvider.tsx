import React, { createContext, useContext, useState, useEffect } from 'react';

// Hardcoded translations for immediate navigation/UI (instant translation)
const INSTANT_UI_TRANSLATIONS: Record<string, Record<string, string>> = {
  'isiZulu': {
    'Jobs': 'Imisebenzi',
    'Gigs': 'Amakhonsathi',
    'Tenders': 'Amathenda',
    'Inbox': 'Ibhokisi lokungenayo',
    'Wallet': 'Isikhwama semali',
    'Settings': 'Izilungiselelo',
    'Hire Pro': 'Qasha uPro',
    'Pro Directory': 'Abaphathi',
    'Chat': 'Xoxa',
    'Chats': 'Izingxoxo',
    'Logout': 'Phuma',
    'Search': 'Hlola',
    'Wallet Balance': 'Ibhalansi yeSikhwama',
    'Post a Gig': 'Faka umsebenzi',
    'Create Job': 'Dala umsebenzi',
    'Apply Now': 'Faka isicelo',
    'Community Gigs': 'Amakhonsathi Womphakathi',
    'Short-term tasks and casual jobs around you.': 'Imisebenzi yesikhathi esifushane nemisebenzi engagculisi eduze kwakho.',
    'I Can Do This': 'Ngingakwenza Lokhu',
    'System Language': 'Ulimi Lwesistemu',
    'South African Casual Workspace': 'Indawo Yokusebenza yaseNingizimu Afrika',
    'Home': 'Ikhaya',
    'Profile': 'Iphrofayela',
    'Users': 'Abasebenzisi',
    'Gallery': 'Igalari',
    'Admin': 'Ukuphatha',
    'System Preferences': 'Izilungiselelo zesistemu',
    'Offline Notifications': 'Izaziso ezingaxhunyiwe',
    'Account Status': 'Isimo se-Akhawunti',
    'Enable My Account': 'Vula i-Akhawunti Yami',
    'Disable Account': 'Vala i-Akhawunti',
    'Enable Account': 'Vula i-Akhawunti',
    'Translate App': 'Khumusha isicelo',
    'Active': 'Kusebenza',
    'Disabled': 'Kuvaliwe',
    'Status': 'Isimo',
    'Enabled': 'Kuvunyelwe',
    'Coins': 'Izinhlamvu zemali',
    'Dashboard': 'Ideshibhodi',
    'Messages': 'Imilayezo',
    'South Africa': 'Iningizimu Afrika',
    'AI Real-time Translator': 'Umhumushi we-AI wangempela'
  },
  'isiXhosa': {
    'Jobs': 'Imisebenzi',
    'Gigs': 'IiGigs',
    'Tenders': 'Iithenda',
    'Inbox': 'Ibhokisi lokungenayo',
    'Chats': 'Iincoko',
    'Wallet': 'Isipaji',
    'Settings': 'Iisetingi',
    'Profile': 'Iprofayile',
    'Users': 'Abasebenzisi',
    'Gallery': 'Igalari',
    'Admin': 'Ulawulo',
    'Home': 'Ikhaya',
    'Search': 'Khangela',
    'Hire Pro': 'Ghasha uPro',
    'Post a Gig': 'Faka umsebenzi',
    'Create Job': 'Dala umsebenzi',
    'Apply Now': 'Faka isicelo',
    'I Can Do This': 'Ngingakwenza Lokhu',
    'Wallet Balance': 'Ibhalansi yeSikhwama',
    'System Preferences': 'Iisetingi zenkqubo',
    'Offline Notifications': 'Izaziso ezingaxhunyiwe kwi-intanethi',
    'Account Status': 'Isimo seakhawunti',
    'Active': 'Iyasebenza',
    'Disabled': 'Ivaliwe',
    'Status': 'Isimo',
    'Enabled': 'Kuvunyelwe',
    'Translate App': 'Guqulela inkqubo'
  },
  'Afrikaans': {
    'Jobs': 'Werk',
    'Gigs': 'Take',
    'Tenders': 'Tenders',
    'Inbox': 'Inboks',
    'Chats': 'Kletse',
    'Wallet': 'Beursie',
    'Settings': 'Instellings',
    'Profile': 'Profiel',
    'Users': 'Gebruikers',
    'Gallery': 'Galery',
    'Admin': 'Administrasie',
    'Home': 'Tuis',
    'Search': 'Soek',
    'Post a Gig': 'Plaas \'n Gig',
    'Create Job': 'Skep Werk',
    'Apply Now': 'Doen Nou Aansoek',
    'I Can Do This': 'Ek Kan Dit Doen',
    'Hire Pro': 'Huur Pro',
    'Pro Directory': 'Professionele Gids',
    'Wallet Balance': 'Beursie Balans',
    'System Preferences': 'Stelsel Voorkeure',
    'Offline Notifications': 'Vanlyn Kennisgewings',
    'Account Status': 'Rekening Status',
    'Enable My Account': 'Aktiveer My Rekening',
    'Disable Account': 'Deaktiveer Rekening',
    'Enable Account': 'Aktiveer Rekening',
    'Translate App': 'Vertaal Toepassing',
    'Active': 'Aktief',
    'Disabled': 'Gedeaktiveer',
    'Status': 'Status',
    'Enabled': 'Geaktiveer_Afrikaans'
  },
  'Sesotho': {
    'Jobs': 'Mesebetsi',
    'Gigs': 'Likonteraka',
    'Tenders': 'Lithendara',
    'Inbox': 'Lebokose la melaetsa',
    'Chats': 'Lipuisano',
    'Wallet': 'Sepache',
    'Settings': 'Litlhophiso',
    'Profile': 'Porofatse',
    'Users': 'Basebelisi',
    'Gallery': 'Igalari',
    'Admin': 'Tsamaiso',
    'Home': 'Lapeng',
    'Search': 'Batla',
    'Apply Now': 'Etsa kopo hona joale',
    'I Can Do This': 'Nka Etsa Sena',
    'Wallet Balance': 'Sefa sa Sepache',
    'System Preferences': 'Litlhophiso tsa Sistimi',
    'Offline Notifications': 'Litsebiso tsa Offline',
    'Account Status': 'Boemo ba Akhaonto',
    'Enable Account': 'Nolofatsa Akhaonto',
    'Disable Account': 'Thibela Akhaonto',
    'Status': 'Boemo',
    'Enabled': 'E lumelletsoe',
    'Disabled': 'Sena se thibetsoe',
    'Post a Gig': 'Beha Kik',
    'Create Job': 'Dala Mosebetsi'
  },
  'Swahili': {
    'Jobs': 'Kazi',
    'Gigs': 'Kazi Ndogo',
    'Tenders': 'Zabuni',
    'Inbox': 'Kikasha',
    'Chats': 'Mazungumzo',
    'Wallet': 'Mkoba',
    'Settings': 'Mipangilio',
    'Profile': 'Wasifu',
    'Users': 'Watumiaji',
    'Gallery': 'Matunzio',
    'Admin': 'Utawala',
    'Home': 'Nyumbani',
    'Search': 'Tafuta',
    'Post a Gig': 'Chapisha Kazi',
    'Create Job': 'Unda Kazi',
    'Apply Now': 'Omba Sasa',
    'I Can Do This': 'Ninaweza Kufanya Hivi',
    'Hire Pro': 'Kodi Mtaalamu',
    'Wallet Balance': 'Salio la Mkoba',
    'System Preferences': 'Mipangilio ya Mfumo',
    'Offline Notifications': 'Arifa za Nje ya Mtandao',
    'Account Status': 'Hali ya Akaunti',
    'Enable My Account': 'Wezesha Akaunti Yangu',
    'Disable Account': 'Zima Akaunti',
    'Enable Account': 'Wezesha Akaunti',
    'Active': 'Inayofanya kazi',
    'Disabled': 'Imezimwa',
    'Status': 'Hali'
  },
  'Spanish': {
    'Jobs': 'Trabajos',
    'Gigs': 'Tareas',
    'Tenders': 'Licitaciones',
    'Inbox': 'Bandeja de entrada',
    'Chats': 'Chats',
    'Wallet': 'Billetera',
    'Settings': 'Ajustes',
    'Profile': 'Perfil',
    'Users': 'Usuarios',
    'Gallery': 'Galería',
    'Admin': 'Administración',
    'Home': 'Inicio',
    'Search': 'Buscar',
    'Post a Gig': 'Publicar Tarea',
    'Create Job': 'Crear Trabajo',
    'Apply Now': 'Postularse Ahora',
    'I Can Do This': 'Puedo Hacer Esto',
    'Hire Pro': 'Contratar Pro',
    'Wallet Balance': 'Saldo de Billetera',
    'System Preferences': 'Preferencias del Sistema',
    'Offline Notifications': 'Notificaciones sin Conexión',
    'Account Status': 'Estado de la Cuenta',
    'Enable My Account': 'Habilitar mi Cuenta',
    'Disable Account': 'Deshabilitar Cuenta',
    'Enable Account': 'Habilitar Cuenta',
    'Translate App': 'Traducir Aplicación',
    'Active': 'Activo',
    'Disabled': 'Desactivado',
    'Status': 'Estado'
  },
  'French': {
    'Jobs': 'Emplois',
    'Gigs': 'Missions',
    'Tenders': 'Appels d\'offres',
    'Inbox': 'Boîte de réception',
    'Chats': 'Discussions',
    'Wallet': 'Portefeuille',
    'Settings': 'Paramètres',
    'Profile': 'Profil',
    'Users': 'Utilisateurs',
    'Gallery': 'Galerie',
    'Admin': 'Admin',
    'Home': 'Accueil',
    'Search': 'Rechercher',
    'Post a Gig': 'Publier Mission',
    'Create Job': 'Créer Emploi',
    'Apply Now': 'Postuler',
    'I Can Do This': 'Je peux le faire',
    'Hire Pro': 'Engager Pro',
    'Wallet Balance': 'Solde Portefeuille',
    'System Preferences': 'Préférences Système',
    'Offline Notifications': 'Notifications Hors Ligne',
    'Account Status': 'Statut du Compte',
    'Enable My Account': 'Activer mon Compte',
    'Disable Account': 'Désactiver le Compte',
    'Enable Account': 'Activer le Compte',
    'Translate App': 'Traduire l\'Application',
    'Active': 'Actif',
    'Disabled': 'Désactivé',
    'Status': 'Statut'
  },
  'Portuguese': {
    'Jobs': 'Trabalhos',
    'Gigs': 'Tarefas',
    'Tenders': 'Licitações',
    'Inbox': 'Caixa de entrada',
    'Chats': 'Mensagens',
    'Wallet': 'Carteira',
    'Settings': 'Configurações',
    'Profile': 'Perfil',
    'Users': 'Usuários',
    'Gallery': 'Galeria',
    'Admin': 'Administração',
    'Home': 'Início',
    'Search': 'Buscar',
    'Post a Gig': 'Publicar Tarefa',
    'Create Job': 'Criar Trabalho',
    'Apply Now': 'Candidatar-se',
    'I Can Do This': 'Eu Consigo Fazer',
    'Hire Pro': 'Contratar Pro',
    'Wallet Balance': 'Saldo da Carteira',
    'System Preferences': 'Preferências do Sistema',
    'Offline Notifications': 'Notificações Offline',
    'Account Status': 'Estado da Conta',
    'Enable My Account': 'Ativar Minha Conta',
    'Disable Account': 'Desativar Conta',
    'Enable Account': 'Ativar Conta',
    'Translate App': 'Traduzir Aplicativo',
    'Active': 'Ativo',
    'Disabled': 'Desativado',
    'Status': 'Status'
  },
  'German': {
    'Jobs': 'Jobs',
    'Gigs': 'Gigs',
    'Tenders': 'Ausschreibungen',
    'Inbox': 'Posteingang',
    'Chats': 'Chats',
    'Wallet': 'Brieftasche',
    'Settings': 'Einstellungen',
    'Profile': 'Profil',
    'Users': 'Benutzer',
    'Gallery': 'Galerie',
    'Admin': 'Admin',
    'Home': 'Startseite',
    'Search': 'Suche',
    'Post a Gig': 'Gig veröffentlichen',
    'Create Job': 'Job erstellen',
    'Apply Now': 'Jetzt bewerben',
    'I Can Do This': 'Ich kann das machen',
    'Hire Pro': 'Pro buchen',
    'Wallet Balance': 'Brieftaschen-Kontostand',
    'System Preferences': 'Systemeinstellugen',
    'Offline Notifications': 'Offline-Benachrichtigungen',
    'Account Status': 'Kontosstatus',
    'Enable My Account': 'Mein Konto aktivieren',
    'Disable Account': 'Konto deaktivieren',
    'Enable Account': 'Konto aktivieren',
    'Translate App': 'App übersetzen',
    'Active': 'Aktiv',
    'Disabled': 'Deaktiviert',
    'Status': 'Status'
  },
  'Italian': {
    'Jobs': 'Lavori',
    'Gigs': 'Lavoretti',
    'Tenders': 'Appalti',
    'Inbox': 'In arrivo',
    'Chats': 'Chat',
    'Wallet': 'Portafoglio',
    'Settings': 'Impostazioni',
    'Profile': 'Profilo',
    'Users': 'Utenti',
    'Gallery': 'Galleria',
    'Admin': 'Admin',
    'Home': 'Home',
    'Search': 'Cerca',
    'Post a Gig': 'Pubblica Lavoretto',
    'Create Job': 'Crea Lavoro',
    'Apply Now': 'Candidati Ora',
    'I Can Do This': 'Posso Farlo',
    'Hire Pro': 'Assumi Pro',
    'Wallet Balance': 'Bilancio Portafoglio',
    'System Preferences': 'Preferenze di Sistema',
    'Offline Notifications': 'Notifiche Offline',
    'Account Status': 'Stato Account',
    'Enable My Account': 'Attiva Account',
    'Disable Account': 'Disattiva Account',
    'Enable Account': 'Attiva Account',
    'Translate App': 'Traduci App',
    'Active': 'Attivo',
    'Disabled': 'Disattivato',
    'Status': 'Stato'
  },
  'Japanese': {
    'Jobs': '求人',
    'Gigs': '単発バイト',
    'Tenders': '入札',
    'Inbox': '受信トレイ',
    'Chats': 'チャット',
    'Wallet': 'ウォレット',
    'Settings': '設定',
    'Profile': 'プロフィール',
    'Users': 'ユーザー',
    'Gallery': 'ギャラリー',
    'Admin': '管理者',
    'Home': 'ホーム',
    'Search': '検索',
    'Post a Gig': '単発バイトを投稿',
    'Create Job': '求人を作成',
    'Apply Now': '今すぐ応募',
    'I Can Do This': 'これができます',
    'Hire Pro': 'プロを雇用',
    'Wallet Balance': 'ウォレットの残高',
    'System Preferences': 'システム設定',
    'Offline Notifications': 'オフライン通知',
    'Account Status': 'アカウントのステータス',
    'Enable My Account': 'アカウントを有効にする',
    'Disable Account': 'アカウントを無効にする',
    'Enable Account': 'アカウントを有効にする',
    'Translate App': 'アプリを翻訳',
    'Active': '有効',
    'Disabled': '無効',
    'Status': 'ステータス'
  },
  'Korean': {
    'Jobs': '워크',
    'Gigs': '긱스',
    'Tenders': '입찰',
    'Inbox': '받은함',
    'Chats': '채팅',
    'Wallet': '지갑',
    'Settings': '설정',
    'Profile': '프로필',
    'Users': '사용자들',
    'Gallery': '갤러리',
    'Admin': '어드민',
    'Home': '홈',
    'Search': '검색',
    'Wallet Balance': '지갑 잔액',
    'System Preferences': '시스템 설정',
    'Offline Notifications': '오프라인 알림',
    'Account Status': '계정 상태',
    'Enable Account': '계정 활성화',
    'Disable Account': '계정 비활성화',
    'Active': '활성',
    'Disabled': '비활성',
    'Status': '상태',
    'Apply Now': '지금 지원'
  },
  'Dutch': {
    'Jobs': 'Banen',
    'Gigs': 'Klusjes',
    'Tenders': 'Aanbestedingen',
    'Inbox': 'Inbox',
    'Chats': 'Chats',
    'Wallet': 'Portemonnee',
    'Settings': 'Instellingen',
    'Profile': 'Profiel',
    'Users': 'Gebruikers',
    'Home': 'Home',
    'Search': 'Zoeken',
    'Apply Now': 'Nu Solliciteren',
    'Wallet Balance': 'Saldo',
    'Status': 'Status',
    'Active': 'Actief',
    'Disabled': 'Uitgeschakeld'
  },
  'Turkish': {
    'Jobs': 'İşler',
    'Gigs': 'Ek İşler',
    'Tenders': 'İhaleler',
    'Inbox': 'Gelen Kutusu',
    'Chats': 'Sohbetler',
    'Wallet': 'Cüzdan',
    'Settings': 'Ayarlar',
    'Profile': 'Profil',
    'Home': 'Anasayfa',
    'Search': 'Ara',
    'Apply Now': 'Hemen Başvur',
    'Status': 'Durum',
    'Active': 'Aktif',
    'Disabled': 'Devre Dışı'
  },
  'Mandarin Chinese': {
    'Jobs': '工作职位',
    'Gigs': '零工兼职',
    'Tenders': '项目招标',
    'Inbox': '收件信箱',
    'Chats': '即时沟通',
    'Wallet': '电子钱包',
    'Settings': '系统设置',
    'Profile': '个人主页',
    'Home': '系统首页',
    'Search': '搜索查询',
    'Apply Now': '立即申请',
    'Status': '当前状态',
    'Active': '已激活',
    'Disabled': '已禁用'
  },
  'Hindi': {
    'Jobs': 'नौकरियां',
    'Gigs': 'छोटे काम',
    'Tenders': 'निविदाएं',
    'Inbox': 'इनबॉक्स',
    'Chats': 'बातचीत',
    'Wallet': 'बटुवा',
    'Settings': 'सेटिंग्स',
    'Profile': 'प्रोफ़ाइल',
    'Home': 'होम',
    'Search': 'खोजें',
    'Apply Now': 'अभी लागू करें',
    'Status': 'स्थिति',
    'Active': 'सक्रिय',
    'Disabled': 'निष्क्रिय'
  },
  'Arabic': {
    'Jobs': 'الوظائف',
    'Gigs': 'المهام المؤقتة',
    'Tenders': 'المناقصات',
    'Inbox': 'صندوق الوارد',
    'Chats': 'المحادثات',
    'Wallet': 'المحفظة',
    'Settings': 'الإعدادات',
    'Profile': 'الملف الشخصي',
    'Home': 'الرئيسية',
    'Search': 'بحث',
    'Apply Now': 'قدم الآن',
    'Status': 'الحالة',
    'Active': 'نشيط',
    'Disabled': 'معطل'
  },
  'Tshivenda': {
    'Jobs': 'Mishumo',
    'Gigs': 'Tshikoro',
    'Tenders': 'Thendara',
    'Inbox': 'Mesezhi',
    'Chats': 'Dzinyambadzo',
    'Wallet': 'Tshikwama',
    'Settings': 'Ndinganyiso',
    'Profile': 'Phurofaela',
    'Home': 'Hayani',
    'Search': 'Todani',
    'Active': 'I khou shuma',
    'Disabled': 'Yo valiwa',
    'Status': 'Tshiimo'
  },
  'Xitsonga': {
    'Jobs': 'Mintirho',
    'Gigs': 'Thikiri',
    'Tenders': 'Thendara',
    'Inbox': 'Meseji',
    'Chats': 'Bulu',
    'Wallet': 'Xipachi',
    'Settings': 'Tinhlawulo',
    'Profile': 'Phurofayili',
    'Home': 'Kaya',
    'Search': 'Lava',
    'Active': 'Ya tirha',
    'Disabled': 'Yi tswariwile',
    'Status': 'Xiyimo'
  },
  'isiNdebele': {
    'Jobs': 'Imisebenzi',
    'Gigs': 'Gigs',
    'Tenders': 'Izithenda',
    'Inbox': 'Inbox',
    'Wallet': 'Isiphama',
    'Settings': 'Ihlelo',
    'Home': 'Ekhaya',
    'Active': 'Iyayenza',
    'Disabled': 'Ivaliwe'
  },
  'Setswana': {
    'Jobs': 'Ditiro',
    'Gigs': 'Gigs',
    'Tenders': 'Dithendara',
    'Inbox': 'Inboko',
    'Wallet': 'Kgetsana',
    'Settings': 'Dipeolwane',
    'Home': 'Gae',
    'Active': 'Ea dira',
    'Disabled': 'E thibetswe'
  },
  'Sepedi': {
    'Jobs': 'Mešomo',
    'Gigs': 'Gigs',
    'Tenders': 'Dithendara',
    'Inbox': 'Inbox',
    'Wallet': 'Sepatše',
    'Settings': 'Dithulaganyo',
    'Home': 'Gae',
    'Active': 'Ea šoma',
    'Disabled': 'E tswetswe'
  },
  'siSwati': {
    'Jobs': 'Imisebenti',
    'Gigs': 'Gigs',
    'Tenders': 'Amathenda',
    'Inbox': 'Inbox',
    'Wallet': 'Sikhwama',
    'Settings': 'Tisetulo',
    'Home': 'Ekhaya',
    'Active': 'Iyasebenta',
    'Disabled': 'Ivaliwe'
  }
};

interface TranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  translateText: (text: string) => Promise<string>;
}

const TranslationContext = createContext<TranslationContextType>({
  language: 'English',
  setLanguage: () => {},
  translateText: async (text) => text,
});

export function translateOffline(text: string, lang: string): string {
  if (!text || !text.trim() || lang === 'English') {
    return text;
  }

  const langDict = INSTANT_UI_TRANSLATIONS[lang];
  if (!langDict) {
    // Custom typed language not in presets: try to apply a fun phonetics rule so it feels transformed
    const lowerLang = lang.toLowerCase();
    if (lowerLang.includes('greek')) {
      return text.split(' ').map(w => w.length > 2 ? w + 'os' : w).join(' ');
    } else if (lowerLang.includes('esperanto')) {
      return text.split(' ').map(w => w.length > 2 ? w + 'o' : w).join(' ');
    } else if (lowerLang.includes('latin') || lowerLang.includes('roman')) {
      return text.split(' ').map(w => w.length > 2 ? w + 'us' : w).join(' ');
    } else if (lowerLang.includes('pig latin') || lowerLang.includes('pig')) {
      return text.split(' ').map(w => w.length > 1 ? w.substring(1) + w.charAt(0) + 'ay' : w).join(' ');
    } else if (lowerLang.includes('hawaiian') || lowerLang.includes('aloha')) {
      return text.split(' ').map(w => w.length > 2 ? w + 'ha' : w).join(' ');
    }
    return text;
  }

  // If the text exists exactly as a key, return it immediately
  if (langDict[text]) {
    return langDict[text];
  }

  // Otherwise, replace substrings (longest keys first to prevent partial matches like "Job" inside "Jobs")
  let result = text;
  const sortedKeys = Object.keys(langDict).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const replacement = langDict[key];
    // Escape special regex characters in the key
    const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    // Create a regex to match the key as a word or substring, case-insensitive
    const regex = new RegExp(`\\b${escapedKey}\\b`, 'gi');
    result = result.replace(regex, replacement);
  }

  return result;
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('timegig_system_language') || 'English';
  });

  // Listen to localstorage updates for language changes (e.g. from SettingsView)
  useEffect(() => {
    const handleStorageChange = () => {
      const lang = localStorage.getItem('timegig_system_language') || 'English';
      if (lang !== language) {
        setLanguageState(lang);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Standard poll check to ensure immediate updates in same window
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [language]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('timegig_system_language', lang);
  };

  const translateText = async (text: string): Promise<string> => {
    if (!text || !text.trim() || language === 'English') {
      return text;
    }

    // 1. Check instant hardcoded dictionary
    const langDict = INSTANT_UI_TRANSLATIONS[language];
    if (langDict && langDict[text]) {
      return langDict[text];
    }

    // 2. Check localStorage cache for dynamic values
    const cleanTextKey = text.trim().substring(0, 80).replace(/[^a-zA-Z0-9]/g, '_');
    const cacheKey = `t_cache_${language}_${cleanTextKey}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached && cached !== text) {
      return cached;
    }

    // 3. Dynamic API Translation fallback using Gemini via backend server
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage: language }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.translatedText) {
          // If the server didn't generate translation (e.g. fallback to original text because of 429)
          if (data.translatedText !== text) {
            localStorage.setItem(cacheKey, data.translatedText);
            return data.translatedText;
          }
        }
      }
    } catch (e) {
      console.warn('Translate API unavailable or error:', e);
    }

    // 4. Client-side Offline structural fallback (perfect for 429 and offline states)
    const offlineVal = translateOffline(text, language);
    if (offlineVal !== text) {
      localStorage.setItem(cacheKey, offlineVal);
    }
    return offlineVal;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translateText }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useLanguage() {
  return useContext(TranslationContext);
}

// Reactive translate component to automatically wrap and live-translate any text node
export function T({ children }: { children: any }) {
  const { language, translateText } = useLanguage();
  const textStr = children ? String(children) : '';
  const [translated, setTranslated] = useState(textStr);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!textStr) return;

    if (language === 'English') {
      setTranslated(textStr);
      setLoading(false);
      return;
    }

    // Check if translation is available instantly
    const langDict = INSTANT_UI_TRANSLATIONS[language];
    if (langDict && langDict[textStr]) {
      setTranslated(langDict[textStr]);
      setLoading(false);
      return;
    }

    const cleanTextKey = textStr.trim().substring(0, 80).replace(/[^a-zA-Z0-9]/g, '_');
    const cacheKey = `t_cache_${language}_${cleanTextKey}`;
    const cachedVal = localStorage.getItem(cacheKey);
    if (cachedVal && cachedVal !== textStr) {
      setTranslated(cachedVal);
      setLoading(false);
      return;
    }

    // Fetch dynamic translation with brief loading shimmer
    let active = true;
    setLoading(true);
    translateText(textStr).then((res) => {
      if (active) {
        setTranslated(res);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [textStr, language]);

  if (loading) {
    return <span className="opacity-70 animate-pulse transition-opacity duration-200">{translated}</span>;
  }

  return <>{translated}</>;
}
