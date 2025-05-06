export type StrapiResponse<T> = {
  data: Array<{
    id: number;
    attributes: T;
  }>;
};

export interface PageAttributes {
  title: string;
  slug: string;
}