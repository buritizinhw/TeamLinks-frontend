import { Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Tag } from '../../models/types';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { TagBadgeComponent } from '../../components/tag-badge/tag-badge.component';
import { TagModalComponent } from '../../components/tag-modal/tag-modal.component';
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [
    FontAwesomeModule,
    PageHeaderComponent,
    TagBadgeComponent,
    TagModalComponent,
    ConfirmDeleteDialogComponent,
  ],
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {
  tags: Tag[] = [];
  loading = false;

  faPlus = faPlus;
  faPencil = faPencil;
  faTrash = faTrash;

  modalOpen = false;
  editingTag: Tag | null = null;

  deleteDialogOpen = false;
  tagToDelete: Tag | null = null;

  constructor(
    private api: ApiService,
    private toast: ToastService
  ) {}

  ngOnInit() { this.loadTags(); }

  loadTags() {
    this.loading = true;
    this.api.getTags().subscribe({
      next: (res) => { this.tags = res.content; this.loading = false; },
      error: () => { this.toast.error('Erro ao carregar tags.'); this.loading = false; }
    });
  }

  openCreate() { this.editingTag = null; this.modalOpen = true; }
  openEdit(tag: Tag) { this.editingTag = tag; this.modalOpen = true; }
  openDelete(tag: Tag) { this.tagToDelete = tag; this.deleteDialogOpen = true; }

  onSave(data: { name: string }) {
    if (this.editingTag) {
      this.api.updateTag(this.editingTag.id, data).subscribe({
        next: () => { this.toast.success('Tag atualizada!'); this.loadTags(); },
        error: () => this.toast.error('Erro ao atualizar tag.')
      });
    } else {
      this.api.createTag(data).subscribe({
        next: () => { this.toast.success('Tag criada!'); this.loadTags(); },
        error: () => this.toast.error('Erro ao criar tag.')
      });
    }
  }

  onConfirmDelete() {
    if (this.tagToDelete) {
      this.api.deleteTag(this.tagToDelete.id).subscribe({
        next: () => { this.toast.success('Tag excluída!'); this.loadTags(); },
        error: () => this.toast.error('Erro ao excluir tag.')
      });
      this.tagToDelete = null;
    }
  }
}