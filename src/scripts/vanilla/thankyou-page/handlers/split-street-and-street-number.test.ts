import { CountryCodes } from "sovendus-integration-types";
import { describe, expect, it } from "vitest";

import { splitStreetAndStreetNumber } from "./split-street-and-street-number";

// Table-driven tests to ensure we cover each supported CountryCode with
// representative address patterns the splitter supports.
// Note: The splitter is country-agnostic; we group by country for readability
// and to ensure we keep coverage in sync with the supported market list.

type Case = { input: string; street: string; number: string };

const casesByCountry: Record<CountryCodes, Case[]> = {
  [CountryCodes.AT]: [
    { input: "Ringstraße 1", street: "Ringstraße", number: "1" },
    {
      input: "Mariahilfer Straße 88",
      street: "Mariahilfer Straße",
      number: "88",
    },
    { input: "Am Graben 19", street: "Am Graben", number: "19" },
    // hyphen range, slash
    { input: "Mölker Bastei 12-14", street: "Mölker Bastei", number: "12-14" },
    { input: "Hauptstraße 23/5", street: "Hauptstraße", number: "23/5" },
  ],
  [CountryCodes.BE]: [
    // French (FR) region
    { input: "Grand Place 1", street: "Grand Place", number: "1" },
    { input: "Rue Neuve 123", street: "Rue Neuve", number: "123" },
    { input: "Rue Royale 12", street: "Rue Royale", number: "12" },
    // Dutch (NL) region
    { input: "Grote Markt 15", street: "Grote Markt", number: "15" },
    { input: "Koningsstraat 12", street: "Koningsstraat", number: "12" },
    // German (DE) region (small official region in BE)
    { input: "Neustraße 10", street: "Neustraße", number: "10" },
  ],
  [CountryCodes.DK]: [
    { input: "Strøget 1", street: "Strøget", number: "1" },
    { input: "Nyhavn 9", street: "Nyhavn", number: "9" },
    { input: "Amagertorv 6", street: "Amagertorv", number: "6" },
  ],
  [CountryCodes.FR]: [
    {
      input: "Avenue Victor Hugo 75",
      street: "Avenue Victor Hugo",
      number: "75",
    },
    { input: "Rue de Rivoli 25", street: "Rue de Rivoli", number: "25" },
    {
      input: "Boulevard Saint-Germain 6",
      street: "Boulevard Saint-Germain",
      number: "6",
    },
  ],
  [CountryCodes.DE]: [
    { input: "Unter den Linden 17", street: "Unter den Linden", number: "17" },
    { input: "Am Kupfergraben 7", street: "Am Kupfergraben", number: "7" },
    {
      input: "Friedrichstraße 123A",
      street: "Friedrichstraße",
      number: "123A",
    },
    { input: "Sonnenallee 136 B", street: "Sonnenallee", number: "136 B" },
  ],
  [CountryCodes.IE]: [
    // Leading number (Anglo style)
    { input: "15 Grafton Street", street: "Grafton Street", number: "15" },
    { input: "1 O'Connell Street", street: "O'Connell Street", number: "1" },
    // European style at end is also supported
    { input: "Temple Bar 12", street: "Temple Bar", number: "12" },
  ],
  [CountryCodes.IT]: [
    { input: "Via del Corso 123", street: "Via del Corso", number: "123" },
    { input: "Piazza San Marco 1", street: "Piazza San Marco", number: "1" },
    {
      input: "Corso Buenos Aires 45",
      street: "Corso Buenos Aires",
      number: "45",
    },
  ],
  [CountryCodes.NL]: [
    { input: "Damrak 70", street: "Damrak", number: "70" },
    { input: "Prinsengracht 263", street: "Prinsengracht", number: "263" },
    { input: "Kalverstraat 92", street: "Kalverstraat", number: "92" },
  ],
  [CountryCodes.NO]: [
    { input: "Karl Johans gate 22", street: "Karl Johans gate", number: "22" },
    { input: "Aker Brygge 1", street: "Aker Brygge", number: "1" },
    { input: "Stortingsgata 8", street: "Stortingsgata", number: "8" },
  ],
  [CountryCodes.PL]: [
    { input: "Rynek Główny 1", street: "Rynek Główny", number: "1" },
    {
      input: "Aleje Jerozolimskie 65",
      street: "Aleje Jerozolimskie",
      number: "65",
    },
    { input: "Ulica Floriańska 3", street: "Ulica Floriańska", number: "3" },
  ],
  [CountryCodes.ES]: [
    { input: "Calle Gran Vía 28", street: "Calle Gran Vía", number: "28" },
    {
      input: "Paseo de la Castellana 95",
      street: "Paseo de la Castellana",
      number: "95",
    },
    { input: "Plaza Mayor 1", street: "Plaza Mayor", number: "1" },
  ],
  [CountryCodes.SE]: [
    { input: "Drottninggatan 53", street: "Drottninggatan", number: "53" },
    { input: "Gamla Stan 2", street: "Gamla Stan", number: "2" },
    { input: "Kungsgatan 25", street: "Kungsgatan", number: "25" },
  ],
  [CountryCodes.CH]: [
    // German (DE) region
    { input: "Bahnhofstrasse 1", street: "Bahnhofstrasse", number: "1" },
    { input: "Seestrasse 18", street: "Seestrasse", number: "18" },
    // French (FR) region
    { input: "Rue du Rhône 65", street: "Rue du Rhône", number: "65" },
    { input: "Rue de Lausanne 10", street: "Rue de Lausanne", number: "10" },
    // Italian (IT) region
    { input: "Via Nassa 29", street: "Via Nassa", number: "29" },
    { input: "Via Cantonale 3", street: "Via Cantonale", number: "3" },
  ],
  [CountryCodes.GB]: [
    // Leading number (Anglo style)
    { input: "10 Downing Street", street: "Downing Street", number: "10" },
    { input: "221B Baker Street", street: "Baker Street", number: "221B" },
    // Also support number at end
    { input: "Baker Street 221B", street: "Baker Street", number: "221B" },
  ],
};

// Edge cases that are not country-specific but matter for multiple locales
const sharedEdgeCases: Case[] = [
  // Apartment/building with comma at the beginning
  { input: "Apt 4B, 123 Main St", street: "Apt 4B, Main St", number: "123" },
  {
    input: "Building A, 15 Park Avenue",
    street: "Building A, Park Avenue",
    number: "15",
  },
  // Numbers that look like postal codes at the beginning should not be treated as house numbers
  { input: "1010 Wien Strasse", street: "1010 Wien Strasse", number: "" },
  { input: "2000 Hamburg Allee", street: "2000 Hamburg Allee", number: "" },
];

describe("splitStreetAndStreetNumber by country", () => {
  for (const [country, cases] of Object.entries(casesByCountry) as [
    CountryCodes,
    Case[],
  ][]) {
    describe(String(country), () => {
      it.each(cases.map((c) => [c.input, c.street, c.number]))(
        "splits '%s' => ['%s','%s']",
        (input, street, number) => {
          expect(splitStreetAndStreetNumber(String(input))).toEqual([
            String(street),
            String(number),
          ]);
        },
      );
    });
  }

  describe("shared edge cases", () => {
    it.each(sharedEdgeCases.map((c) => [c.input, c.street, c.number]))(
      "splits '%s' => ['%s','%s']",
      (input, street, number) => {
        expect(splitStreetAndStreetNumber(String(input))).toEqual([
          String(street),
          String(number),
        ]);
      },
    );
  });
});
