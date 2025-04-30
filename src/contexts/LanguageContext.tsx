
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define all supported languages
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ur', name: 'اردو (Urdu)' },
  { code: 'or', name: 'ଓଡ଼ିଆ (Odia)' },
  { code: 'as', name: 'অসমীয়া (Assamese)' },
  { code: 'sd', name: 'سنڌي (Sindhi)' },
  { code: 'kok', name: 'कोंकणी (Konkani)' },
];

// More comprehensive translations
const translations: Record<string, Record<string, string>> = {
  'hi': {
    'Dashboard': 'डैशबोर्ड',
    'Welcome back': 'वापस स्वागत है',
    'Active Cases': 'सक्रिय मामले',
    'Pending Approvals': 'लंबित अनुमोदन',
    'Total Recordings': 'कुल रिकॉर्डिंग',
    'Storage Used': 'स्टोरेज का उपयोग',
    'Recent Activity': 'हाल की गतिविधि',
    'My Cases': 'मेरे मामले',
    'View All': 'सभी देखें',
    'Recent Transcriptions': 'हाल ही में किए गए अनुलेखन',
    'Your latest audio recordings and transcriptions': 'आपकी नवीनतम ऑडियो रिकॉर्डिंग और अनुलेखन',
    'Pending Tasks': 'लंबित कार्य',
    'Tasks requiring your attention': 'कार्य जिन्हें आपके ध्यान की आवश्यकता है',
    'My Active Cases': 'मेरे सक्रिय मामले',
    'Cases currently assigned to you': 'वर्तमान में आपको सौंपे गए मामले',
    'New': 'नया',
    'Processing': 'प्रसंस्करण',
    'Complete': 'पूर्ण',
    'Urgent': 'तत्काल',
    'Medium': 'मध्यम',
    'Scheduled': 'अनुसूचित',
    'FIR+': 'एफआईआर+',
    'Search cases...': 'मामले खोजें...',
    'Sync when online': 'ऑनलाइन होने पर सिंक करें',
    'Offline': 'ऑफलाइन',
    'Online': 'ऑनलाइन',
    'Notifications': 'सूचनाएं',
    'Profile': 'प्रोफ़ाइल',
    'Preferences': 'प्राथमिकताएं',
    'Log out': 'लॉग आउट',
    'Officer': 'अधिकारी',
    'Echo Case Scribe': 'एको केस स्क्राइब',
    'Transcription': 'अनुलेखन',
    'Files': 'फाइलें',
    'FIR Management': 'एफआईआर प्रबंधन',
    'Video Processing': 'वीडियो प्रोसेसिंग',
    'Settings': 'सेटिंग्स',
    'Administration': 'प्रशासन',
    'Main Navigation': 'मुख्य नेविगेशन',
    'System': 'सिस्टम',
    'Authentication': 'प्रमाणीकरण',
    'Login / Signup': 'लॉगिन / साइनअप',
    'Mode': 'मोड',
    'pending': 'लंबित',
    'change': 'परिवर्तन',
    'changes': 'परिवर्तनों',
    'this week': 'इस सप्ताह',
    'of': 'का',
    'from yesterday': 'कल से',
    'total': 'कुल',
    'ago': 'पहले',
    'Last recorded': 'अंतिम रिकॉर्डेड',
    'Language changed to': 'भाषा बदल गई',
    'Active': 'सक्रिय',
    'In Progress': 'प्रगति पर',
    'Pending Review': 'समीक्षा के लिए लंबित',
    'Logout': 'लॉग आउट',
  },
  'bn': {
    'Dashboard': 'ড্যাশবোর্ড',
    'Welcome back': 'স্বাগতম',
    'Active Cases': 'সক্রিয় কেস',
    'Pending Approvals': 'অনুমোদন অপেক্ষারত',
    'Total Recordings': 'মোট রেকর্ডিং',
    'Storage Used': 'ব্যবহৃত স্টোরেজ',
    'FIR+': 'এফআইআর+',
    'Officer': 'অফিসার',
    'Online': 'অনলাইন',
    'Offline': 'অফলাইন',
    'Transcription': 'ট্রান্সক্রিপশন',
    'Files': 'ফাইল',
    'FIR Management': 'এফআইআর ব্যবস্থাপনা',
    'Video Processing': 'ভিডিও প্রসেসিং',
    'Settings': 'সেটিংস',
    'My Cases': 'আমার কেসগুলি',
    'Recent Activity': 'সাম্প্রতিক কার্যকলাপ',
    'Mode': 'মোড',
    'Main Navigation': 'প্রধান নেভিগেশন',
    'System': 'সিস্টেম',
    'Echo Case Scribe': 'ইকো কেস স্ক্রাইব',
    'Language changed to': 'ভাষা পরিবর্তন করা হয়েছে',
  },
  'ta': {
    'Dashboard': 'டாஷ்போர்டு',
    'Welcome back': 'மீண்டும் வரவேற்கிறோம்',
    'Active Cases': 'செயலில் உள்ள வழக்குகள்',
    'Pending Approvals': 'நிலுவையில் உள்ள அங்கீகாரங்கள்',
    'Total Recordings': 'மொத்த பதிவுகள்',
    'Storage Used': 'பயன்படுத்தப்பட்ட சேமிப்பு',
    'FIR+': 'எஃப்ஐஆர்+',
    'Officer': 'அதிகாரி',
    'Online': 'ஆன்லைன்',
    'Offline': 'ஆஃப்லைன்',
    'Transcription': 'டிரான்ஸ்கிரிப்ஷன்',
    'Files': 'கோப்புகள்',
    'FIR Management': 'எஃப்ஐஆர் மேலாண்மை',
    'Video Processing': 'வீடியோ செயலாக்கம்',
    'Settings': 'அமைப்புகள்',
    'Echo Case Scribe': 'எக்கோ கேஸ் ஸ்கிரைப்',
    'Language changed to': 'மொழி மாற்றப்பட்டது',
  }
};

// Improved utility function to translate text
export const translateText = (text: string, language: string): string => {
  if (language === 'en' || !text) return text;
  
  // Special case for numbers and dates - don't translate
  if (/^\d+(\.\d+)?$/.test(text) || /^\d{1,2}:\d{2}$/.test(text)) {
    return text;
  }
  
  return translations[language]?.[text] || text;
};

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<string>('en');

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  // Translation function
  const t = (text: string): string => {
    return translateText(text, language);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
