
import { Json } from '@/integrations/supabase/types';

export type JsonCompatible<T> = {
  [P in keyof T]: T[P] extends object 
    ? JsonCompatible<T[P]> 
    : T[P] extends Array<infer U> 
      ? Array<JsonCompatible<U>> 
      : T[P];
};

/**
 * Converts a TypeScript object to a JSON-compatible format
 * for storing in Supabase's jsonb columns
 */
export const convertToJson = <T>(obj: T): Json => {
  if (obj === null || obj === undefined) {
    return null;
  }
  // First stringify then parse to ensure all values are JSON compatible
  return JSON.parse(JSON.stringify(obj)) as unknown as Json;
};

/**
 * Converts a JSON object from Supabase back to a typed TypeScript object
 */
export const convertFromJson = <T>(json: Json): T => {
  if (json === null || json === undefined) {
    return null as unknown as T;
  }
  return json as unknown as T;
};
