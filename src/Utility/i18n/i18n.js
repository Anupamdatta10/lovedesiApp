import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../Utility/Locales/en/translation.json';
import fr from '../../Utility/Locales/fr/translation.json';

i18n.use(initReactI18next).init({
	compatibilityJSON: 'v3',
	lng: 'en',
	fallbackLng: 'en',
	resources: {
		en: en,
		fr: fr,
	},
	interpolation: {
		escapeValue: false // react already safes from xss
	},
	react: {
		useSuspense: false,
	}
});

export default i18n;
