import { CountryCodes, LanguageCodes } from "sovendus-integration-types";

import type { TextDataPart } from "./api";

const de = {
  moreOffersButtonText: "Mehr Angebote entdecken",
  title: "Welches Dankeschön möchten Sie als Belohnung?",
  vnFancyTitle: "Exklusiver Gutschein Netzwerk Zugang",
  offerAdvantages: [
    { text: "2 Gratis Gutscheine" },
    { text: "Exklusive Angebote" },
    { text: "Keine Anmeldung erforderlich" },
  ],
  offerAdvantageTag: "Bis zu 90% Rabatt",
};

export type Translations = {
  [country in CountryCodes]: Translation;
};

export type Translation = {
  moreOffersButtonText: string;
  title: string;
  vnFancyTitle: string;
  offerAdvantages: TextDataPart[];
  offerAdvantageTag: string;
};

export const trans = {
  [CountryCodes.DE]: de,
  [CountryCodes.AT]: de,
  [CountryCodes.BE]: {
    [LanguageCodes.FR]: {
      moreOffersButtonText: "Découvrir plus d'offres",
      title: "Quelle récompense souhaitez-vous recevoir?",
      vnFancyTitle: "Accès exclusif au réseau de bons de réduction",
      offerAdvantages: [
        { text: "2 bons de réduction gratuits" },
        { text: "Offres exclusives" },
        { text: "Aucune inscription requise" },
      ],
      offerAdvantageTag: "Jusqu'à 90% de réduction",
    },
    [LanguageCodes.NL]: {
      moreOffersButtonText: "Ontdek meer aanbiedingen",
      title: "Welke beloning wilt u ontvangen?",
      vnFancyTitle: "Exclusieve toegang tot voucher netwerk",
      offerAdvantages: [
        { text: "2 gratis vouchers" },
        { text: "Exclusieve aanbiedingen" },
        { text: "Geen registratie vereist" },
      ],
      offerAdvantageTag: "Tot 90% korting",
    },
  },
  [CountryCodes.DK]: {
    moreOffersButtonText: "Opdag flere tilbud",
    title: "Hvilken belønning vil du gerne have?",
    vnFancyTitle: "Eksklusiv adgang til rabatkuponer",
    offerAdvantages: [
      { text: "2 gratis rabatkuponer" },
      { text: "Eksklusive tilbud" },
      { text: "Ingen registrering nødvendig" },
    ],
    offerAdvantageTag: "Op til 90% rabat",
  },

  [CountryCodes.FR]: {
    moreOffersButtonText: "Découvrir plus d'offres",
    title: "Quelle récompense souhaitez-vous recevoir?",
    vnFancyTitle: "Accès exclusif au réseau de bons de réduction",
    offerAdvantages: [
      { text: "2 bons de réduction gratuits" },
      { text: "Offres exclusives" },
      { text: "Aucune inscription requise" },
    ],
    offerAdvantageTag: "Jusqu'à 90% de réduction",
  },
  [CountryCodes.IE]: {
    moreOffersButtonText: "Discover more offers",
    title: "Which reward would you like to receive?",
    vnFancyTitle: "Exclusive Voucher Network Access",
    offerAdvantages: [
      { text: "2 free vouchers" },
      { text: "Exclusive offers" },
      { text: "No registration required" },
    ],
    offerAdvantageTag: "Up to 90% discount",
  },
  [CountryCodes.IT]: {
    moreOffersButtonText: "Scopri più offerte",
    title: "Quale premio vorresti ricevere?",
    vnFancyTitle: "Accesso esclusivo alla rete di buoni sconto",
    offerAdvantages: [
      { text: "2 buoni sconto gratuiti" },
      { text: "Offerte esclusive" },
      { text: "Nessuna registrazione richiesta" },
    ],
    offerAdvantageTag: "Fino al 90% di sconto",
  },
  [CountryCodes.NL]: {
    moreOffersButtonText: "Ontdek meer aanbiedingen",
    title: "Welke beloning wilt u ontvangen?",
    vnFancyTitle: "Exclusieve toegang tot voucher netwerk",
    offerAdvantages: [
      { text: "2 gratis vouchers" },
      { text: "Exclusieve aanbiedingen" },
      { text: "Geen registratie vereist" },
    ],
    offerAdvantageTag: "Tot 90% korting",
  },
  [CountryCodes.NO]: {
    moreOffersButtonText: "Oppdag flere tilbud",
    title: "Hvilken belønning vil du gjerne motta?",
    vnFancyTitle: "Eksklusiv tilgang til kupongnettverk",
    offerAdvantages: [
      { text: "2 gratis kuponger" },
      { text: "Eksklusive tilbud" },
      { text: "Ingen registrering nødvendig" },
    ],
    offerAdvantageTag: "Opptil 90% rabatt",
  },
  [CountryCodes.PL]: {
    moreOffersButtonText: "Odkryj więcej ofert",
    title: "Jaką nagrodę chciałbyś otrzymać?",
    vnFancyTitle: "Ekskluzywny dostęp do sieci kuponów rabatowych",
    offerAdvantages: [
      { text: "2 darmowe kupony rabatowe" },
      { text: "Ekskluzywne oferty" },
      { text: "Rejestracja nie jest wymagana" },
    ],
    offerAdvantageTag: "Do 90% zniżki",
  },

  [CountryCodes.ES]: {
    moreOffersButtonText: "Descubre más ofertas",
    title: "¿Qué recompensa te gustaría recibir?",
    vnFancyTitle: "Acceso exclusivo a la red de cupones",
    offerAdvantages: [
      { text: "2 cupones gratis" },
      { text: "Ofertas exclusivas" },
      { text: "No se requiere registro" },
    ],
    offerAdvantageTag: "Hasta 90% de descuento",
  },
  [CountryCodes.SE]: {
    moreOffersButtonText: "Upptäck fler erbjudanden",
    title: "Vilken belöning skulle du vilja få?",
    vnFancyTitle: "Exklusiv åtkomst till rabattkupongsnätverk",
    offerAdvantages: [
      { text: "2 gratis rabattkuponger" },
      { text: "Exklusiva erbjudanden" },
      { text: "Ingen registrering krävs" },
    ],
    offerAdvantageTag: "Upp till 90% rabatt",
  },
  [CountryCodes.CH]: {
    [LanguageCodes.DE]: de,
    [LanguageCodes.FR]: {
      moreOffersButtonText: "Découvrir plus d'offres",
      title: "Quelle récompense souhaitez-vous recevoir?",
      vnFancyTitle: "Accès exclusif au réseau de bons de réduction",
      offerAdvantages: [
        { text: "2 bons de réduction gratuits" },
        { text: "Offres exclusives" },
        { text: "Aucune inscription requise" },
      ],
      offerAdvantageTag: "Jusqu'à 90% de réduction",
    },
    [LanguageCodes.IT]: {
      moreOffersButtonText: "Scopri più offerte",
      title: "Quale premio vorresti ricevere?",
      vnFancyTitle: "Accesso esclusivo alla rete di buoni sconto",
      offerAdvantages: [
        { text: "2 buoni sconto gratuiti" },
        { text: "Offerte esclusive" },
        { text: "Nessuna registrazione richiesta" },
      ],
      offerAdvantageTag: "Fino al 90% di sconto",
    },
  },
  [CountryCodes.GB]: {
    moreOffersButtonText: "Discover more offers",
    title: "Which reward would you like to receive?",
    vnFancyTitle: "Exclusive Voucher Network Access",
    offerAdvantages: [
      { text: "2 free vouchers" },
      { text: "Exclusive offers" },
      { text: "No registration required" },
    ],
    offerAdvantageTag: "Up to 90% discount",
  },
};

