/* eslint-disable no-new */
import z from 'zod';

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

const productValidator = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Required' }),
  description: z.string().optional(),
  status: z.string().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
  stock: z.coerce.number(),
  brandId: z.string().min(1, { message: 'Should select a brand' }),
  categoryId: z.string().min(1, { message: 'Should select a Category' }),
  lazadaLink: z.string().refine(
    (value) => {
      // Check if the lazadaLink is a valid URL when not empty
      return !value || isValidUrl(value);
    },
    { message: 'Invalid Url' },
  ),
  shoppeeLink: z.string().refine(
    (value) => {
      // Check if the shoppeeLink is a valid URL when not empty
      return !value || isValidUrl(value);
    },
    { message: 'Invalid Url' },
  ),
  discount: z.coerce.number().optional(),
  price: z.coerce.number().positive().gt(0),
  isSaleProduct: z.boolean().default(false).optional(),
  images: z.any().optional(),
});

export default productValidator;
