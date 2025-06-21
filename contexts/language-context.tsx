"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "es" | "fr" | "ar"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    welcome: "Welcome back!",
    login: "Sign In",
    signup: "Create Account",
    email: "Email",
    password: "Password",
    dashboard: "Dashboard",
    profile: "Profile",
    chat: "Chat",
    admin: "Admin Panel",
    logout: "Logout",
    uploadImage: "Upload Image",
    takePhoto: "Take Photo",
    analyze: "Analyze Image",
    analyzing: "Analyzing...",
    recommendations: "Recommendations",
    users: "Users",
    locations: "Locations",
    diseases: "Diseases",
    updateProfile: "Update Profile",
    name: "Name",
    location: "Location",
    save: "Save",
    cancel: "Cancel",
    sendMessage: "Send Message",
    typeMessage: "Type a message...",
  },
  es: {
    welcome: "¡Bienvenido de nuevo!",
    login: "Iniciar Sesión",
    signup: "Crear Cuenta",
    email: "Correo",
    password: "Contraseña",
    dashboard: "Panel",
    profile: "Perfil",
    chat: "Chat",
    admin: "Panel Admin",
    logout: "Cerrar Sesión",
    uploadImage: "Subir Imagen",
    takePhoto: "Tomar Foto",
    analyze: "Analizar Imagen",
    analyzing: "Analizando...",
    recommendations: "Recomendaciones",
    users: "Usuarios",
    locations: "Ubicaciones",
    diseases: "Enfermedades",
    updateProfile: "Actualizar Perfil",
    name: "Nombre",
    location: "Ubicación",
    save: "Guardar",
    cancel: "Cancelar",
    sendMessage: "Enviar Mensaje",
    typeMessage: "Escribe un mensaje...",
  },
  fr: {
    welcome: "Bon retour!",
    login: "Se Connecter",
    signup: "Créer un Compte",
    email: "Email",
    password: "Mot de Passe",
    dashboard: "Tableau de Bord",
    profile: "Profil",
    chat: "Chat",
    admin: "Panneau Admin",
    logout: "Déconnexion",
    uploadImage: "Télécharger Image",
    takePhoto: "Prendre Photo",
    analyze: "Analyser Image",
    analyzing: "Analyse...",
    recommendations: "Recommandations",
    users: "Utilisateurs",
    locations: "Emplacements",
    diseases: "Maladies",
    updateProfile: "Mettre à Jour le Profil",
    name: "Nom",
    location: "Emplacement",
    save: "Sauvegarder",
    cancel: "Annuler",
    sendMessage: "Envoyer Message",
    typeMessage: "Tapez un message...",
  },
  ar: {
    welcome: "مرحباً بعودتك!",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    chat: "المحادثة",
    admin: "لوحة الإدارة",
    logout: "تسجيل الخروج",
    uploadImage: "رفع صورة",
    takePhoto: "التقاط صورة",
    analyze: "تحليل الصورة",
    analyzing: "جاري التحليل...",
    recommendations: "التوصيات",
    users: "المستخدمون",
    locations: "المواقع",
    diseases: "الأمراض",
    updateProfile: "تحديث الملف الشخصي",
    name: "الاسم",
    location: "الموقع",
    save: "حفظ",
    cancel: "إلغاء",
    sendMessage: "إرسال رسالة",
    typeMessage: "اكتب رسالة...",
  },
  rw: {
  welcome: "Ikaze!",
  login: "Injira",
  signup: "Fungura Konti",
  email: "Imeyili",
  password: "Ijambo ry'ibanga",
  dashboard: "Urubuga Nyamukuru",
  profile: "Umwirondoro",
  chat: "Ikiganiro",
  admin: "Urubuga rw’Umuyobozi",
  logout: "Sohoka",
  uploadImage: "Ohereza Ifoto",
  takePhoto: "Fata Ifoto",
  analyze: "Sesa Ifoto",
  analyzing: "Birasesengurwa...",
  recommendations: "Inama zitangwa",
  users: "Abakoresha",
  locations: "Ahantu",
  diseases: "Indwara",
  updateProfile: "Hindura Umwirondoro",
  name: "Izina",
  location: "Aho uherereye",
  save: "Bika",
  cancel: "Hagarika",
  sendMessage: "Ohereza Ubutumwa",
  typeMessage: "Andika ubutumwa...",
}

}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)["en"]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      <div className={language === "ar" ? "rtl" : "ltr"}>{children}</div>
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
