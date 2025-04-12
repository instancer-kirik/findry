
import { Json } from '@/integrations/supabase/types';

export type JsonCompatible<T> = {
  [P in keyof T]: T[P] extends object 
    ? JsonCompatible<T[P]> 
    : T[P] extends Array<infer U> 
      ? Array<JsonCompatible<U>> 
      : T[P];
};

export const convertToJson = <T>(obj: T): Json => {
  return JSON.parse(JSON.stringify(obj)) as unknown as Json;
};

export const convertFromJson = <T>(json: Json): T => {
  return json as unknown as T;
};
