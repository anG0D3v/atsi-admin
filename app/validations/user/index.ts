import z from 'zod'

const userValidator = z.object({
    username: z.string().min(1,{ message: 'Username is required!'}),
    email: z.string().email({message:'Invalid email format!'}),
    password: z.string().min(8,{ message: 'Should have atleast 8 characters' }),
    status: z.string()
})

export default userValidator