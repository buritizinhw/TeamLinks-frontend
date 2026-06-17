import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faPencil, faTrash, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Client, Link, Project, Tag } from '../../models/types';
import { ApiService, ProjectPayload } from '../../services/api.service';
import { formatDateTime } from '../../utils/date.util';
import { guessName, normalizeUrl } from '../../utils/url.util';
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
    FormsModule,
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
  project = signal<Project | null>(null);
  projectLoading = signal(true);
  projectNotFound = signal(false);
  links = signal<Link[]>([]);
  tags = signal<Tag[]>([]);
  clients = signal<Client[]>([]);
  linksLoading = signal(false);

  faPlus = faPlus;
  faPencil = faPencil;
  faTrash = faTrash;
  faCheck = faCheck;
  faTimes = faTimes;

  createLinkModalOpen = false;
  urlInput = '';
  name = '';
  description = '';
  selectedTagNames: string[] = [];
  tagMenuOpen = false;
  saving = signal(false);

  formatDateTime = formatDateTime;

  linkModalOpen = false;
  editingLink: Link | null = null;

  projectModalOpen = false;

  deleteDialogOpen = false;
  linkToDelete: Link | null = null;

  projectId: number | null = null;
  private destroy$ = new Subject<void>();
  private readonly onVisibilityChange = () => {
    if (document.visibilityState === 'visible' && this.projectId) {
      this.loadLinks(false);
    }
  };

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const idStr = params.get('id');
      const id = Number(idStr);
      if (idStr && !isNaN(id)) {
        this.projectId = id;
        this.loadProject();
        this.loadLinks();
        this.loadTags();
        this.loadClients();
      } else {
        this.projectLoading.set(false);
        this.projectNotFound.set(true);
        this.toast.error('ID do projeto inválido.');
      }
    });
  }

  ngOnDestroy() {
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProject() {
    if (!this.projectId) return;
    this.projectLoading.set(true);
    this.projectNotFound.set(false);
    this.api.getProjectById(this.projectId).subscribe({
      next: (p) => {
        this.project.set(p);
        this.projectLoading.set(false);
      },
      error: () => {
        this.project.set(null);
        this.projectNotFound.set(true);
        this.projectLoading.set(false);
        this.toast.error('Erro ao carregar projeto.');
      }
    });
  }

  loadLinks(showLoading = true) {
    if (!this.projectId) return;
    if (showLoading) this.linksLoading.set(true);
    this.api.getProjectLinks(this.projectId).subscribe({
      next: (res) => { this.links.set(res.content); this.linksLoading.set(false); },
      error: () => {
        if (showLoading) this.toast.error('Erro ao carregar links.');
        this.linksLoading.set(false);
      }
    });
  }

  onLinkClick(link: Link) {
    if (!link.shortUrl) return;

    this.links.update(list =>
      [...list]
        .map(item =>
          item.id === link.id
            ? { ...item, clickCount: (item.clickCount ?? 0) + 1 }
            : item
        )
        .sort((a, b) => (b.clickCount ?? 0) - (a.clickCount ?? 0))
    );
  }

  loadTags() {
    this.api.getTags().subscribe({
      next: (res) => this.tags.set(res.content),
      error: () => this.toast.error('Erro ao carregar tags.')
    });
  }

  loadClients() {
    this.api.getClients(0, 100).subscribe({
      next: (res) => this.clients.set(res.content),
      error: () => this.toast.error('Erro ao carregar clientes.')
    });
  }

  resolveTags(tagNames: string[]): Tag[] {
    return tagNames
      .map(name => this.tags().find(t => t.name === name))
      .filter((tag): tag is Tag => !!tag);
  }

  openCreateLink() {
    this.editingLink = null;
    this.linkModalOpen = false;
    this.createLinkModalOpen = true;
    this.urlInput = '';
    this.name = '';
    this.description = '';
    this.selectedTagNames = [];
    this.tagMenuOpen = false;
  }

  closeCreateLinkModal() {
    this.createLinkModalOpen = false;
    this.urlInput = '';
    this.name = '';
    this.tagMenuOpen = false;
  }

  applyUrlFromInput() {
    const trimmed = this.urlInput.trim();
    if (!trimmed) return;

    this.urlInput = normalizeUrl(trimmed);
    this.name = guessName(this.urlInput);
  }

  onUrlPaste() {
    setTimeout(() => this.applyUrlFromInput());
  }

  toggleTagMenu() { this.tagMenuOpen = !this.tagMenuOpen; }

  toggleTag(tagName: string) {
    this.selectedTagNames = this.selectedTagNames.includes(tagName)
      ? this.selectedTagNames.filter(n => n !== tagName)
      : [...this.selectedTagNames, tagName];
  }

  isSelected(tagName: string) { return this.selectedTagNames.includes(tagName); }

  removeTag(tagName: string) {
    this.selectedTagNames = this.selectedTagNames.filter(n => n !== tagName);
  }

  get triggerLabel() {
    return this.selectedTagNames.length
      ? `${this.selectedTagNames.length} tag(s) selecionada(s)`
      : '';
  }

  saveLink() {
    if (!this.projectId) return;

    this.applyUrlFromInput();
    if (!this.name.trim() || !this.urlInput.trim()) return;

    this.saving.set(true);
    this.api.createLink(this.projectId, {
      name: this.name.trim(),
      url: this.urlInput.trim(),
      description: this.description.trim(),
      tagNames: this.selectedTagNames,
    }).subscribe({
      next: (link) => {
        this.toast.success('Link adicionado!');
        this.saving.set(false);
        this.closeCreateLinkModal();
        this.loadLinks();
        this.loadProject();
        if (link.shortUrl) {
          navigator.clipboard?.writeText(link.shortUrl).catch(() => {});
        }
      },
      error: (err) => {
        this.saving.set(false);
        this.toast.error(this.linkErrorMessage(err, 'criar'));
      }
    });
  }

  openEditLink(link: Link) { this.editingLink = link; this.linkModalOpen = true; }
  openDeleteLink(link: Link) { this.linkToDelete = link; this.deleteDialogOpen = true; }

  onSaveLink(data: { name: string; url: string; description: string; tagNames: string[] }) {
    if (!this.projectId || !this.editingLink) return;
    this.api.updateLink(this.editingLink.id, data).subscribe({
      next: () => { this.toast.success('Link atualizado!'); this.loadLinks(); this.loadProject(); },
      error: (err) => this.toast.error(this.linkErrorMessage(err, 'atualizar'))
    });
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

  onSaveProject(data: ProjectPayload) {
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
