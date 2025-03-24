import { CountryCodes } from "sovendus-integration-types";
import { describe, expect, it } from "vitest";

import { splitStreetAndStreetNumber } from "./utils";

describe("splitStreetAndStreetNumber", () => {
  // Standard cases for number at the end (most European countries)
  it("should split standard European address formats correctly", () => {
    expect(splitStreetAndStreetNumber("Hauptstrasse 123")).toEqual([
      "Hauptstrasse",
      "123",
    ]);
    expect(splitStreetAndStreetNumber("Avenue Victor Hugo 75")).toEqual([
      "Avenue Victor Hugo",
      "75",
    ]);
    expect(splitStreetAndStreetNumber("Via Roma 42")).toEqual([
      "Via Roma",
      "42",
    ]);
  });

  // Complex number formats
  it("should handle complex number formats", () => {
    expect(splitStreetAndStreetNumber("Marktplatz 12-14")).toEqual([
      "Marktplatz",
      "12-14",
    ]);
    expect(splitStreetAndStreetNumber("Boschstrasse 10A")).toEqual([
      "Boschstrasse",
      "10A",
    ]);
    expect(splitStreetAndStreetNumber("Westend 23/5")).toEqual([
      "Westend",
      "23/5",
    ]);
    expect(splitStreetAndStreetNumber("Sonnenallee 136 B")).toEqual([
      "Sonnenallee",
      "136 B",
    ]);
  });

  // Country specific tests
  it("should handle German (DE) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Unter den Linden 17")).toEqual([
      "Unter den Linden",
      "17",
    ]);
    expect(splitStreetAndStreetNumber("Am Kupfergraben 7")).toEqual([
      "Am Kupfergraben",
      "7",
    ]);
  });

  it("should handle French (FR) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Rue de Rivoli 230")).toEqual([
      "Rue de Rivoli",
      "230",
    ]);
    expect(splitStreetAndStreetNumber("Avenue des Champs-Élysées 21")).toEqual([
      "Avenue des Champs-Élysées",
      "21",
    ]);
  });

  it("should handle Italian (IT) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Via del Corso 12")).toEqual([
      "Via del Corso",
      "12",
    ]);
    expect(splitStreetAndStreetNumber("Piazza San Marco 1")).toEqual([
      "Piazza San Marco",
      "1",
    ]);
  });

  it("should handle UK (GB) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("10 Downing Street")).toEqual([
      "Downing Street",
      "10",
    ]);
    expect(splitStreetAndStreetNumber("221B Baker Street")).toEqual([
      "Baker Street",
      "221B",
    ]);
    expect(splitStreetAndStreetNumber("Baker Street 221B")).toEqual([
      "Baker Street",
      "221B",
    ]);
  });

  it("should handle Dutch (NL) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Kalverstraat 92")).toEqual([
      "Kalverstraat",
      "92",
    ]);
    expect(splitStreetAndStreetNumber("Herengracht 341")).toEqual([
      "Herengracht",
      "341",
    ]);
  });

  it("should handle Spanish (ES) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Gran Vía 28")).toEqual([
      "Gran Vía",
      "28",
    ]);
    expect(splitStreetAndStreetNumber("Paseo del Prado 36")).toEqual([
      "Paseo del Prado",
      "36",
    ]);
  });

  it("should handle Swedish (SE) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Drottninggatan 14")).toEqual([
      "Drottninggatan",
      "14",
    ]);
    expect(splitStreetAndStreetNumber("Kungsgatan 55")).toEqual([
      "Kungsgatan",
      "55",
    ]);
  });

  it("should handle Swiss (CH) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Bahnhofstrasse 25")).toEqual([
      "Bahnhofstrasse",
      "25",
    ]);
    expect(splitStreetAndStreetNumber("Rämistrasse 71")).toEqual([
      "Rämistrasse",
      "71",
    ]);
  });

  it("should handle Belgian (BE) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Rue Neuve 123")).toEqual([
      "Rue Neuve",
      "123",
    ]);
    expect(splitStreetAndStreetNumber("Nieuwstraat 123")).toEqual([
      "Nieuwstraat",
      "123",
    ]);
  });

  it("should handle Danish (DK) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Strøget 37")).toEqual(["Strøget", "37"]);
    expect(splitStreetAndStreetNumber("H.C. Andersens Boulevard 27")).toEqual([
      "H.C. Andersens Boulevard",
      "27",
    ]);
  });

  it("should handle Finnish (FI) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Mannerheimintie 10")).toEqual([
      "Mannerheimintie",
      "10",
    ]);
    expect(splitStreetAndStreetNumber("Aleksanterinkatu 52")).toEqual([
      "Aleksanterinkatu",
      "52",
    ]);
  });

  it("should handle Irish (IE) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("33 O'Connell Street")).toEqual([
      "O'Connell Street",
      "33",
    ]);
    expect(splitStreetAndStreetNumber("O'Connell Street 33")).toEqual([
      "O'Connell Street",
      "33",
    ]);
  });

  it("should handle Norwegian (NO) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Karl Johans gate 31")).toEqual([
      "Karl Johans gate",
      "31",
    ]);
    expect(splitStreetAndStreetNumber("Storgata 25")).toEqual([
      "Storgata",
      "25",
    ]);
  });

  it("should handle Polish (PL) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Nowy Świat 6/12")).toEqual([
      "Nowy Świat",
      "6/12",
    ]);
    expect(splitStreetAndStreetNumber("Krakowskie Przedmieście 15/17")).toEqual(
      ["Krakowskie Przedmieście", "15/17"],
    );
  });

  it("should handle Portuguese (PT) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Rua Augusta 290")).toEqual([
      "Rua Augusta",
      "290",
    ]);
    expect(splitStreetAndStreetNumber("Avenida da Liberdade 185")).toEqual([
      "Avenida da Liberdade",
      "185",
    ]);
  });

  it("should handle Austrian (AT) addresses correctly", () => {
    expect(splitStreetAndStreetNumber("Kärntner Straße 38")).toEqual([
      "Kärntner Straße",
      "38",
    ]);
    expect(splitStreetAndStreetNumber("Graben 21")).toEqual(["Graben", "21"]);
  });

  // Edge cases
  it("should handle edge cases", () => {
    expect(splitStreetAndStreetNumber("")).toEqual(["", ""]);
    expect(splitStreetAndStreetNumber("Hauptstrasse")).toEqual([
      "Hauptstrasse",
      "",
    ]);
    expect(splitStreetAndStreetNumber("123 Main St")).toEqual([
      "Main St",
      "123",
    ]);
    expect(splitStreetAndStreetNumber("Apt 4B, 123 Main St")).toEqual([
      "Apt 4B, Main St",
      "123",
    ]);
  });

  // Address with country code
  it("should handle address with country code", () => {
    expect(
      splitStreetAndStreetNumber("Hauptstrasse 123", CountryCodes.DE),
    ).toEqual(["Hauptstrasse", "123"]);
    expect(
      splitStreetAndStreetNumber("10 Downing Street", CountryCodes.GB),
    ).toEqual(["Downing Street", "10"]);
    expect(
      splitStreetAndStreetNumber("221B Baker Street", CountryCodes.GB),
    ).toEqual(["Baker Street", "221B"]);
    expect(
      splitStreetAndStreetNumber("O'Connell Street 33", CountryCodes.IE),
    ).toEqual(["O'Connell Street", "33"]);
    expect(
      splitStreetAndStreetNumber("33 O'Connell Street", CountryCodes.IE),
    ).toEqual(["O'Connell Street", "33"]);
  });
});
