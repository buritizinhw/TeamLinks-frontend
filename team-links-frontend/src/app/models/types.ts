export interface Tag {
  id: string;
  name: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  tags: Tag[];
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  linkCount: number;
}