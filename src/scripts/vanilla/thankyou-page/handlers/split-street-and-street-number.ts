export function splitStreetAndStreetNumber(street: string): [string, string] {
  if (!street) {
    return ["", ""];
  }

  const trimmedStreet = street.trim();

  // Pattern 1: Handle apartment/complex addresses with comma (like "Apt 4B, 123 Main St")
  const apartmentComplexMatch = trimmedStreet.match(
    /^(.*?),\s*(\d+[A-Za-z]?)\s+(.+)$/,
  );
  if (
    apartmentComplexMatch &&
    apartmentComplexMatch[1] &&
    apartmentComplexMatch[2] &&
    apartmentComplexMatch[3]
  ) {
    const apartmentPart = apartmentComplexMatch[1].trim();
    const streetNumber = apartmentComplexMatch[2].trim();
    const streetName = apartmentComplexMatch[3].trim();
    return [`${apartmentPart}, ${streetName}`, streetNumber];
  }

  // Pattern 2: Handle Anglo-Saxon style with number at beginning (like "10 Downing Street")
  const angleSaxonMatch = trimmedStreet.match(/^(\d+[A-Za-z]?)\s+(.+)$/);
  if (angleSaxonMatch && angleSaxonMatch[1] && angleSaxonMatch[2]) {
    const streetNumber = angleSaxonMatch[1].trim();
    const streetName = angleSaxonMatch[2].trim();

    // Check if this looks like a European address with a number at the start of the street name
    // Example: "1010 Wien Strasse" - we don't want to interpret "1010" as the number
    if (streetName.split(/\s+/).length >= 2) {
      const possiblePostalCode = streetNumber.match(/^\d{4,5}$/);
      if (possiblePostalCode) {
        // This might be a postal code, not a street number
        // Return original format and let the European pattern attempt to parse
        return [trimmedStreet, ""];
      }
    }

    return [streetName, streetNumber];
  }

  // Pattern 3: European style with number at the end (like "Hauptstrasse 123")
  const europeanMatch = trimmedStreet.match(
    /^(.*?)\s+(\d+(?:[\s/-]*\d*)(?:[A-Za-z])?(?:\s+[A-Za-z])?)$/,
  );
  if (europeanMatch && europeanMatch[1] && europeanMatch[2]) {
    const streetName = europeanMatch[1].trim();
    const streetNumber = europeanMatch[2].trim();
    return [streetName, streetNumber];
  }

  // No number found or couldn't parse
  return [trimmedStreet, ""];
}
