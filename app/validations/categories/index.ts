import z from 'zod';
const categoriesValidator = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Required' }).optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  brandsId: z.array(z.string()).nonempty().optional(),
});

export default categoriesValidator;
