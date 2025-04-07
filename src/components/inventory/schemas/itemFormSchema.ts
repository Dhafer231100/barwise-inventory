
import * as z from "zod";

export const itemFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
  quantity: z.coerce.number().min(0, {
    message: "Quantity must be a positive number.",
  }),
  unitPrice: z.coerce.number().min(0, {
    message: "Price must be a positive number.",
  }),
  minimumLevel: z.coerce.number().min(0, {
    message: "Minimum level must be a positive number.",
  }),
  expirationDate: z.string().optional(),
  unit: z.string().min(1, {
    message: "Unit is required.",
  }),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;
