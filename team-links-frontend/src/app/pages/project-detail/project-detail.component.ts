import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Link, Project, Tag } from '../../models/types';
import { DataService } from '../../services/data.service';
import { ToastService } from '../../services/toast.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { TagBadgeComponent } from '../../components/tag-badge/tag-badge.component';
import { LinkModalComponent } from '../../components/link-modal/link-modal.component';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { ConfirmDeleteDialogComponent } from '../../components/confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    RouterLink,
    PageHeaderComponent,
    TagBadgeComponent,
    LinkModalComponent,
    ProjectModalComponent,
    ConfirmDeleteDialogComponent,
  ],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  links: Link[] = [];
  tags: Tag[] = [];

  linkModalOpen = false;
  editingLink: Link | null = null;

  projectModalOpen = false;

  deleteDialogOpen = false;
  linkToDelete: Link | null = null;

  constructor(
    private route: ActivatedRoute,
    private data: DataService,
    private toast: ToastService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.data.projects$.subscribe(ps => {
      this.project = ps.find(p => p.id === id) ?? null;
    });
    this.data.getLinks$(id).subscribe(ls => this.links = ls);
    this.data.tags$.subscribe(ts => this.tags = ts);
  }

  get projectId() {
    return this.route.snapshot.paramMap.get('id')!;
  }

  openCreateLink() { this.editingLink = null; this.linkModalOpen = true; }
  openEditLink(link: Link) { this.editingLink = link; this.linkModalOpen = true; }
  openDeleteLink(link: Link) { this.linkToDelete = link; this.deleteDialogOpen = true; }

  onSaveLink(data: { title: string; url: string; tagIds: string[] }) {
    if (this.editingLink) {
      this.data.updateLink(this.editingLink.id, this.projectId, data);
      this.toast.success('Link atualizado com sucesso!');
    } else {
      this.data.createLink(this.projectId, data);
      this.toast.success('Link adicionado com sucesso!');
    }
  }

  onConfirmDeleteLink() {
    if (this.linkToDelete) {
      this.data.deleteLink(this.linkToDelete.id, this.projectId);
      this.toast.success('Link excluído com sucesso!');
      this.linkToDelete = null;
    }
  }

  onSaveProject(data: { name: string; description: string }) {
    this.data.updateProject(this.projectId, data);
    this.toast.success('Projeto atualizado com sucesso!');
  }
}