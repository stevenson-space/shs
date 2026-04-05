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

export const FoodItemMetadata = z.object({
  name: z.string(),
  recipe: z.array(z.number()),
});

export const FoodInformation = z.object({
  metadata: FoodItemMetadata,
  nutrition: NutritionalInfo,
  allergens: z.array(Allergen),
});

export const MenuItemComponent = z.union([
  z.object({ item: z.string() }),
  z.object({ item: z.string(), addedByDefault: z.boolean() }),
]);

export const Station = z.enum([
  "Grill", "Deli", "Simply to Go", "Grab 'n Go", "International",
  "Mindful", "Breakfast", "Comfort", "Pizza", "Sides", "Soup",
  "Panini", "PWC", "Jazzman's",
]);

export const MenuItem = z.object({
  name: z.string(),
  station: Station,
  price: z.number(),
  components: z.array(MenuItemComponent),
});

export type Allergen = z.infer<typeof Allergen>;
export type NutritionalInfo = z.infer<typeof NutritionalInfo>;
export type FoodItemMetaData = z.infer<typeof FoodItemMetadata>;
export type FoodInformation = z.infer<typeof FoodInformation>;
export type Station = z.infer<typeof Station>;
export type MenuIngredient = z.infer<typeof MenuItemComponent>;
export type MenuItem = z.infer<typeof MenuItem>;
