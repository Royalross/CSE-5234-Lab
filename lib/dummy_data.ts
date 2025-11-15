export type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  imageSrc?: string | null;
  imageAlt?: string | null;
  purchasedCount?: number;
};
