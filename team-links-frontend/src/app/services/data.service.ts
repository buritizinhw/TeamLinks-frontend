import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Project, Link, Tag } from '../models/types';

const MOCK_TAGS: Tag[] = [
  { id: '1', name: 'backend' },
  { id: '2', name: 'frontend' },
  { id: '3', name: 'repositorio' },
  { id: '4', name: 'design' },
  { id: '5', name: 'ia' },
  { id: '6', name: 'comunicacao' },
  { id: '7', name: 'testes' },
  { id: '8', name: 'deploy' },
  { id: '9', name: 'documentacao' },
];

const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'TeamLinks', description: 'Sistema de gerenciamento de links para projetos', linkCount: 3 },
  { id: '2', name: 'E-commerce API', description: 'API REST para plataforma de e-commerce', linkCount: 2 },
  { id: '3', name: 'Dashboard Analytics', description: 'Painel de análise de dados em tempo real', linkCount: 4 },
  { id: '4', name: 'Mobile App', description: 'Aplicativo móvel multiplataforma', linkCount: 5 },
];

const MOCK_LINKS: Record<string, Link[]> = {
  '1': [
    { id: '1', title: 'GitHub - TeamLinks', url: 'https://github.com/teamlinks', tags: [MOCK_TAGS[2], MOCK_TAGS[0]], projectId: '1' },
    { id: '2', title: 'Documentação Spring Boot', url: 'https://spring.io/projects/spring-boot', tags: [MOCK_TAGS[8], MOCK_TAGS[0]], projectId: '1' },
    { id: '3', title: 'Swagger UI', url: 'http://localhost:8080/swagger-ui.html', tags: [MOCK_TAGS[8], MOCK_TAGS[0]], projectId: '1' },
  ],
  '2': [
    { id: '4', title: 'API Documentation', url: 'https://api.ecommerce.dev/docs', tags: [MOCK_TAGS[8], MOCK_TAGS[0]], projectId: '2' },
    { id: '5', title: 'Figma Designs', url: 'https://figma.com/file/ecommerce', tags: [MOCK_TAGS[3], MOCK_TAGS[1]], projectId: '2' },
  ],
  '3': [
    { id: '6', title: 'Grafana Dashboard', url: 'https://grafana.analytics.dev', tags: [MOCK_TAGS[0]], projectId: '3' },
    { id: '7', title: 'Prometheus Metrics', url: 'https://prometheus.analytics.dev', tags: [MOCK_TAGS[0]], projectId: '3' },
    { id: '8', title: 'Design System', url: 'https://design.analytics.dev', tags: [MOCK_TAGS[3], MOCK_TAGS[1]], projectId: '3' },
    { id: '9', title: 'CI/CD Pipeline', url: 'https://github.com/analytics/actions', tags: [MOCK_TAGS[7]], projectId: '3' },
  ],
  '4': [
    { id: '10', title: 'App Store Connect', url: 'https://appstoreconnect.apple.com', tags: [MOCK_TAGS[7]], projectId: '4' },
    { id: '11', title: 'Google Play Console', url: 'https://play.google.com/console', tags: [MOCK_TAGS[7]], projectId: '4' },
    { id: '12', title: 'Firebase Console', url: 'https://console.firebase.google.com', tags: [MOCK_TAGS[0]], projectId: '4' },
    { id: '13', title: 'Expo Dashboard', url: 'https://expo.dev', tags: [MOCK_TAGS[1]], projectId: '4' },
    { id: '14', title: 'TestFlight', url: 'https://testflight.apple.com', tags: [MOCK_TAGS[6]], projectId: '4' },
  ],
};

@Injectable({ providedIn: 'root' })
export class DataService {
  private _projects = new BehaviorSubject<Project[]>(MOCK_PROJECTS);
  private _tags = new BehaviorSubject<Tag[]>(MOCK_TAGS);
  private _links: Record<string, BehaviorSubject<Link[]>> = {};

  projects$ = this._projects.asObservable();
  tags$ = this._tags.asObservable();

  constructor() {
    Object.keys(MOCK_LINKS).forEach(pid => {
      this._links[pid] = new BehaviorSubject<Link[]>(MOCK_LINKS[pid]);
    });
  }

  getProjects() { return this._projects.value; }
  getProjectById(id: string) { return this._projects.value.find(p => p.id === id); }

  createProject(data: { name: string; description: string }): Project {
    const project: Project = { id: String(Date.now()), linkCount: 0, ...data };
    this._projects.next([project, ...this._projects.value]);
    this._links[project.id] = new BehaviorSubject<Link[]>([]);
    return project;
  }

  updateProject(id: string, data: { name: string; description: string }) {
    this._projects.next(this._projects.value.map(p => p.id === id ? { ...p, ...data } : p));
  }

  deleteProject(id: string) {
    this._projects.next(this._projects.value.filter(p => p.id !== id));
    delete this._links[id];
  }

  getLinks$(projectId: string) {
    if (!this._links[projectId]) {
      this._links[projectId] = new BehaviorSubject<Link[]>([]);
    }
    return this._links[projectId].asObservable();
  }

  getLinks(projectId: string): Link[] {
    return this._links[projectId]?.value ?? [];
  }

  createLink(projectId: string, data: { title: string; url: string; tagIds: string[] }): Link {
    const tags = this._tags.value.filter(t => data.tagIds.includes(t.id));
    const link: Link = { id: String(Date.now()), projectId, title: data.title, url: data.url, tags };
    if (!this._links[projectId]) this._links[projectId] = new BehaviorSubject<Link[]>([]);
    this._links[projectId].next([...this._links[projectId].value, link]);
    this._projects.next(this._projects.value.map(p => p.id === projectId ? { ...p, linkCount: p.linkCount + 1 } : p));
    return link;
  }

  updateLink(linkId: string, projectId: string, data: { title: string; url: string; tagIds: string[] }) {
    const tags = this._tags.value.filter(t => data.tagIds.includes(t.id));
    this._links[projectId].next(
      this._links[projectId].value.map(l => l.id === linkId ? { ...l, title: data.title, url: data.url, tags } : l)
    );
  }

  deleteLink(linkId: string, projectId: string) {
    this._links[projectId].next(this._links[projectId].value.filter(l => l.id !== linkId));
    this._projects.next(this._projects.value.map(p => p.id === projectId ? { ...p, linkCount: Math.max(0, p.linkCount - 1) } : p));
  }

  getTags() { return this._tags.value; }

  createTag(data: { name: string }): Tag {
    const tag: Tag = { id: String(Date.now()), name: data.name.toLowerCase() };
    this._tags.next([...this._tags.value, tag]);
    return tag;
  }

  updateTag(id: string, data: { name: string }) {
    this._tags.next(this._tags.value.map(t => t.id === id ? { ...t, name: data.name.toLowerCase() } : t));
  }

  deleteTag(id: string) {
    this._tags.next(this._tags.value.filter(t => t.id !== id));
  }
}