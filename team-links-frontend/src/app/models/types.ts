export interface Tag {
  id: number;
  name: string;
}

export interface Link {
  id: number;
  name: string;
  url: string;
  description: string;
  shortUrl: string;
  tagNames: string[];
  projectId: number;
  projectName: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  linkCount: number;
}