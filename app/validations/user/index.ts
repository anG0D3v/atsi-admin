import z from 'zod'

const userValidator = z.object({
    id: z.string().optional(),
    username: z.string().min(1,{ message: 'Username is required!'}).optional(),
    email: z.string().email({message:'Invalid email format!'}).optional(),
    password: z.string().min(8,{ message: 'Should have atleast 8 characters' }).optional()
})

export const userUpdateValidator = z.object({
    id:z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string()
  });

export default userValidator