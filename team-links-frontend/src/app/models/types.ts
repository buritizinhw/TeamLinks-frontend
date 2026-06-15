export interface Tag {
  id: number;
  name: string;
}

export interface Client {
  id: number;
  name: string;
  projectCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  id: number;
  name: string;
  url: string;
  description: string;
  shortUrl: string;
  clickCount: number;
  tagNames: string[];
  projectId: number;
  projectName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  clientId: number;
  clientName: string;
  linkCount: number;
  createdAt: string;
  updatedAt: string;
}
