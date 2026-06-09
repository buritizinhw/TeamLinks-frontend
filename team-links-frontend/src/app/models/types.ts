export interface Tag {
  id: number;
  name: string;
}

export interface Link {
  id: number;
  title: string;
  url: string;
  tags: Tag[];
  projectId: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  linkCount: number;
}