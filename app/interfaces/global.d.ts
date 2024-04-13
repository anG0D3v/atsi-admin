/* eslint-disable no-use-before-define */

export interface IAboutUs{
  id:string;
  content:string;
  createdBy:string;
  createdAt:Date;
  updatedBy:string|null;
  isDeleted:boolean;
  status:string;
  createdByUser:IUserDTO|undefined;
}

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
export interface IFeedback{
  id: string;
  content: string;
  productsId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string | null;
  updatedBy: string | null;
  isDeleted: boolean;
  rating: number;
  createdByUser: {
    id: string;
    username: string;
    email: string;
    password: string;
    status: string;
    createdAt: string;
    updatedAt: null | string;
    type: string;
  };
  updatedByUser: null | {
    id: string;
    username: string;
    email: string;
    password: string;
    status: string;
    createdAt: Date;
    updatedAt: null | string;
    type: string;
  };
  product: IProductsDTO; 
}

export interface ILandingPage{
  id?:string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string | null;
  updatedAt: Date | null;
  isDeleted: boolean;
  status: string;
  createdByUser:IUserDTO;
  updatedByUser:IUserDTO|null;
  landingPageImages:any[];
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

export interface IWebDTO {
  id:string;
  title: string;
  content: string;
  imageUrl: string;
  createdBy: string;
  createdAt: Date;
  updatedBy: string | null;
  updatedAt: Date | null;
  isDeleted: boolean;
}

