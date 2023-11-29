import z from 'zod';
const categoriesValidator = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Required' }),
  description: z.string().optional(),
  status: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  brandsId: z.string().min(1, { message: 'Should select a brand' }),
});

export default categoriesValidator;
