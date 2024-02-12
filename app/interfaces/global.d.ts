

export interface IBrandDTO {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  updatedBy?: string;
  status?: string;
  file?: object;
  updatedAt?: Date;
  ids: any;
}

export interface ICategoriesDTO {
  id?: string;
  name: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  status?: string;
  updatedAt?: Date;
  brandsId?: string;
}

export interface IProductsDTO {
  id?: string;
  name: string;
  description?: string;
  discount?: number;
  stock: number;
  price: number;
  discountedPrice?: number;
  rating?: number;
  status?: string;
  lazadaLink?: string | undefined;
  shoppeeLink?: string | undefined;
  isSaleProduct?: boolean;
  categoryId: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt?: Date;
  brandId: string;
  media?: [] | object;
  productReviews?: [];
}

export interface IUserDTO {
  id:string;
  email: string;
  password: string;
  username:string;
  status: undefined | 'Active' | 'Inactive' | 'Terminated';
  createdAt: Date | null;
  updatedAt: Date | null;
  type: string;
}
