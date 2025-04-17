export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string | Category;
  mainImage: string;
  gallery: string[];
  accessories: {
    name: string;
    description?: string;
    image?: string;
  }[];
  downloadFiles: {
    name: string;
    file: string;
    fileType: string;
  }[];
  slug: string;
  isActive: boolean;
  isFeatured: boolean;
  order: number;
}
