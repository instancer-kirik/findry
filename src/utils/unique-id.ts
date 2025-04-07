
/**
 * Generates a unique ID with a given prefix
 * This is useful for generating unique keys for lists in React
 */
export const generateUniqueId = (prefix: string = 'id'): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`;
};
