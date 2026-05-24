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
    'Enabled': 'Geaktiveer',
    'Mzansi Worker Network': 'Mzansi Werker Netwerk',
    'Sanibonani': 'Hallo',
    'Welcome to Mzansi': 'Welkom by Mzansi',
    'Viewing': 'Kyk tans',
    'Your Wallet': 'Jou Beursie',
    'Jobs Listed': 'Werk Gelys',
    'Gigs Found': 'Take Gevind',
    'Tenders Open': 'Tenders Oop',
    'Notices': 'Kennisgewings',
    'Activate Feature Modules': 'Aktiveer Kenmerkmodules',
    'Jobs Portal': 'Werkportaal',
    'Handyman Gigs': 'Handyman Take',
    'Government Tenders': 'Staats Tenders',
    'Gallery Portfolios': 'Galery Portefeuljes',
    'Community Chats': 'Gemeenskap Kletse',
    'Verified Users': 'Geverifieerde Gebruikers',
    'Notifications': 'Kennisgewings',
    'Mark all read': 'Merk alles as gelees',
    'No new notifications': 'Geen nuwe kennisgewings nie',
    'User': 'Gebruiker',
    'Welcome': 'Welkom',
    'Saving': 'Stoor tans',
    'Congratulations, Profile Saved!': 'Baie geluk, profiel gestoor!',
    'Save Profile Information': 'Stoor Profiel Inligting',
    'Full Name': 'Volle Naam',
    'Email Address': 'E-pos Adres',
    'Experience & Bio': 'Ondervinding & Bio',
    'CV & Certificates': 'CV & Sertifikate',
    'Tap to upload your CV and certificates': 'Tik om jou CV en sertifikate op te laai',
    'PDF, DOCX, JPG, PNG (Max 5MB)': 'PDF, DOCX, JPG, PNG (Maks 5MB)',
    'Download': 'Laai af',
    'Tap to Change': 'Tik om te Verander',
    'Photo': 'Foto',
    'User Profile': 'Gebruikersprofiel',
    'Adjust layout styling, glassmorphism UI toggles & cache resets.': 'Pas uitleg-stilering aan, glassmorphism UI-wisselaars & kas-terugstellings.',
    'Database Cache is Empty': 'Databasis-kas is leeg',
    'Seed demo Mzansi data sets or post individual items to preview features.': 'Genereer demo Mzansi-datastelle of plaas individuele items om kenmerke te voorskou.',
    'Load South African Samples': 'Laai Suid-Afrikaanse Voorbeelde',
    'Find Work': 'Vind Werk',
    'Hire Pros': 'Huur Pro\'s',
    'Admin Panel': 'Admin Paneel',
    'Sign In': 'Meld aan',
    'Logout Admin': 'Meld Administrateur af',
    'Admin Controller': 'Admin Beheerder',
    'System Live': 'Stelsel is Regstreeks',
    'Verified Legit': 'Geverifieer as Eg',
    'User Signup': 'Gebruiker Registrasie',
    'Create your local worker profile': 'Skep jou plaaslike werkerprofiel',
    'Password': 'Wagwoord',
    'I accept the': 'Ek aanvaar die',
    'Terms and Conditions': 'Bepalings en Voorwaardes',
    'and understand that my identity will be vetted for trust and safety.': 'en verstaan dat my identiteit nagegaan sal word vir vertroue en veiligheid.',
    'Sign Up': 'Registreer',
    'Switch to Company Portal': 'Skakel oor na Maatskappy-portaal',
    'Or': 'Of',
    'Continue as Guest': 'Gaan voort as gas',
    'Verify your identity': 'Verifieer jou identiteit',
    'We\'ve sent a 4-digit code to your mobile device via the app.': 'Ons het \'n 4-syfer kode na jou mobiele toestel via die toepassing gestuur.',
    'Verify and Continue': 'Verifieer en Gaan voort',
    'Change Email': 'Verander E-pos',
    'Trusted by 5,000+ local South African professionals': 'Vertrou deur 5,000+ plaaslike Suid-Afrikaanse professionele persone',
    'New Message': 'Nuwe Boodskap',
    'Your TimeGig verification code is:': 'Jou TimeGig verifikasiekode is:',
    'Company Portal': 'Maatskappy-portaal',
    'Join TimeGig\'s network of vetted businesses': 'Sluit aan by TimeGig se netwerk van gekeurde besighede',
    '100% Verified & Legitimate Platform': '100% Geverifieerde & Legitieme Platform',
    'Register your company to access exclusive tenders, post jobs, and hire verified local professionals securely.': 'Registreer jou maatskappy om toegang te verkry tot eksklusiewe tenders, werk te plaas, en geverifieerde plaaslike professionele persone veilig te huur.',
    'Required Documents': 'Vereiste Dokumente',
    'Company Registration (CIPC)': 'Maatskappy Registrasie (CIPC)',
    'Valid Tax Clearance Certificate': 'Geldige Belastinguitklaringsertifikaat',
    '(PDF, DOC, or DOCX formats only)': '(Slegs PDF, DOC, of DOCX formate)',
    'Log In to Account': 'Meld aan by Rekening',
    'Skip and Explore App': 'Slaan oor en verken die toepassing',
    'Not a Company? Sign up as an Individual': 'Nie \'n Maatskappy nie? Registreer as \'n Individu',
    'Welcome Back': 'Welkom Terug',
    'Log in to your workspace': 'Meld aan by jou werkspasie',
    'Company Email': 'Maatskappy E-pos',
    'Authenticating...': 'Verifieer tans...',
    'Log In': 'Meld aan',
    'Back to Registration': 'Terug na Registrasie',
    'Company Name': 'Maatskappy Naam',
    'Upload Documents (Min. 2)': 'Laai Dokumente op (Min. 2)',
    'Tap to upload documents': 'Tik om dokumente op te laai',
    'Files supported: PDF, DOCX': 'Lêers ondersteun: PDF, DOCX',
    'Submit Application': 'Dien Aansoek in',
    'Verifying Documents...': 'Verifieer Dokumente...',
    'Checking company registration and tax clearance.': 'Kontroleer maatskappy-registrasie en belastinguitklaring.',
    'Application Declined': 'Aansoek Afgekeur',
    'Your verification failed. Ensure you have uploaded at least two valid PDF or DOCX documents (e.g. CIPC Registration and Tax Clearance). Unsupported formats like Images will be rejected.': 'Jou verifikasie het misluk. Maak seker dat jy ten minste twee geldige PDF- of DOCX-dokumente opgelaai het (bv. CIPC-registrasie en Belastinguitklaring). Nie-ondersteunde formate soos Beelde sal verwerp word.',
    'Try Again': 'Probeer Weer',
    'Application Approved!': 'Aansoek Goedgekeur!',
    'Your company has been successfully vetted and registered. Final step: Complete your personal profile from the top right menu to become a fully verified user.': 'Jou maatskappy is suksesvol gekeur en geregistreer. Finale stap: Voltooi jou persoonlike profiel vanaf die regterkantste menu om \'n volledig geverifieerde gebruiker te word.',
    'Enter Workspace': 'Gaan na Werkspasie',
    'Back': 'Terug',
    'Gov Tenders': 'Staats Tenders',
    'active': 'aktief',
    'Browse official municipality contract tenders, gazettes & bid details.': 'Blaai deur amptelike munisipale kontrak-tenders, koerante & bod-besonderhede.',
    'Discover latest local and national government tenders and apply externally.': 'Ontdek die nuutste plaaslike en nasionale staatstenders en doen ekstern aansoek.',
    'Gazette a Tender': 'Publiseer \'n Tender',
    'Search departments or notice titles...': 'Soek departemente of kennisgewings...',
    'No active government tenders listed': 'Geen aktiewe staatstenders gelys nie',
    'Start by gazetting a public infrastructure tender, medical supply contract, or load municipal samples instantly.': 'Begin deur \'n openbare infrastruktuur-tender, mediese verskaffingskontrak te publiseer, of laai munisipale voorbeelde dadelik laai.',
    'Gazette a Tender Notice': 'Publiseer \'n Tenderkennisgewing',
    'Load Sample Tenders': 'Laai Voorbeeld Tenders',
    'Open': 'Oop',
    'Closes': 'Sluit',
    'Est. Value': 'Beraamde Waarde',
    'View Locked': 'Siening Gesluit',
    'View Details': 'Sien Besonderhede',
    'Estimated Value': 'Beraamde Waarde',
    'Closing Date': 'Sluitingsdatum',
    'Tender Description': 'Tender Beskrywing',
    'Official Tender Specifications': 'Amptelike Tender Spesifikasies',
    'Get the PDF bid invitation specs, municipal standard bidding documents (SBD), and site-briefing notes instantly.': 'Kry dadelik die PDF-boduitnodigingspesifikasies, munisipale standaard boddokumente (SBD), en terrein-inligtingsnotas.',
    'Go to Official Website to Download Documents': 'Gaan na Amptelike Webwerf om Dokumente af te laai',
    'Redirecting...': 'Herlei tans...',
    'Taking you to official gov site...': 'Neem jou na amptelike regeringswerf...',
    'Site Opened!': 'Werf Oopgemaak!',
    'Follow the steps on the government portal to submit your documents and bids.': 'Volg die stappe op die regeringsportaal om jou dokumente en bie in te dien.',
    'Close': 'Sluit',
    'Tenders Feature Locked': 'Tender-kenmerk Gesluit',
    'To view official documents and apply for national government tenders, your company must be verified.': 'Om amptelike dokumente te sien en vir nasionale staatstenders aansoek te doen, moet jou maatskappy geverifieer wees.',
    'Verify Company Now': 'Verifieer Maatskappy Nou',
    'Apply on Gov Portal': 'Doen aansoek op Regeringsportaal',
    'Gazette a New Tender': 'Publiseer \'n Nuwe Tender',
    'Tender Title / Notice': 'Tender Titel / Kennisgewing',
    'Department / Municipality': 'Departement / Munisipaliteit',
    'Estimated Value (Rand)': 'Beraamde Waarde (Rand)',
    'Bidding Closing Date': 'Bod Sluitingsdatum',
    'Specification Document Portal Link (URL)': 'Spesifikasie-dokument Portaal Skakel (URL)',
    'Scope of Work & Specification Details': 'Omvang van Werk & Spesifikasie Besonderhede',
    'Publish Tender Notice': 'Publiseer Tenderkennisgewing',
    'Registration Required': 'Registrasie Vereis',
    'You must register your company to view full tender specifications and submit bids.': 'Jy moet jou maatskappy registreer om volle tender-spesifikasies te sien en bie in te dien.',
    'Verify Company': 'Verifieer Maatskappy',
    'Cancel': 'Kanselleer',
    'Community Gigs': 'Gemeenskap Take',
    'Short-term tasks and casual jobs around you.': 'Korttermyn take en los werkies rondom jou.',
    'Show Instructions Guide': 'Wys Instruksiegids',
    'Create a Gig': 'Skep \'n Taak',
    'How Do Gigs Work?': 'Hoe Werk Take?',
    'Unlocking South Africa\'s casual workspace in 4 easy steps': 'Ontsluit Suid-Afrika se los werkspasie in 4 maklike stappe',
    'Collapse Info': 'Vou Inligting toe',
    'Expand Info': 'Vou Inligting oop',
    'Hide Guide': 'Versteek Gids',
    'Post a Casual Job': 'Plaas \'n Los Werkie',
    'Anyone can publish a small, casual job (moving furniture, sanding, basic plumbing) and quote an instant price offer in South African Rand (R).': 'Enigeen kan \'n klein, los werkie publiseer (meubels skuif, skuur, basiese loodgieterswerk) en \'n direkte prysaanbod in Suid-Afrikaanse Rand (R) kwoteer.',
    'Apply Instantly': 'Doen Onmiddellik Aansoek',
    'Notice a task you can handle?': 'Sien jy \'n taak wat jy kan hanteer?',
    'Tap': 'Tik',
    'to initiate your application seamlessly.': 'om jou aansoek naatloos te begin.',
    'Face Scan Check': 'Gesigskandering Kontrole',
    'For safety, applicants complete a live face-angle verification (Turn Left & Turn Right) to verify your real identity and build trust.': 'Vir veiligheid voltooi aansoekers \'n lewendige gesig-hoek verifikasie (Draai Links & Draai Regs) om jou regte identiteit te verifieer en vertroue te bou.',
    'Chat & Work': 'Klets & Werk',
    'Once details are shared, connected pairs unlock a direct messaging line in the': 'Sodra besonderhede gedeel is, ontsluit gekoppelde pare \'n direkte boodskaplyn in die',
    'to align, complete the task, and earn!': 'om te belyn, die taak te voltooi, en te verdien!',
    'System Feature Tip:': 'Stelselkenmerk Wenk:',
    'Any job photos uploaded when publishing a Gig are automatically safely saved to the central': 'Enige werk-foto\'s wat opgelaai word wanneer \'n Taak gepubliseer word, word outomaties veilig in die sentrale weg gestoor',
    'Media Portals & Gallery': 'Media Portale & Galery',
    'Give it a try.': 'Probeer dit gerus.',
    'Gig Posted Successfully!': 'Taak Suksesvol Geplaas!',
    'Search for odd jobs, tasks, or area...': 'Soek vir los werkies, take, of area...',
    'No active local gigs found': 'Geen aktiewe plaaslike take gevind nie',
    'Be the first to post a handyman repair, furniture moving, or tech support gig in your area, or seed the workspace with sample Rand gigs.': 'Wees die eerste om \'n herstelwerk, meubels skuif, of tegniese ondersteunings-taak in jou area te plaas, of saai die werkspasie met voorbeeld Rand-take.',
    'Post Your First Gig': 'Plaas Jou Eerste Taak',
    'Load Sample Mzanzi Gigs': 'Laai Voorbeeld Mzanzi Take',
    'Gig Locked': 'Taak Gesluit',
    'Post a New Gig': 'Plaas \'n Nuwe Taak',
    'Gig Title': 'Taak Titel',
    'Price Offer (Rand)': 'Prysaanbod (Rand)',
    'Location': 'Ligging',
    'Upload Photo from Device': 'Laai Foto van Toestel op',
    'Change Photo': 'Verander Foto',
    'Tap to select device picture': 'Tik om toestel-foto te kies',
    'Supports PNG, JPG, WEBP': 'Ondersteun PNG, JPG, WEBP',
    'Save & Publish Gig': 'Stoor & Publiseer Taak',
    'Identity Verification': 'Identiteitsverifikasie',
    'To maintain trust on TimeGig, we need your permission to share your profile details with': 'Om vertroue op TimeGig te handhaaf, het ons jou toestemming nodig om jou profielbesonderhede te deel met',
    'You will also need to capture two live pictures (Turn Left & Turn Right) for identity verification.': 'Jy sal ook twee lewendige foto\'s (Draai Links & Draai Regs) moet neem vir identiteitsverifikasie.',
    'Agree & Continue': 'Stem Saam & Gaan Voort',
    'Face Verification': 'Gesig-verifikasie',
    'Follow the prompts to capture your face.': 'Volg die aanwysings om jou gesig vas te lê.',
    'Captured!': 'Vasgelê!',
    'Turn Left': 'Draai Links',
    'Turn Right': 'Draai Regs',
    'Congratulations!': 'Baie geluk!',
    'Your application has been sent securely. You can chat with the creator if they accept!': 'Jou aansoek is veilig gestuur. Jy kan met die skepper klets as hulle aanvaar!',
    'Back to Gigs': 'Terug na Take',
    'Register Now': 'Registreer Nou',
    'You must register to interact with Gigs (create or apply).': 'Jy moet registreer om interaksie te hê met Take (skep of aansoek doen).',
    'Search chats...': 'Soek kletse...',
    'Sign in to Message': 'Meld aan om te Boodskap',
    'You must register as a member to communicate with other users, send media, and track messages.': 'Jy moet as \'n lid registreer om met ander gebruikers te kommunikeer, media te stuur, en boodskappe na te spoor.',
    'Sign Up Now': 'Registreer Nou',
    'Go Back': 'Gaan Terug',
    'TimeGig Chat': 'TimeGig Klets',
    'Connect and collaborate safely with candidates. Select a thread on the left to start messaging.': 'Koppel en werk veilig saam met kandidate. Kies \'n draad aan die linkerkant om te begin boodskappe stuur.',
    'Online': 'Aanlyn',
    'Offline': 'Vanlyn',
    'Today': 'Vandag',
    'Type a message...': 'Tik \'n boodskap...',
    'Secure Gallery Vault': 'Veilige Galery-klas',
    'All your uploaded documents, images, video messages, and profile avatars are indexed here automatically in high fidelity.': 'Al jou opgelaaide dokumente, beelde, video-boodskappe, en profiel-avatars word outomaties hier in hoë getrouheid geïndekseer.',
    'Search gallery by title or tag name...': 'Soek galery volgens titel of etiketnaam...',
    'No media found': 'Geen media gevind nie',
    'Try resetting your filter or search query.': 'Probeer om jou filter of soektog terug te stel.',
    'VIDEO': 'VIDEO',
    'IMAGE': 'BEELD',
    'PRIVATE VAULT': 'PRIVAAT KLAS',
    'Edit Media Data': 'Wysig Media Data',
    'Title / Name': 'Titel / Naam',
    'Category Tag': 'Etiket',
    'Save New Data': 'Stoor Nuwe Data',
    'Video Clip': 'Video Greep',
    'Image Photo': 'Beeld Foto',
    'Saved On': 'Gestoor Op',
    'Encryption': 'Enkripsie',
    'Protected Local': 'Beskermde Plaaslik',
    'Edit Info': 'Wysig Inligting',
    'Copy / Share': 'Kopieer / Deel',
    'Delete': 'Verwyder',
    'System Admin': 'Stelsel Admin',
    'Mzansi Gig Network Controller': 'Mzansi Taaknetwerk Beheerder',
    'Manage biometric vetting credentials, approve incoming Capitec deposits, review proof sheets, and seed verified local contractors instantly.': 'Bestuur biometriese keuringsbewyse, keur inkomende Capitec-deposito\'s goed, hersien bewysblaaie, en saai geverifieerde plaaslike kontrakteurs dadelik.',
    'Accumulated Revenue (Profit)': 'Opgehoopte Inkomste (Wins)',
    'Direct Capitec EFT and cash receipts net': 'Direkte Capitec EFT en kontantontvangste netto',
    'Minted Coins Liquidity': 'Gemonteerde Muntstukke Likiditeit',
    '{totalCoinsApproved} Coins': '{totalCoinsApproved} Muntstukke',
    'Approved token volume supplied to handymen': 'Goedgekeurde token-volume verskaf aan handyman-werkers',
    'Broadband Network Active': 'Breëband Netwerk Aktief',
    '{activeUsersCount} Online': '{activeUsersCount} Aanlyn',
    'Active verified candidate threads & online profiles': 'Aktiewe geverifieerde kandidaat-drade & aanlyn-profiele',
    'Receive & Review Payments': 'Ontvang & Hersien Betalings',
    'Approve or reject Capitec proof of payments': 'Keur Capitec bwyse van betalings goed of verwerp dit',
    '{pendingPayments.length} Pending': '{pendingPayments.length} Hangende',
    'Ref': 'Verwysing',
    'Applied package': 'Aansoekpakket',
    '{pm.coinsAmount} Coins': '{pm.coinsAmount} Muntstukke',
    'ZAR Price': 'ZAR Prys',
    'Reject': 'Verwerp',
    'Approve Deposit': 'Keur Deposito Goed',
    'All Deposit Slips Processed': 'Alle Depositoslip-verwerking Voltooi',
    'No pending Capitec file transfers to verify at this stage.': 'Geen hangende Capitec-lêeroordragte om op hierdie stadium te verifieer nie.',
    'Active Users Registry': 'Aktiewe Gebruikersregister',
    '{filteredUsers.length}': '{filteredUsers.length}',
    'Track and manage balance sheets of vetted members': 'Volg en bestuur balansstate van gekeurde lede',
    'Filter name...': 'Filtreer naam...',
    '{user.coins} Coins': '{user.coins} Muntstukke',
    '🔎 Core Candidate': '🔎 Kernkandidaat',
    '💤 Secured/Passive': '💤 Beveilig/Passief',
    'Archived Payment Audits': 'Geargiveerde Betalingsoudits',
    'Portal Wallpaper': 'Portaal-muurpapier',
    'Customize the global network background wallpaper. Upload an image from your device or select an elegant preset.': 'Pas die globale netwerk agtergrond-muurpapier aan. Laai \'n beeld van jou toestel op of kies \'n elegante voorafinstelling.',
    'Active Custom Wallpaper': 'Aktiewe Pasgemaakte Muurpapier',
    'No custom background active': 'Geen pasgemaakte agtergrond aktief nie',
    'Using standard gradient backdrop': 'Gebruik standaard gradient agtergrond',
    'Upload Image File': 'Laai Beeldlêer op',
    'Or Select a Preset Wallpaper': 'Of kies \'n Voorafingestelde Muurpapier',
    'Search certified professionals, handymen, skills...': 'Soek geverifieerde professionele persone, handyman-werkers, vaardighede...',
    'Jozi Skyline': 'Jozi Skyline',
    'Table Mountain': 'Tafelberg',
    'Modern Wave': 'Moderne Golf',
    'Veld Nature': 'Veld Natuur',
    'yourname@gmail.com': 'jounaam@gmail.com',
    'Min. 8 characters': 'Minstens 8 karakters',
    'Teken In': 'Sign In',
    'Gaan voort as Gaste': 'Continue as Guest',
    'Invalid verification code. Please try again.': 'Ongeldige verifikasiekode. Probeer asseblief weer.',
    'Beautiful! Custom wallpaper uploaded and applied successfully!': 'Pragtig! Pasgemaakte muurpapier opgelaai en suksesvol toegepas!',
    'Backdrop reset to standard system theme.': 'Agtergrond teruggestel na standaard stelsel-tema.',
    'Wallpaper set to "{preset.name}" successfully!': 'Muurpapier suksesvol ingestel op "{preset.name}"!',
    'Offline notifications enabled! You will receive updates of new projects and payments when disconnected.': 'Vanlyn kennisgewings geaktiveer! Jy sal opdaterings van nuwe projekte en betalings ontvang wanneer jy ontkoppel is.',
    'Offline notifications disabled.': 'Vanlyn kennisgewings gedeaktiveer.',
    'Your account has been enabled. Your profile is now visible.': 'Jou rekening is geaktiveer. Jou profiel is nou sigbaar.',
    'Your account is now disabled. It will be hidden from searches & public listings.': 'Jou rekening is nou gedeaktiveer. Dit sal weggesteek word van soektogte & publieke lyste.',
    'Translating application to {formattedLang} immediately...': 'Vertaal tans toepassing na {formattedLang} onmiddellik...',
    'e.g. Japanese, Korean, Italian, Tshivenda, Xitsonga...': 'bv. Japannees, Koreaans, Italiaans, Tshivenda, Xitsonga...',
    'e.g. Renovation of local primary school': 'bv. Opknapping van plaaslike laerskool',
    'e.g. City of Johannesburg Municipality': 'bv. Stad Johannesburg Munisipaliteit',
    'e.g. R4 200 000': 'bv. R4 200 000',
    'e.g. https://www.etenders.gov.za/': 'bv. https://www.etenders.gov.za/',
    'State standard bidding documents requirements, briefing meetings and CIDB grading requirements...': 'Meld standaard boddokumente-vereistes, inligtingsvergaderings en CIDB-graderingsvereistes...',
    'e.g., Help moving boxes': 'bv. Help om bokse te skuif',
    'Describe the task...': 'Beskryf die taak...',
    'e.g. R450': 'bv. R450',
    'City or Area': 'Stad of Area',
    'Legit': 'Legit',
    'South Africa': 'Suid-Afrika',
    'Translating application to': 'Vertaal tans toepassing na',
    'immediately...': 'onmiddellik...',
    'Japanese': 'Japannees',
    'Korean': 'Koreaans',
    'Italian': 'Italiaans',
    'Tshivenda': 'Tshivenda',
    'Xitsonga': 'Xitsonga',
    'Greek': 'Grieks',
    'Sesotho': 'Sesotho',
    'Swahili': 'Swahili',
    'Your account has been enabled.': 'Jou rekening is geaktiveer.',
    'Your account is now disabled.': 'Jou rekening is nou gedeaktiveer.',
    'It will be hidden from searches & public listings.': 'Dit sal weggesteek word van soektogte & publieke lyste.',
    'Your profile is now visible.': 'Jou profiel is nou sigbaar.',
    'Undisclosed / Negotiable': 'Nie bekend gemaak nie / Onderhandelbaar',
    'Just now': 'Nou net',
    'Everywhere': 'Oral',
    'Successfully posted:': 'Suksesvol geplaas:',
    'for': 'vir',
    'inside': 'binne',
    'Check the Secure Gallery View tab to see any associated media files you\'ve uploaded.': 'Gaan die Veilige Galery-oortjie na om enige gepaardgaande medialêers wat jy opgelaai het, te sien.'
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
  t: (text: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  language: 'English',
  setLanguage: () => {},
  translateText: async (text) => text,
  t: (text) => text,
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

  const t = (text: string): string => {
    return translateOffline(text, language);
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, translateText, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useLanguage() {
  return useContext(TranslationContext);
}

// Reactive translate component to automatically wrap and live-translate any text node
export function T({ children, noSpan = false }: { children: any, noSpan?: boolean }) {
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

  if (loading && !noSpan) {
    return <span className="opacity-70 animate-pulse transition-opacity duration-200">{translated}</span>;
  }

  return <>{translated}</>;
}
