import z from 'zod'

const userValidator = z.object({
    username: z.string().min(1,{ message: 'Username is required!'}),
    email: z.string().email({message:'Invalid email format!'}),
    password: z.string().min(8,{ message: 'Should have atleast 8 characters' })
})

export const userUpdateValidator = z.object({
    id:z.string(),
    username: z.string(),
    email: z.string().email(),
    password: z.string()
  });

export default userValidator