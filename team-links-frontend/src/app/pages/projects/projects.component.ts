import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Client, Project } from '../../models/types';
import { ApiService, ProjectPayload } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    FormsModule,
    PageHeaderComponent,
    ProjectCardComponent,
    ProjectModalComponent,
    ConfirmDeleteDialogComponent,
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects = signal<Project[]>([]);
  clients = signal<Client[]>([]);
  search = '';
  loading = signal(true);

  modalOpen = false;
  editingProject: Project | null = null;

  deleteDialogOpen = false;
  projectToDelete: Project | null = null;

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadProjects();
    this.loadClients();
  }

  loadProjects() {
    this.loading.set(true);
    this.api.getProjects(0, 100).subscribe({
      next: (res) => {
        this.projects.set(res.content);
        this.loading.set(false);
      },
      error: () => {
        this.toast.error('Erro ao carregar projetos.');
        this.loading.set(false);
      }
    });
  }

  loadClients() {
    this.api.getClients(0, 100).subscribe({
      next: (res) => this.clients.set(res.content),
      error: () => this.toast.error('Erro ao carregar clientes.')
    });
  }

  filteredProjects = computed(() => {
    const q = this.search.toLowerCase();
    return this.projects().filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q) ||
      (p.clientName ?? '').toLowerCase().includes(q)
    );
  });

  openCreate() { this.editingProject = null; this.modalOpen = true; }
  openEdit(p: Project) { this.editingProject = p; this.modalOpen = true; }
  openDelete(p: Project) { this.projectToDelete = p; this.deleteDialogOpen = true; }

  onSave(data: ProjectPayload) {
    if (this.editingProject) {
      this.api.updateProject(this.editingProject.id, data).subscribe({
        next: () => { this.toast.success('Projeto atualizado!'); this.loadProjects(); },
        error: () => this.toast.error('Erro ao atualizar projeto.')
      });
    } else {
      this.api.createProject(data).subscribe({
        next: () => { this.toast.success('Projeto criado!'); this.loadProjects(); },
        error: () => this.toast.error('Erro ao criar projeto.')
      });
    }
  }

  onConfirmDelete() {
    if (this.projectToDelete) {
      this.api.deleteProject(this.projectToDelete.id).subscribe({
        next: () => { this.toast.success('Projeto excluído!'); this.loadProjects(); },
        error: () => this.toast.error('Erro ao excluir projeto.')
      });
      this.projectToDelete = null;
    }
  }
}
