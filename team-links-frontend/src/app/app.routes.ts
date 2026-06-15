import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./pages/projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'projects/:id',
    loadComponent: () =>
      import('./pages/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
  },
  {
    path: 'clients',
    loadComponent: () =>
      import('./pages/clients/clients.component').then(m => m.ClientsComponent)
  },
  {
    path: 'tags',
    loadComponent: () =>
      import('./pages/tags/tags.component').then(m => m.TagsComponent)
  },
];
