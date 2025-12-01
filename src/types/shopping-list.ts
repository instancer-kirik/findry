export type ShoppingListStatus = 
  | "planned" 
  | "budgeted" 
  | "ordered" 
  | "purchased" 
  | "received";

export type ShoppingListCategory = 
  | "Real Estate"
  | "Clothing"
  | "Tools"
  | "Materials"
  | "Rocks"
  | "More";

export interface ShoppingListItem {
  id: string;
  item_name: string;
  description?: string;
  category?: ShoppingListCategory;
  priority?: "low" | "medium" | "high";
  status?: ShoppingListStatus;
  estimated_cost?: number;
  actual_cost?: number;
  quantity?: number;
  purchased?: boolean;
  purchased_at?: string;
  url?: string;
  notes?: string;
  project_id?: string;
  project_link?: string;
  resource_id?: string;
  owner_id?: string;
  created_at?: string;
  updated_at?: string;
}
