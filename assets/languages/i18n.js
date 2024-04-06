import { initReactI18next } from "react-i18next";
import spanish from "assets/languages/spanish.json";
import slovak from "assets/languages/slovak.json";
import english from "assets/languages/english.json";
import i18next from "i18next";

i18next.use(initReactI18next).init({
    compatibilityJSON: "v3",
    lng: "en",
    fallbackLng: "en",
    resources: { en: english, sk: slovak, es: spanish },
    react: { useSuspense: false },
});
export default i18next;
