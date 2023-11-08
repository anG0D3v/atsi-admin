import z from 'zod';
const brandValidator = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Required' }),
  description: z.string().optional(),
  status: z.string().optional(),
  logo: z.optional(z.any()),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export default brandValidator;
