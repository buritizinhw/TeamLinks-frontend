import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link, Project, Tag } from '../../models/types';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { LinkModalComponent } from '../../components/link-modal/link-modal.component';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';
import { TagBadgeComponent } from '../../components/tag-badge/tag-badge.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    RouterLink,
    FontAwesomeModule,
    PageHeaderComponent,
    LinkModalComponent,
    ProjectModalComponent,
    ConfirmDeleteDialogComponent,
    TagBadgeComponent,
  ],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: Project | null = null;
  projectLoading = true;
  projectNotFound = false;
  links: Link[] = [];
  tags: Tag[] = [];
  linksLoading = false;

  faPlus = faPlus;
  faPencil = faPencil;
  faTrash = faTrash;

  linkModalOpen = false;
  editingLink: Link | null = null;

  projectModalOpen = false;

  deleteDialogOpen = false;
  linkToDelete: Link | null = null;

  projectId: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idStr = params.get('id');
      const id = Number(idStr);
      if (idStr && !isNaN(id)) {
        this.projectId = id;
        this.loadProject();
        this.loadLinks();
        this.loadTags();
      } else {
        this.projectLoading = false;
        this.projectNotFound = true;
        this.toast.error('ID do projeto inválido.');
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProject() {
    if (!this.projectId) return;
    this.projectLoading = true;
    this.projectNotFound = false;
    this.api.getProjectById(this.projectId).subscribe({
      next: (p) => {
        this.project = p;
        this.projectLoading = false;
      },
      error: () => {
        this.project = null;
        this.projectNotFound = true;
        this.projectLoading = false;
        this.toast.error('Erro ao carregar projeto.');
      }
    });
  }

  loadLinks() {
    if (!this.projectId) return;
    this.linksLoading = true;
    this.api.getProjectLinks(this.projectId).subscribe({
      next: (res) => { this.links = res.content; this.linksLoading = false; },
      error: () => { this.toast.error('Erro ao carregar links.'); this.linksLoading = false; }
    });
  }

  loadTags() {
    this.api.getTags().subscribe({
      next: (res) => this.tags = res.content,
      error: () => this.toast.error('Erro ao carregar tags.')
    });
  }

  resolveTags(tagNames: string[]): Tag[] {
    return tagNames
      .map(name => this.tags.find(t => t.name === name))
      .filter((tag): tag is Tag => !!tag);
  }

  openCreateLink() { this.editingLink = null; this.linkModalOpen = true; }
  openEditLink(link: Link) { this.editingLink = link; this.linkModalOpen = true; }
  openDeleteLink(link: Link) { this.linkToDelete = link; this.deleteDialogOpen = true; }

  onSaveLink(data: { name: string; url: string; description: string; tagNames: string[] }) {
    if (!this.projectId) return;
    if (this.editingLink) {
      this.api.updateLink(this.editingLink.id, data).subscribe({
        next: () => { this.toast.success('Link atualizado!'); this.loadLinks(); this.loadProject(); },
        error: (err) => this.toast.error(this.linkErrorMessage(err, 'atualizar'))
      });
    } else {
      this.api.createLink(this.projectId, data).subscribe({
        next: () => { this.toast.success('Link adicionado!'); this.loadLinks(); this.loadProject(); },
        error: (err) => this.toast.error(this.linkErrorMessage(err, 'criar'))
      });
    }
  }

  onConfirmDeleteLink() {
    if (this.linkToDelete) {
      this.api.deleteLink(this.linkToDelete.id).subscribe({
        next: () => { this.toast.success('Link excluído!'); this.loadLinks(); this.loadProject(); },
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

  private linkErrorMessage(err: { error?: { error?: string } }, action: string): string {
    const message = err?.error?.error;
    if (message?.includes('Tag') && message.includes('não encontrada')) {
      return 'Uma ou mais tags não existem. Crie-as na página Tags antes de associá-las.';
    }
    return `Erro ao ${action} link.`;
  }
}