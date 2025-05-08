
/**
 * Types for the Glossary feature
 */

export interface GlossaryEntry {
  id: string;
  term: string;
  definition: string;
  category_id: string;
  image_url?: string;
  related_terms?: string[];
  examples?: string[];
  sources?: string[];
  created_at: string;
  updated_at: string;
  author_id?: string;
  status?: 'draft' | 'published' | 'archived';
  created_by: string;
}

export interface GlossaryCategory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  parent_category_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface GlossaryFilters {
  searchTerm: string;
  categories: string[];
  sortBy: 'alphabetical' | 'recent' | 'popular';
}

export interface CreateGlossaryEntryParams {
  term: string;
  definition: string;
  category_id: string;
  examples?: string[];
  related_terms?: string[];
  sources?: string[];
  image_url?: string;
}

export interface UpdateGlossaryEntryParams extends Partial<CreateGlossaryEntryParams> {
  id: string;
} 
