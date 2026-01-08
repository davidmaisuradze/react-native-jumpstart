import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./locales/en.json";
import es from "./locales/es.json";

const resources = {
  en: { translation: en },
  es: { translation: es },
};

const initI18n = async () => {
  const locale = Localization.getLocales()[0]?.languageCode ?? "en";

  await i18n.use(initReactI18next).init({
    resources,
    lng: locale,
    fallbackLng: "en",
    compatibilityJSON: "v4",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

  return i18n;
};

export { initI18n };
export default i18n;
