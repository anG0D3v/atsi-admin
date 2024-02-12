import z from 'zod';
const brandValidator = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  logo: z.optional(z.any()),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional()
});

export default brandValidator;
