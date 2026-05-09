import { z } from 'zod';

const rawTokenPriceSchema = z.object({
  currency: z.string().trim().min(1),
  date: z.string().nullable().optional(),
  price: z.number().positive().finite(),
});

const rawPricesSchema = z.array(rawTokenPriceSchema);

export type RawTokenPrice = z.infer<typeof rawTokenPriceSchema>;

export function parseTokenPriceResponse(payload: unknown) {
  return rawPricesSchema.parse(payload);
}
