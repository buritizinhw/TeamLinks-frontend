export type ProjectStatus = 'INICIAR' | 'EM_ANDAMENTO' | 'CONCLUIDO';

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
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  status?: ProjectStatus;
  linkCount: number;
  createdAt: string;
  updatedAt: string;
}

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: 'INICIAR', label: 'A iniciar' },
  { value: 'EM_ANDAMENTO', label: 'Em andamento' },
  { value: 'CONCLUIDO', label: 'Concluído' },
];
