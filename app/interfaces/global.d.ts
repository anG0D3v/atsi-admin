export interface IBrandDTO {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  updatedBy?: string;
  status?: string;
  file?: object;
  updatedAt?: Date;
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
