/**
 * Converts a string to a URL-friendly slug
 * Handles Turkish characters properly
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export const slugify = (text: string): string => {
  // Turkish character mapping
  const turkishChars: Record<string, string> = {
    ı: "i",
    İ: "i",
    ğ: "g",
    Ğ: "g",
    ü: "u",
    Ü: "u",
    ş: "s",
    Ş: "s",
    ö: "o",
    Ö: "o",
    ç: "c",
    Ç: "c",
  };

  return text
    .toString()
    .toLowerCase()
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except hyphens
    .replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, "") // Trim hyphens from start
    .replace(/-+$/, "") // Trim hyphens from end
    .replace(/[ıİğĞüÜşŞöÖçÇ]/g, (match) => turkishChars[match] || match); // Replace Turkish characters
};
