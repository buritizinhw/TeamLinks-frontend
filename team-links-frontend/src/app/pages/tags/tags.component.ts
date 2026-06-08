import { Component, OnInit } from '@angular/core';
import { Tag } from '../../models/types';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { TagBadgeComponent } from '../../components/tag-badge/tag-badge.component';
import { TagModalComponent } from '../../components/tag-modal/tag-modal.component';
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [
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

  modalOpen = false;
  editingTag: Tag | null = null;

  deleteDialogOpen = false;
  tagToDelete: Tag | null = null;

  constructor(
    private data: DataService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.data.tags$.subscribe(t => this.tags = t);
  }

  openCreate() { this.editingTag = null; this.modalOpen = true; }
  openEdit(tag: Tag) { this.editingTag = tag; this.modalOpen = true; }
  openDelete(tag: Tag) { this.tagToDelete = tag; this.deleteDialogOpen = true; }

  onSave(data: { name: string }) {
    if (this.editingTag) {
      this.data.updateTag(this.editingTag.id, data);
      this.toast.success('Tag atualizada com sucesso!');
    } else {
      this.data.createTag(data);
      this.toast.success('Tag criada com sucesso!');
    }
  }

  onConfirmDelete() {
    if (this.tagToDelete) {
      this.data.deleteTag(this.tagToDelete.id);
      this.toast.success('Tag excluída com sucesso!');
      this.tagToDelete = null;
    }
  }
}