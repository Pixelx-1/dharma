
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage, supportedLanguages } from '@/contexts/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'outline', 
  size = 'default'
}) => {
  const { language, setLanguage, t } = useLanguage();
  
  const currentLanguage = supportedLanguages.find(lang => lang.code === language);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          className="gap-2"
        >
          <Globe className="h-4 w-4" />
          <span>{currentLanguage?.name.split(' ')[0] || 'Language'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-auto">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            className={`cursor-pointer ${lang.code === language ? 'bg-police-light font-medium' : ''}`}
            onClick={() => setLanguage(lang.code)}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
