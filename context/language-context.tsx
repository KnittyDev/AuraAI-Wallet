"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "./en.json";
import tr from "./tr.json";
import de from "./de.json";
import sv from "./sv.json";
import es from "./es.json";
import el from "./el.json";

export type Language = "en" | "tr" | "de" | "sv" | "es" | "el";

const translations: Record<Language, any> = {
  en,
  tr,
  de,
  sv,
  es,
  el
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");

  // Load language preference from local storage or browser language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("aura_language") as Language;
    if (["en", "tr", "de", "sv", "es", "el"].includes(savedLang)) {
      setLanguageState(savedLang);
      document.documentElement.setAttribute("lang", savedLang);
    } else {
      const browserLang = navigator.language.split("-")[0];
      let defaultLang: Language = "en";
      if (browserLang === "tr") defaultLang = "tr";
      else if (browserLang === "de") defaultLang = "de";
      else if (browserLang === "sv") defaultLang = "sv";
      else if (browserLang === "es") defaultLang = "es";
      else if (browserLang === "el") defaultLang = "el";
      setLanguageState(defaultLang);
      document.documentElement.setAttribute("lang", defaultLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("aura_language", lang);
    document.documentElement.setAttribute("lang", lang);
  };

  const t = (key: string): any => {
    const parts = key.split(".");
    let current: any = translations[language];

    for (const part of parts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        // Fallback to English if translation key is missing
        let englishFallback: any = translations["en"];
        for (const fallbackPart of parts) {
          if (englishFallback && englishFallback[fallbackPart] !== undefined) {
            englishFallback = englishFallback[fallbackPart];
          } else {
            return key; // return the key itself if all fails
          }
        }
        return englishFallback;
      }
    }

    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

