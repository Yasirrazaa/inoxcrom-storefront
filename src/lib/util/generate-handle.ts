export const generateHandle = (title: string): string => {
  return title
    .toLowerCase()                   // Convert to lowercase
    .trim()                         // Remove leading/trailing spaces
    .replace(/[^\w\s-]/g, '')      // Remove special characters
    .replace(/\s+/g, '-')          // Replace spaces with hyphens
    .replace(/-+/g, '-');          // Replace multiple hyphens with single hyphen
}

export const normalizeString = (str: string): string => {
  return str?.toLowerCase().trim().replace(/\s+/g, '-') || "";
}