/**
 * Gets translation for a specific country and language
 * @param countryCode - The country code
 * @param languageCode - Optional language code (only used for BE and CH)
 * @returns The translation object for the specified country and language
 */
export function getTranslation(
  countryCode: CountryCodes,
  languageCode?: LanguageCodes,
): Translation {
  // Handle countries with language-specific translations
  if (
    (countryCode === CountryCodes.BE || countryCode === CountryCodes.CH) &&
    languageCode
  ) {
    const countryTranslations = trans[countryCode] as Record<
      LanguageCodes,
      Translation
    >;

    // Return language-specific translation if available
    if (countryTranslations[languageCode]) {
      return countryTranslations[languageCode];
    }

    // Fallback to first available language for that country
    const firstLanguage = Object.keys(countryTranslations)[0] as LanguageCodes;
    if (firstLanguage) {
      return countryTranslations[firstLanguage];
    }
  }

  // For countries without language specifics or fallback
  const countryTranslation = trans[countryCode];
  if (countryTranslation) {
    return countryTranslation as {
      moreOffersButtonText: string;
      title: string;
      vnFancyTitle: string;
      offerAdvantages: TextDataPart[];
      offerAdvantageTag: string;
    };
  }

  // Ultimate fallback to English (GB)
  return trans[CountryCodes.GB] as {
    moreOffersButtonText: string;
    title: string;
    vnFancyTitle: string;
    offerAdvantages: TextDataPart[];
    offerAdvantageTag: string;
  };
}
