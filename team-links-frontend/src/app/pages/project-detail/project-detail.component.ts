import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, Project, Tag } from '../../models/types';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { TagBadgeComponent } from '../../components/tag-badge/tag-badge.component';
import { LinkModalComponent } from '../../components/link-modal/link-modal.component';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    RouterLink,
    FontAwesomeModule,
    PageHeaderComponent,
    TagBadgeComponent,
    LinkModalComponent,
    ProjectModalComponent,
    ConfirmDeleteDialogComponent,
  ],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: Project | null = null;
  links: Link[] = [];
  tags: Tag[] = [];
  loading = false;

  faPlus = faPlus;
  faPencil = faPencil;
  faTrash = faTrash;

  linkModalOpen = false;
  editingLink: Link | null = null;

  projectModalOpen = false;

  deleteDialogOpen = false;
  linkToDelete: Link | null = null;

  private projectId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.projectId = Number(id);
        if (!isNaN(this.projectId)) {
          this.loadProject();
          this.loadLinks();
          this.loadTags();
        } else {
          this.toast.error('ID do projeto inválido.');
        }
      } else {
        this.toast.error('Projeto não encontrado.');
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProject() {
    if (!this.projectId) return;
    this.api.getProjectById(this.projectId).subscribe({
      next: (p) => this.project = p,
      error: () => this.toast.error('Erro ao carregar projeto.')
    });
  }

  loadLinks() {
    if (!this.projectId) return;
    this.loading = true;
    this.api.getProjectLinks(this.projectId).subscribe({
      next: (res) => { this.links = res.content; this.loading = false; },
      error: () => { this.toast.error('Erro ao carregar links.'); this.loading = false; }
    });
  }

  loadTags() {
    this.api.getTags().subscribe({
      next: (res) => this.tags = res.content,
      error: () => this.toast.error('Erro ao carregar tags.')
    });
  }

  openCreateLink() { this.editingLink = null; this.linkModalOpen = true; }
  openEditLink(link: Link) { this.editingLink = link; this.linkModalOpen = true; }
  openDeleteLink(link: Link) { this.linkToDelete = link; this.deleteDialogOpen = true; }

  onSaveLink(data: { title: string; url: string; tagIds: number[] }) {
    if (!this.projectId) return;
    
    if (this.editingLink) {
      this.api.updateLink(this.editingLink.id, data).subscribe({
        next: () => { this.toast.success('Link atualizado!'); this.loadLinks(); },
        error: () => this.toast.error('Erro ao atualizar link.')
      });
    } else {
      this.api.createLink(this.projectId, data).subscribe({
        next: () => { this.toast.success('Link adicionado!'); this.loadLinks(); },
        error: () => this.toast.error('Erro ao criar link.')
      });
    }
  }

  onConfirmDeleteLink() {
    if (this.linkToDelete) {
      this.api.deleteLink(this.linkToDelete.id).subscribe({
        next: () => { this.toast.success('Link excluído!'); this.loadLinks(); },
        error: () => this.toast.error('Erro ao excluir link.')
      });
      this.linkToDelete = null;
    }
  }

  onSaveProject(data: { name: string; description: string }) {
    if (!this.projectId) return;
    
    this.api.updateProject(this.projectId, data).subscribe({
      next: () => { this.toast.success('Projeto atualizado!'); this.loadProject(); },
      error: () => this.toast.error('Erro ao atualizar projeto.')
    });
  }
}