import z from 'zod';
const webValidator = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  status: z.string().optional(),
  file: z.optional(z.any()),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional()
});

export default webValidator;
