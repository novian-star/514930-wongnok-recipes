import * as v from 'valibot';
import type { CookingTime, Difficulty, Prisma } from '~~/.generated/prisma';

// prettier-ignore
export const CreateRecipeSchema = v.object({
  title:        v.pipe(v.string(), v.trim(), v.minLength(1)),
  description:  v.optional(v.pipe(v.string(), v.trim())),
  ingredients:  v.optional(v.pipe(v.string(), v.trim())),
  instructions: v.optional(v.pipe(v.string(), v.trim())),
  cookingTime:  v.picklist(['SHORT', 'MEDIUM', 'LONG', 'VERY_LONG'] satisfies CookingTime[]),
  difficulty:   v.picklist(['EASY', 'MEDIUM', 'HARD'] satisfies Difficulty[]),
  image:        v.optional(v.pipe(v.string(), v.trim()))
}) satisfies v.GenericSchema<Prisma.RecipeCreateWithoutUserInput>

export const UpdateRecipeSchema = v.object({
  ...CreateRecipeSchema.entries,
})

export const CreateRatingSchema = v.object({
  value: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(5))
})