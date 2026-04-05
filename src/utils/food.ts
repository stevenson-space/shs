import { z } from "zod";

export const Allergen = z.enum([
  "Almonds", "Egg", "Fish", "Gluten", "Milk", "MSG", "Mustard",
  "Oats", "Peanuts", "Sesame", "Shellfish", "Soy", "Sulphites",
  "Tree Nuts", "Wheat",
]);

export const NutritionalInfo = z.object({
  serving_size: z.string(),

  calories: z.number(),
  fat_calories: z.number(),

  total_fat_g: z.number(),
  saturated_fat_g: z.number(),
  trans_fat_g: z.number(),
  cholesterol_mg: z.number(),
  sodium_mg: z.number(),
  total_carbs_g: z.number(),
  fiber_g: z.number(),
  total_sugar_g: z.number(),
  added_sugar_g: z.number(),
  protein_g: z.number(),
});

export const FoodItemMetaData = z.object({
  name: z.string(),
  recipe: z.array(z.number()),
});

export const FoodInformation = z.object({
  metadata: FoodItemMetaData,
  nutrition: NutritionalInfo,
  allergens: z.array(Allergen),
});

export type Allergen = z.infer<typeof Allergen>;
export type NutritionalInfo = z.infer<typeof NutritionalInfo>;
export type FoodItemMetaData = z.infer<typeof FoodItemMetaData>;
export type FoodInformation = z.infer<typeof FoodInformation>;
