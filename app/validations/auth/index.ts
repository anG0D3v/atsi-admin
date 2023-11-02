import z from 'zod';

const authValidator = z.object({
  username: z.string().min(1, { message: 'Username is Required' }),
  password: z.string().min(8, { message: 'Should have atleast 8 characters' }),
});

export { authValidator };
