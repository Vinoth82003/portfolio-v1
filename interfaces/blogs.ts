export interface IBlog {
  id: string;
  title: string;
  slug: string;
  category: string;
  readTime: string;
  description: string;
  image: string;
  content: string; // Markdown formatted string
  author: string;
  publishedAt: string;
  createdAt: string;
}
