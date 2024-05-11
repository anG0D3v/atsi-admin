import z from 'zod';
const socialValidator = z.object({
  id: z.string().optional(),
  address: z.string().optional(),
  email: z.string().optional(),
  facebook: z.string().optional(),
  viber: z.string().optional(),
  whatsapp: z.string().optional(),
  status: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional()
});

export default socialValidator;
