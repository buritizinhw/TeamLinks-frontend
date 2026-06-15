import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, Link, Tag, Client } from '../models/types';

export interface ProjectPayload {
  name: string;
  description: string;
  clientId: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // --- Clients ---
  getClients(page = 0, size = 50): Observable<PageResponse<Client>> {
    return this.http.get<PageResponse<Client>>(`${this.base}/clients?page=${page}&size=${size}`);
  }

  createClient(data: { name: string }): Observable<Client> {
    return this.http.post<Client>(`${this.base}/clients`, data);
  }

  updateClient(id: number, data: { name: string }): Observable<Client> {
    return this.http.put<Client>(`${this.base}/clients/${id}`, data);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/clients/${id}`);
  }

  // --- Projects ---
  getProjects(page = 0, size = 20): Observable<PageResponse<Project>> {
    return this.http.get<PageResponse<Project>>(`${this.base}/projects?page=${page}&size=${size}`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.base}/projects/${id}`);
  }

  createProject(data: ProjectPayload): Observable<Project> {
    return this.http.post<Project>(`${this.base}/projects`, data);
  }

  updateProject(id: number, data: ProjectPayload): Observable<Project> {
    return this.http.put<Project>(`${this.base}/projects/${id}`, data);
  }

  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/projects/${id}`);
  }

  getProjectLinks(projectId: number, page = 0, size = 50): Observable<PageResponse<Link>> {
    return this.http.get<PageResponse<Link>>(
      `${this.base}/projects/${projectId}/links?page=${page}&size=${size}&sort=clickCount,desc`
    );
  }

  // --- Links ---
  createLink(projectId: number, data: { name: string; url: string; description: string; tagNames: string[] }): Observable<Link> {
    return this.http.post<Link>(`${this.base}/links/project/${projectId}`, data);
  }

  updateLink(id: number, data: { name: string; url: string; description: string; tagNames: string[] }): Observable<Link> {
    return this.http.put<Link>(`${this.base}/links/${id}`, data);
  }

  deleteLink(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/links/${id}`);
  }

  // --- Tags ---
  getTags(page = 0, size = 50): Observable<PageResponse<Tag>> {
    return this.http.get<PageResponse<Tag>>(`${this.base}/tags?page=${page}&size=${size}`);
  }

  createTag(data: { name: string }): Observable<Tag> {
    return this.http.post<Tag>(`${this.base}/tags`, data);
  }

  updateTag(id: number, data: { name: string }): Observable<Tag> {
    return this.http.put<Tag>(`${this.base}/tags/${id}`, data);
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/tags/${id}`);
  }
}
