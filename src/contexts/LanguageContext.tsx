
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
    // FIR Management page translations
    'Create and manage First Information Reports': 'प्रथम सूचना रिपोर्ट (एफआईआर) बनाएं और प्रबंधित करें',
    'Create FIR': 'एफआईआर बनाएं',
    'Pending Approval': 'अनुमोदन के लिए लंबित',
    'History': 'इतिहास',
    'Create New FIR': 'नई एफआईआर बनाएं',
    'Fill out the form below to create a new First Information Report': 'नई प्रथम सूचना रिपोर्ट बनाने के लिए नीचे दिया गया फॉर्म भरें',
    'will be saved offline and synced when connection is restored': 'ऑफलाइन सहेजा जाएगा और कनेक्शन बहाल होने पर सिंक किया जाएगा',
    'Case Number': 'केस नंबर',
    'Enter case number': 'केस नंबर दर्ज करें',
    'Incident Date & Time': 'घटना की तिथि और समय',
    'Incident Type': 'घटना का प्रकार',
    'Select incident type': 'घटना का प्रकार चुनें',
    'Theft': 'चोरी',
    'Assault': 'हमला',
    'Burglary': 'सेंधमारी',
    'Vandalism': 'तोड़फोड़',
    'Other': 'अन्य',
    'Incident Location': 'घटना का स्थान',
    'Enter incident location': 'घटना का स्थान दर्ज करें',
    'Associate Transcription': 'अनुलेखन जोड़ें',
    'Browse': 'ब्राउज़ करें',
    'Not available in offline mode': 'ऑफलाइन मोड में उपलब्ध नहीं है',
    'Browse transcriptions': 'अनुलेखन ब्राउज़ करें',
    'Search for a transcription...': 'अनुलेखन खोजें...',
    'Complainant Name': 'शिकायतकर्ता का नाम',
    'Enter complainant name': 'शिकायतकर्ता का नाम दर्ज करें',
    'Complainant Contact': 'शिकायतकर्ता का संपर्क',
    'Enter contact number': 'संपर्क नंबर दर्ज करें',
    'Incident Details': 'घटना का विवरण',
    'Describe the incident in detail...': 'घटना का विस्तृत वर्णन करें...',
    'Evidence Description': 'साक्ष्य का विवरण',
    'List any evidence collected...': 'एकत्रित किए गए किसी भी साक्ष्य की सूची बनाएं...',
    'Save as Draft': 'ड्राफ्ट के रूप में सहेजें',
    'Creating...': 'बना रहा है...',
    'Create FIR': 'एफआईआर बनाएं',
    'FIRs awaiting review and approval': 'समीक्षा और अनुमोदन के लिए लंबित एफआईआर',
    'FIR ID': 'एफआईआर आईडी',
    'Case #': 'केस #',
    'Submitted By': 'द्वारा जमा किया गया',
    'Date': 'तिथि',
    'Status': 'स्थिति',
    'Actions': 'कार्रवाई',
    'Loading FIRs...': 'एफआईआर लोड हो रहा है...',
    'No pending FIRs found': 'कोई लंबित एफआईआर नहीं मिला',
    'View': 'देखें',
    'Review': 'समीक्षा करें',
    'FIR History': 'एफआईआर इतिहास',
    'Previously filed and approved FIRs': 'पहले से दर्ज और अनुमोदित एफआईआर',
    'Search FIRs by ID, case number, or details...': 'आईडी, केस नंबर, या विवरण द्वारा एफआईआर खोजें...',
    'No approved or rejected FIRs found': 'कोई अनुमोदित या अस्वीकृत एफआईआर नहीं मिला',
    'Awaiting Approval': 'अनुमोदन की प्रतीक्षा में',
    'Approved': 'अनुमोदित',
    'Rejected': 'अस्वीकृत',
    'Force Sync': 'बलपूर्वक सिंक करें',
    'Syncing...': 'सिंक हो रहा है...',
    'You\'re back online. Changes will sync automatically.': 'आप वापस ऑनलाइन हैं। परिवर्तन स्वचालित रूप से सिंक होंगे।',
    'You\'re offline. Changes will be saved locally.': 'आप ऑफलाइन हैं। परिवर्तन स्थानीय रूप से सहेजे जाएंगे।',
    'FIR created successfully': 'एफआईआर सफलतापूर्वक बनाई गई',
    'will sync when online': 'ऑनलाइन होने पर सिंक होगा',
    'Failed to create FIR': 'एफआईआर बनाने में विफल',
    'You must be logged in to create an FIR': 'एफआईआर बनाने के लिए आपको लॉग इन होना चाहिए',
    'Please fill in all required fields': 'कृपया सभी आवश्यक फ़ील्ड भरें',
    'Failed to load your FIRs': 'आपके एफआईआर लोड करने में विफल',
    'Sync completed successfully!': 'सिंक सफलतापूर्वक पूरा हुआ!',
    'Failed to sync changes': 'परिवर्तनों को सिंक करने में विफल',
    'You\'re offline. Please connect to the internet to sync changes.': 'आप ऑफलाइन हैं। परिवर्तनों को सिंक करने के लिए कृपया इंटरनेट से कनेक्ट करें।',
    'Pending...': 'लंबित...',
    'Invalid date': 'अमान्य तिथि',
    'Unknown Officer': 'अज्ञात अधिकारी',
    'Evidence Files': 'सबूत के रूप में फ़ाइलें',
    'No evidence files have been uploaded for this FIR': 'इस एफआईआर के लिए कोई सबूत फ़ाइल अपलोड नहीं की गई है',
    'Upload Evidence Files': 'सबूत फ़ाइलें अपलोड करें',
    'File downloaded successfully': 'फ़ाइल सफलतापूर्वक डाउनलोड की गई'
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
    // FIR Management page translations
    'Create and manage First Information Reports': 'প্রথম তথ্য রিপোর্ট তৈরি এবং পরিচালনা করুন',
    'Create FIR': 'এফআইআর তৈরি করুন',
    'Pending Approval': 'অনুমোদন অপেক্ষারত',
    'History': 'ইতিহাস',
    'Create New FIR': 'নতুন এফআইআর তৈরি করুন',
    'Fill out the form below to create a new First Information Report': 'একটি নতুন প্রথম তথ্য রিপোর্ট তৈরি করতে নীচের ফর্মটি পূরণ করুন',
    'will be saved offline and synced when connection is restored': 'অফলাইনে সংরক্ষণ করা হবে এবং সংযোগ পুনরুদ্ধার হলে সিঙ্ক করা হবে',
    'Case Number': 'কেস নম্বর',
    'Pending Review': 'পর্যালোচনা অপেক্ষারত',
    'Pending...': 'অপেক্ষারত...',
    'Evidence Files': 'প্রমাণ ফাইল'
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
    // FIR Management page translations
    'Create and manage First Information Reports': 'முதல் தகவல் அறிக்கைகளை உருவாக்கவும் மற்றும் நிர்வகிக்கவும்',
    'Create FIR': 'எஃப்ஐஆர் உருவாக்கு',
    'Pending Review': 'நிலுவையில் உள்ள மதிப்பாய்வு',
    'Pending...': 'நிலுவையில்...',
    'Evidence Files': 'ஆதாரக் கோப்புகள்'
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
