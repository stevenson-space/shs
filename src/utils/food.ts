interface NutritionalInfo {
  serving_size: string;

  calories: number;
  fat_calories: number;

  total_fat_g: number;
  saturated_fat_g: number;
  trans_fat_g: number;
  cholesterol_mg: number;
  sodium_mg: number;
  total_carbs_g: number;
  fiber_g: number;
  total_sugar_g: number;
  added_sugar_g: number;
  protein_g: number;
}

type Allergen = "Egg" | "Gluten" | "Milk" | "Sesame" | "Soy" | "Wheat";

interface FoodItemMetaData {
  name: string;
  recipe: number | null;
}

interface FoodInformation {
  metadata: FoodItemMetaData;
  nutrition: NutritionalInfo;
  allergens: Allergen[];
}
