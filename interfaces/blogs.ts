export interface IBlog {
  _id?: string;
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  description: string;
  excerpt?: string;
  image: string;
  content: string; // Markdown formatted string
  author: string;
  publishedAt: Date | string;
  createdAt: Date | string;
  updatedAt?: string | Date;
}
