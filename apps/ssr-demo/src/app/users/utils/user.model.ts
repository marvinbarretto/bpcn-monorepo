export interface User {
  id: number
  documentId: string
  username: string
  email: string
  provider: string
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  role: {
    id: number;
    name: string;
    description: string;
    type: string;
  };
}
